import React, { useEffect, useState } from "react";
import styles from "../styles/UserTireTable.module.css";

type PriceKeys =
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

type TireRow = {
  id: number;
  tcps_ub_id: string;
  tcps_tb_name: string;
  tcps_tbi_name: string;
  tcps_sidewall_name: string;
} & {
  [K in PriceKeys]?: number;
};

type Props = {
  userUbId: string; // tcps_ub_id ของ user ปัจจุบัน
  validatePrice: (field: string, value: number) => boolean;
};

const UserTireTable: React.FC<Props> = ({ userUbId, validatePrice }) => {
  const [rows, setRows] = useState<TireRow[]>([]);
  const [edited, setEdited] = useState<{
    [key: string]: "valid" | "invalid" | "edited";
  }>({});

  // fetch data จาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/user_tire?userUbId=${userUbId}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch data");

        const data: TireRow[] = await res.json();
        setRows(data); // ตอนนี้ได้เฉพาะ row ของ user ปัจจุบัน
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userUbId]);

  const handleEdit = (
    rowIndex: number,
    field: keyof TireRow,
    value: number
  ) => {
    const newRows = [...rows];

    if (isPriceKey(field)) {
      newRows[rowIndex][field] = Number(value);
    }

    const key = `${rowIndex}-${field}`;
    if (!validatePrice(field as string, Number(value))) {
      setEdited((prev) => ({ ...prev, [key]: "invalid" }));
    } else {
      setEdited((prev) => ({ ...prev, [key]: "edited" }));
    }

    setRows(newRows);
  };

  // helper function
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
          {rows.map((row, rowIndex) => (
            <tr key={row.id}>
              <td>{row.tcps_tb_name}</td>
              <td>{row.tcps_tbi_name}</td>
              <td>{row.tcps_sidewall_name}</td>
              {Object.keys(row)
                .filter((k): k is PriceKeys => k.includes("price"))
                .map((field) => {
                  const key = `${rowIndex}-${field}`;
                  let cellClass = "";
                  if (edited[key] === "invalid")
                    cellClass += ` ${styles.invalid}`;
                  else if (edited[key] === "edited")
                    cellClass += ` ${styles.edited}`;

                  return (
                    <td key={field} className={cellClass}>
                      <input
                        type="number"
                        value={row[field] ?? ""}
                        onChange={(e) =>
                          handleEdit(
                            rowIndex,
                            field as keyof TireRow,
                            Number(e.target.value)
                          )
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
