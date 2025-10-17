// ...existing code...
import React from "react";
import styles from "../styles/SetPiceButton.module.css";
import type { TireRow } from "./UserTireTable";
import up100 from "../assets/icons/100aa.png";
import up50 from "../assets/icons/50aa.png";
import checkIcon from "../assets/icons/check-mark.png";

type Props = {
  row: TireRow;
  onRound100: () => void;
  onRound50: () => void;
  onExit: () => void;
};

const SetPriceButton: React.FC<Props> = ({
  row,
  onRound100,
  onRound50,
  onExit,
}) => {
  const sidewallName =
    row.tcps_sidewall_name && row.tcps_sidewall_name.trim() !== ""
      ? row.tcps_sidewall_name
      : "--";

  return (
    <div className={styles.capsuleBar}>
      <div className={styles.info}>{row.tcps_tb_name}</div>
      <div className={styles.info}>{row.tcps_tbi_name}</div>
      <div className={styles.info}>{sidewallName}</div>
      <div className={styles.actionGroup}>
        {/* เปลี่ยนเป็นปุ่มไอคอนเต็มพื้นที่ (เหมือนปุ่ม exit) */}
        <button
          className={styles.icon}
          onMouseDown={onRound100}
          title="ปัดเต็ม 100"
          aria-label="ปัดเต็ม 100"
        >
          <img src={up100} alt="ปัดเต็ม 100" />
        </button>

        <button
          className={styles.icon}
          onMouseDown={onRound50}
          title="ปัดเต็ม 50"
          aria-label="ปัดเต็ม 50"
        >
          <img src={up50} alt="ปัดเต็ม 50" />
        </button>

        <button
          className={styles.icon}
          onMouseDown={onExit}
          title="ออกจากโหมดแก้ไข"
          aria-label="ออกจากโหมดแก้ไข"
        >
          <img src={checkIcon} alt="exit" />
        </button>
      </div>
    </div>
  );
};

export default SetPriceButton;
// ...existing code...
