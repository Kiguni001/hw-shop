// src/components/UserTireTable.tsx
import React, { useState, useEffect } from "react";
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
  id?: number;
  tcps_id?: string;
  tcps_ub_id: string;
  tcps_tb_name: string;
  tcps_tbi_name: string;
  tcps_sidewall_name: string;

  tcps_price_r13: number;
  tcps_price_r14: number;
  tcps_price_r15: number;
  tcps_price_r16: number;
  tcps_price_r17: number;
  tcps_price_r18: number;
  tcps_price_r19: number;
  tcps_price_r20: number;
  tcps_price_r21: number;
  tcps_price_r22: number;
  tcps_price_trade_in: number;

  updatedAt: string;
  status?: number;
} & {
  [K in PriceKeys]?: number;
};

type Props = {
  rows: TireRow[];
  userUbId?: string;
  validatePrice: (field: string, value: number) => boolean;
  onUpdateCell?: (
    tcpsId: string | undefined,
    field: PriceKeys,
    value: number
  ) => void;
  className?: string;
};

const UserTireTable: React.FC<Props> = ({
  rows: initialRows,
  validatePrice,
  onUpdateCell,
}) => {
  const [rows, setRows] = useState<TireRow[]>([]);

  useEffect(() => {
    const sortedRows = [...initialRows].sort((a, b) => {
      const idA = Number(a.tcps_id ?? a.id ?? 0);
      const idB = Number(b.tcps_id ?? b.id ?? 0);
      return idA - idB;
    });
    setRows(sortedRows);
  }, [initialRows]);

  const [editedValues, setEditedValues] = useState<{
    [key: string]: number | string;
  }>({});
  const [editedFlags, setEditedFlags] = useState<{
    [key: string]: "valid" | "invalid" | "edited";
  }>({});

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

  const makeCellKey = (row: TireRow, rowIndex: number, field: PriceKeys) => {
    const idPart =
      row.tcps_id ?? (row.id !== undefined ? String(row.id) : `row${rowIndex}`);
    return `${idPart}-${rowIndex}-${field}`;
  };

  const handleChange = (
    row: TireRow,
    rowIndex: number,
    field: PriceKeys,
    rawValue: string
  ) => {
    const cellKey = makeCellKey(row, rowIndex, field);

    setEditedValues((prev) => ({ ...prev, [cellKey]: rawValue }));

    const numValue = rawValue === "" ? 0 : Number(rawValue);

    if (!validatePrice(field, numValue)) {
      setEditedFlags((prev) => ({ ...prev, [cellKey]: "invalid" }));
    } else {
      setEditedFlags((prev) => ({ ...prev, [cellKey]: "edited" }));
    }

    setRows((prevRows) => {
      const updatedRows = prevRows.map((r) =>
        r.tcps_id === row.tcps_id ? { ...r, [field]: numValue } : r
      );
      updatedRows.sort((a, b) => {
        const idA = Number(a.tcps_id ?? a.id ?? 0);
        const idB = Number(b.tcps_id ?? b.id ?? 0);
        return idA - idB;
      });
      return updatedRows;
    });

    if (onUpdateCell) onUpdateCell(row.tcps_id, field, numValue);
  };

  const getDisplayedValue = (
    row: TireRow,
    rowIndex: number,
    field: PriceKeys
  ): string | number => {
    const cellKey = makeCellKey(row, rowIndex, field);
    if (cellKey in editedValues) return editedValues[cellKey];
    return row[field] ?? "";
  };

  // const getEditedRows = (): TireRow[] => {
  //   const editedRowIds = new Set<string>();
  //   Object.entries(editedFlags).forEach(([key, flag]) => {
  //     if (flag === "edited") {
  //       const tcpsId = key.replace(/^-/, "").split("-")[0];
  //       editedRowIds.add(tcpsId);
  //     }
  //   });
  //   return rows.filter(
  //     (r) => r.tcps_id && editedRowIds.has(r.tcps_id.replace(/^-/, ""))
  //   );
  // };

  // ลบปุ่มบันทึกการเปลี่ยนแปลงและฟังก์ชัน handleSaveEditedRowsNew ออก
  // ไม่กระทบฟังก์ชันอื่นที่ไม่เกี่ยวข้อง

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 50, textAlign: "center" }}>No.</th>
            <th style={{ width: 180, textAlign: "center" }}>Brand</th>
            <th style={{ width: 220, textAlign: "center" }}>Pattern</th>
            <th style={{ width: 160, textAlign: "center" }}>Sidewall</th>
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={15} style={{ textAlign: "center", padding: 20 }}>
                ไม่พบข้อมูลยาง
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={
                  row.tcps_id
                    ? `${row.tcps_id}-${rowIndex}`
                    : row.id
                    ? `${row.id}`
                    : `row-${rowIndex}`
                }
              >
                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                  {rowIndex + 1}
                </td>

                <td style={{ textAlign: "left", paddingLeft: 12 }}>
                  {row.tcps_tb_name}
                </td>
                <td style={{ textAlign: "left", paddingLeft: 12 }}>
                  {row.tcps_tbi_name}
                </td>
                <td style={{ textAlign: "left", paddingLeft: 12 }}>
                  {row.tcps_sidewall_name}
                </td>

                {priceFields.map((field) => {
                  const cellKey = makeCellKey(row, rowIndex, field);
                  const flag = editedFlags[cellKey];
                  const cellClass =
                    flag === "invalid"
                      ? styles.invalid
                      : flag === "edited"
                      ? styles.edited
                      : "";

                  return (
                    <td key={cellKey} className={cellClass}>
                      <input
                        type="number"
                        value={getDisplayedValue(row, rowIndex, field)}
                        onChange={(e) =>
                          handleChange(row, rowIndex, field, e.target.value)
                        }
                        className={styles.inputCell}
                      />
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* ปุ่มบันทึกการเปลี่ยนแปลงถูกลบออกแล้ว */}
    </div>
  );
};

export default UserTireTable;
