import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./create-poll-form.module.css";
import {
  FETCH_BAD_REQUEST,
  FETCH_SUCCESS_CREATE_POLL,
  FORM_ERROR_SPACE,
  FORM_PLACEHOLDER_OPTION_TITLE,
  FORM_PLACEHOLDER_POLL_QUESTION,
  MAX_LENGTH_OPTION_TITLE,
  MAX_LENGTH_POLL_QUESTION,
} from "../../constants";
import {
  CreateFormPollI,
  ErrorFormPollI,
} from "../../interfaces/form.interface";
import { createPoll } from "../../services/api";

export const CreateFormPoll = () => {
  const [formState, setFormState] = useState<CreateFormPollI>({
    question: "",
    options: ["", ""],
  });
  const [errorState, setErrorState] = useState<ErrorFormPollI>({
    question: "",
    options: ["", ""],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [fail, setFail] = useState<string>("");

  const handleChangeQuestion = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue[0] === " ") {
      return newValue.match(/[^ ]/)
        ? setErrorState((state) => {
            return {
              ...state,
              question: "",
            };
          })
        : setErrorState((state) => {
            return {
              ...state,
              question: FORM_ERROR_SPACE,
            };
          });
    }
    setSuccess(false);
    setFail("");
    setFormState((state) => {
      return { ...state, question: e.target.value };
    });
    setErrorState((state) => {
      return {
        ...state,
        question: "",
      };
    });
  };

  const handleChangeTitle = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = e.target.value;
    if (newValue[0] === " ") {
      return newValue.match(/[^ ]/)
        ? setErrorState((state) => {
            return {
              ...state,
              options: state.options.map((option, optionIndex) =>
                optionIndex !== index ? option : ""
              ),
            };
          })
        : setErrorState((state) => {
            return {
              ...state,
              options: state.options.map((option, optionIndex) =>
                optionIndex !== index ? option : FORM_ERROR_SPACE
              ),
            };
          });
    }
    setSuccess(false);
    setFail("");
    setFormState((state) => {
      return {
        ...state,
        options: state.options.map((option, optionIndex) =>
          optionIndex !== index ? option : e.target.value
        ),
      };
    });
    setErrorState((state) => {
      return {
        ...state,
        options: state.options.map((option, optionIndex) =>
          optionIndex !== index ? option : ""
        ),
      };
    });
  };

  const handleAddOption = () => {
    setSuccess(false);
    setFail("");
    setErrorState((state) => {
      return { ...state, options: [...state.options, ""] };
    });
    setFormState((state) => {
      return { ...state, options: [...state.options, ""] };
    });
  };

  const handleDeleteOption = (index: number) => {
    setSuccess(false);
    setFail("");
    setErrorState((state) => {
      return {
        ...state,
        options: state.options.filter(
          (_, indexOption) => index !== indexOption
        ),
      };
    });
    setFormState((state) => {
      return {
        ...state,
        options: state.options.filter(
          (_, indexOption) => index !== indexOption
        ),
      };
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const trimedQuestion = formState.question.replace(/\s+/g, " ").trim();
    const trimedOptionsTitles = formState.options.map((option) => {
      return { title: option.replace(/\s+/g, " ").trim() };
    });
    const createPollDto = {
      question: trimedQuestion,
      options: trimedOptionsTitles,
    };

    const fetchCreatePoll = async () => {
      try {
        const data = await createPoll(createPollDto);
        if (data.id) {
          setFail("");
          setSuccess(true);
        }
      } catch (error: any) {
        setSuccess(false);
        error.statusCode === 400
          ? setFail(FETCH_BAD_REQUEST + " " + error.message)
          : setFail(`${error.message} - Статус: ${error.statusCode}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatePoll();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.box}>
        <h3>Конструктор опросника</h3>
        <div className={styles.inputPollQuestionForm}>
          <input
            type="text"
            placeholder={FORM_PLACEHOLDER_POLL_QUESTION}
            maxLength={MAX_LENGTH_POLL_QUESTION}
            value={formState.question}
            onChange={handleChangeQuestion}
            className={styles.inputPollQuestion}
            id="poll-question"
            name="pollQuestion"
          />
          <span
            className={styles.count}
          >{`${formState.question.length}/${MAX_LENGTH_POLL_QUESTION}`}</span>
          {errorState.question && (
            <span className={styles.error}>{errorState.question}</span>
          )}
        </div>
        {formState.options.map((option, index) => {
          return (
            <div className={styles.inputOptionTitleForm} key={index}>
              <div className={styles.inputOptionWithDelete}>
                <input
                  type="text"
                  placeholder={FORM_PLACEHOLDER_OPTION_TITLE}
                  maxLength={MAX_LENGTH_OPTION_TITLE}
                  value={option}
                  onChange={(e) => handleChangeTitle(e, index)}
                  className={styles.inputOptionTitle}
                  id={`option-title-${index}`}
                  name={`optionTitle-${index}`}
                />
                {index > 1 && (
                  <button
                    className={styles.deleteOption}
                    type="button"
                    onClick={() => handleDeleteOption(index)}
                  >
                    X
                  </button>
                )}
              </div>
              <span
                className={styles.count}
              >{`${formState.options[index].length}/${MAX_LENGTH_OPTION_TITLE}`}</span>
              {errorState.options[index] && (
                <span className={styles.error}>
                  {errorState.options[index]}
                </span>
              )}
            </div>
          );
        })}
        <button
          className={styles.addOption}
          disabled={formState.options.length >= 10}
          type="button"
          onClick={handleAddOption}
        >
          +
        </button>
      </div>

      <button
        className={styles.button}
        type="submit"
        disabled={
          isLoading ||
          !formState.question ||
          !!errorState.question ||
          errorState.options.filter((option) => !!option).length > 0 ||
          formState.options.filter((option) => !option).length > 0
        }
      >
        Создать
      </button>
      {success && (
        <span className={styles.success}>{FETCH_SUCCESS_CREATE_POLL}</span>
      )}
      {fail && <span className={styles.error}>{fail}</span>}
    </form>
  );
};
