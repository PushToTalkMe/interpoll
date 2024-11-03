import { OptionProps } from "./option.interface";
import styles from "./option.module.css";
import cn from "classnames";

export const Option = ({
  index,
  title,
  votes,
  isVote,
  isLoadingVote,
  handleClickOption,
}: OptionProps) => {
  return (
    <div
      className={cn(styles.option, {
        [styles.loading]: isLoadingVote === true,
      })}
    >
      {isVote ? (
        <p className={styles.votes}>{votes}</p>
      ) : (
        <button
          className={styles.button}
          onClick={() => handleClickOption(index)}
          disabled={isLoadingVote}
        >
          {title}
        </button>
      )}
    </div>
  );
};
