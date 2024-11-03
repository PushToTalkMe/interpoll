export interface OptionProps {
  title: string;
  votes: number;
  index: number;
  isVote: boolean;
  isLoadingVote: boolean;
  handleClickOption: (index: number) => void;
}
