import { PopupProps } from "./popup.interface";
import styles from "./popup.module.css";

export const Popup = ({ togglePopup, children }: PopupProps) => {
  return (
    <>
      <div className={styles.popupOverlay} onClick={togglePopup} />
      <div className={styles.popup}>{children}</div>
    </>
  );
};
