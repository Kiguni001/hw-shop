import React, { useState, useMemo } from "react";
import styles from "../styles/UserTireTable.module.css";

export type PriceKeys =
  | "tcps_price_r13"
  | "tcps_price_r14"
  | "tcps_price_r15"
  | "tcps_price_r16"
  | "tcps_price_r17"
  | "tcps_price_r18"
  | "tcps_price_r19"
  | "tcps_price_r20"
  | "tcps_price_r21"
  | "tcps_price_r22"
  | "tcps_price_trade_in";

export type TireRow = {
  id: number;
  tcps_ub_id: string;
  tcps_tb_name: string;
  tcps_tbi_name: string;
  tcps_sidewall_name: string;
} & {
  [K in PriceKeys]?: number;
};

type Props = {
  rows: TireRow[];
  userUbId: string;
  validatePrice: (field: string, value: number) => boolean;
};

const UserTireTable: React.FC<Props> = ({ rows, userUbId, validatePrice }) => {
  const [edited, setEdited] = useState<{
    [key: string]: "valid" | "invalid" | "edited";
  }>({});

  // กรอง row ที่ตรงกับ userUbId
  const filteredRows = useMemo(
    () => rows.filter((row) => row.tcps_ub_id === userUbId),
    [rows, userUbId]
  );

  const handleEdit = (
    rowIndex: number,
    field: keyof TireRow,
    value: number
  ) => {
    const newRows = [...filteredRows];
    if (isPriceKey(field)) {
      newRows[rowIndex][field] = value;
    }

    const key = `${rowIndex}-${field}`;
    if (!validatePrice(field as string, value)) {
      setEdited((prev) => ({ ...prev, [key]: "invalid" }));
    } else {
      setEdited((prev) => ({ ...prev, [key]: "edited" }));
    }
  };

  function isPriceKey(key: keyof TireRow): key is PriceKeys {
    return key.startsWith("tcps_price_");
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Pattern</th>
            <th>Sidewall</th>
            <th>R13</th>
            <th>R14</th>
            <th>R15</th>
            <th>R16</th>
            <th>R17</th>
            <th>R18</th>
            <th>R19</th>
            <th>R20</th>
            <th>R21</th>
            <th>R22</th>
            <th>Trade-in</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, rowIndex) => (
            <tr key={row.id}>
              <td>{row.tcps_tb_name}</td>
              <td>{row.tcps_tbi_name}</td>
              <td>{row.tcps_sidewall_name}</td>
              {(Object.keys(row) as (keyof TireRow)[])
                .filter((k) => isPriceKey(k))
                .map((field) => {
                  const key = `${row.id}-${field}`; // ใช้ row.id + field เป็น key
                  let cellClass = "";
                  if (edited[key] === "invalid")
                    cellClass += ` ${styles.invalid}`;
                  else if (edited[key] === "edited")
                    cellClass += ` ${styles.edited}`;

                  return (
                    <td key={key} className={cellClass}>
                      <input
                        type="number"
                        value={row[field] ?? ""}
                        onChange={(e) =>
                          handleEdit(rowIndex, field, Number(e.target.value))
                        }
                        className={styles.inputCell}
                      />
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTireTable;
