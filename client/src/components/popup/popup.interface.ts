import { ReactNode } from "react";

export interface PopupProps {
  togglePopup: () => void;
  children: ReactNode;
}
