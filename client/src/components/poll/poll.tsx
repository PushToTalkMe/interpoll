import { useEffect, useState } from "react";
import { Option } from "../option/option";
import { PollProps } from "./poll.interface";
import styles from "./poll.module.css";
import { deletePoll, vote } from "../../services/api";
import {
  FETCH_BAD_REQUEST,
  FETCH_SUCCESS_VOTE,
  STATE_IS_VOTE,
} from "../../constants";

export const Poll = ({ id, options, question, setPolls }: PollProps) => {
  const [isVote, setIsVote] = useState(false);
  const [failVote, setFailVote] = useState("");
  const [successVote, setSuccessVote] = useState(false);
  const [isLoadingVote, setIsLoadingVote] = useState(false);
  const [failDelete, setFailDelete] = useState("");
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  useEffect(() => {
    setIsVote(!!sessionStorage.getItem(`poll-${id}`));
  }, []);

  const handleClickOption = (index: number) => {
    setIsLoadingVote(true);
    const fetchVote = async () => {
      try {
        const data = await vote(id, { optionIndex: index });
        if (data.id) {
          setIsVote(true);
          sessionStorage.setItem(`poll-${id}`, "isVote");
          setPolls((state) =>
            state.map((poll) => (poll.id === data.id ? data : poll))
          );
          setFailVote("");
          setSuccessVote(true);
        }
      } catch (error: any) {
        setSuccessVote(false);
        error.statusCode === 400
          ? FETCH_BAD_REQUEST + " " + error.message
          : `${error.message} - Статус: ${error.statusCode}`;
      } finally {
        setIsLoadingVote(false);
      }
    };

    fetchVote();
  };

  const handleDeletePoll = (id: number) => {
    setIsLoadingDelete(true);
    const fetchDelete = async () => {
      try {
        const poll = await deletePoll(id);
        if (poll.id) {
          setFailDelete("");
        }
      } catch (error: any) {
        setSuccessVote(false);
        error.statusCode === 400
          ? FETCH_BAD_REQUEST + " " + error.message
          : `${error.message} - Статус: ${error.statusCode}`;
      } finally {
        setIsLoadingDelete(false);
      }
    };

    fetchDelete();
  };

  return (
    <div className={styles.poll}>
      <h2 className={styles.question}>{question}</h2>
      <div className={styles.options}>
        {options.map((option, index) => (
          <Option
            key={id + index}
            title={option.title}
            votes={option.votes}
            index={index}
            isVote={isVote}
            isLoadingVote={isLoadingVote}
            handleClickOption={handleClickOption}
          ></Option>
        ))}
      </div>
      <button
        className={styles.button}
        onClick={() => handleDeletePoll(id)}
        disabled={isLoadingDelete}
      >
        X
      </button>
      {successVote && (
        <span className={styles.success}>{FETCH_SUCCESS_VOTE}</span>
      )}
      {isVote && !successVote && (
        <span className={styles.isVote}>{STATE_IS_VOTE}</span>
      )}
      {failDelete && <span className={styles.error}>{failDelete}</span>}
      {failVote && <span className={styles.error}>{failVote}</span>}
    </div>
  );
};
