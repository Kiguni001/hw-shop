import React, { useState } from "react";
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
  id: number; // ต้องมาจาก backend, unique
  tcps_ub_id: string;
  tcps_tb_name: string;
  tcps_tbi_name: string;
  tcps_sidewall_name: string;
} & {
  [K in PriceKeys]?: number;
};

type Props = {
  rows: TireRow[];
  validatePrice: (field: string, value: number) => boolean;
  onUpdateRow?: (rowId: number, field: PriceKeys, value: number) => void;
};

const UserTireTable: React.FC<Props> = ({
  rows,
  validatePrice,
  onUpdateRow,
}) => {
  const [editedValues, setEditedValues] = useState<{
    [key: string]: number | string;
  }>({});
  const [edited, setEdited] = useState<{
    [key: string]: "valid" | "invalid" | "edited";
  }>({});

  const handleChange = (row: TireRow, field: PriceKeys, value: string) => {
    if (!row.id) return;
    const key = `${row.id}-${field}`;

    setEditedValues((prev) => ({ ...prev, [key]: value }));

    const numValue = value === "" ? 0 : Number(value);

    if (!validatePrice(field, numValue))
      setEdited((prev) => ({ ...prev, [key]: "invalid" }));
    else setEdited((prev) => ({ ...prev, [key]: "edited" }));

    if (onUpdateRow) onUpdateRow(row.id, field, numValue);
  };

  const priceFields: PriceKeys[] = [
    "tcps_price_r13",
    "tcps_price_r14",
    "tcps_price_r15",
    "tcps_price_r16",
    "tcps_price_r17",
    "tcps_price_r18",
    "tcps_price_r19",
    "tcps_price_r20",
    "tcps_price_r21",
    "tcps_price_r22",
    "tcps_price_trade_in",
  ];

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Pattern</th>
            <th>Sidewall</th>
            {priceFields.map((field) => (
              <th key={field}>{field.split("_")[2].toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.tcps_tb_name}</td>
              <td>{row.tcps_tbi_name}</td>
              <td>{row.tcps_sidewall_name}</td>
              {priceFields.map((field) => {
                const key = `${row.id}-${field}`;
                let cellClass = "";
                if (edited[key] === "invalid") cellClass = styles.invalid;
                else if (edited[key] === "edited") cellClass = styles.edited;

                return (
                  <td key={key} className={cellClass}>
                    <input
                      type="number"
                      value={editedValues[key] ?? row[field] ?? ""}
                      onChange={(e) => handleChange(row, field, e.target.value)}
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
