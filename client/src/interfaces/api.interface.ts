export interface PollI {
  id: number;
  question: string;
  options: OptionI[];
}

export interface OptionI {
  title: string;
  votes: number;
}

export interface CreatePollDto {
  question: string;
  options: OptionTitleDto[];
}

export interface OptionTitleDto {
  title: string;
}

export interface VoteDto {
  optionIndex: number;
}
