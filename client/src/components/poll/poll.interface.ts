import { Dispatch } from "react";
import { OptionI, PollI } from "../../interfaces/api.interface";

export interface PollProps {
  id: number;
  question: string;
  options: OptionI[];
  setPolls: Dispatch<React.SetStateAction<PollI[]>>;
}
