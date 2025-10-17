import React from "react";
import styles from "../styles/ConfirmEditModal.module.css";
import type { PriceKeys } from "./UserTireTable";

type ChangeItem = {
  field: PriceKeys;
  original: number;
  current: number;
};

type ModalRow = {
  tcps_id?: string;
  tcps_tb_name: string;
  tcps_tbi_name: string;
  tcps_sidewall_name?: string;
  changes: ChangeItem[];
};

type Props = {
  open: boolean;
  rows: ModalRow[];
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

const fieldLabel: Record<PriceKeys, string> = {
  tcps_price_r13: "R13",
  tcps_price_r14: "R14",
  tcps_price_r15: "R15",
  tcps_price_r16: "R16",
  tcps_price_r17: "R17",
  tcps_price_r18: "R18",
  tcps_price_r19: "R19",
  tcps_price_r20: "R20",
  tcps_price_r21: "R21",
  tcps_price_r22: "R22",
  tcps_price_trade_in: "Trade-in",
};

const ConfirmEditModal: React.FC<Props> = ({
  open,
  rows,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="close"
        >
          <img
            src="/icons/gabad.svg"
            alt="close"
            style={{ width: 20, height: 20 }}
          />
        </button>
        <h3 className={styles.title}>โปรดตรวจสอบการแก้ไขก่อนยืนยัน</h3>
        <div className={styles.body}>
          {rows.length === 0 ? (
            <div className={styles.empty}>ไม่มีการแก้ไข</div>
          ) : (
            rows.map((r, idx) => (
              <div key={r.tcps_id ?? idx} className={styles.rowItem}>
                <div className={styles.rowHeader}>
                  <div className={styles.brand}>{r.tcps_tb_name}</div>
                  <div className={styles.pattern}>{r.tcps_tbi_name}</div>
                  <div className={styles.sidewall}>
                    {r.tcps_sidewall_name ?? "-"}
                  </div>
                </div>
                <div className={styles.changeList}>
                  {r.changes.map((c) => (
                    <div className={styles.changeRow} key={c.field}>
                      <div className={styles.changeField}>
                        {fieldLabel[c.field]}
                      </div>
                      <div className={styles.changeVals}>
                        <span className={styles.orig}>{c.original}</span>
                        <span className={styles.arrow}>→</span>
                        <span className={styles.curr}>{c.current}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmBtn} onClick={() => onConfirm()}>
            ยืนยันการแก้ไข
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEditModal;
