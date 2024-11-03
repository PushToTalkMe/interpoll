import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";
import { PollI } from "../../interfaces/api.interface";
import { getPolls } from "../../services/api";
import { Poll } from "../../components/poll/poll";
import { Popup } from "../../components/popup/popup";
import { CreateFormPoll } from "../../components/create-poll-form/create-poll-form";
import { FETCH_FAILED } from "../../constants";
import { usePollSocket } from "../../services/ws";
import { HomeProps } from "./home.interface";

export const Home = ({ initialPolls }: HomeProps) => {
  const [popup, setPopup] = useState(false);
  const [polls, setPolls] = useState<PollI[]>(initialPolls);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialPolls.length);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPolls = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await getPolls(page, 10);
      if (data.length > 0) {
        setPolls((state) => [...state, ...data]);
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      setError(
        error.message === "Failed to fetch"
          ? FETCH_FAILED
          : `${error.message} - Статус: ${error.statusCode}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
          fetchPolls(page + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, hasMore]);

  usePollSocket(setPolls);

  const togglePopup = () => setPopup((popup) => !popup);

  const renderPolls = () => {
    if (!polls.length) return <span>Опросников пока нет, будьте первыми!</span>;

    return (
      <div className={styles.polls}>
        {polls.map((poll) => (
          <Poll key={poll.id} {...poll} setPolls={setPolls} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.home}>
      {popup && (
        <Popup togglePopup={togglePopup}>
          <CreateFormPoll />
        </Popup>
      )}
      <h2 className={styles.title}>Ваше мнение важно для нас!</h2>
      <button
        className={styles.button}
        onClick={togglePopup}
        disabled={!!error || isLoading}
      >
        Создать опросник
      </button>
      {renderPolls()}
      {hasMore && (
        <div
          ref={observerRef}
          style={{ height: "20px", backgroundColor: "transparent" }}
        >
          {isLoading && <div>Загрузка...</div>}
        </div>
      )}

      {error && <span>{error}</span>}
    </div>
  );
};
