import React from "react";
import styles from "../styles/SetPiceButton.module.css";
import type { TireRow } from "./UserTireTable";

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
        <button
          className={styles.action}
          onMouseDown={onRound100}
          title="ปัดเต็ม 100"
        >
          <img
            src="/icons/round100.svg"
            alt="ปัดเต็ม 100"
            style={{ width: 24, height: 24 }}
          />
        </button>
        <button
          className={styles.action}
          onMouseDown={onRound50}
          title="ปัดเต็ม 50"
        >
          <img
            src="/icons/round50.svg"
            alt="ปัดเต็ม 50"
            style={{ width: 24, height: 24 }}
          />
        </button>
        <button
          className={styles.icon}
          onMouseDown={onExit}
          title="ออกจากโหมดแก้ไข"
        >
          <img
            src="/icons/exit.svg"
            alt="exit"
            style={{ width: 24, height: 24 }}
          />
        </button>
      </div>
    </div>
  );
};

export default SetPriceButton;
