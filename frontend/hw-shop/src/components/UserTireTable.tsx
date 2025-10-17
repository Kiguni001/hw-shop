// src/components/UserTireTable.tsx
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/UserTireTable.module.css";
import SetPriceButton from "./SetPriceButton";

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
  resetEditFlagSignal?: number;
};

const UserTireTable: React.FC<Props> = ({
  rows: initialRows,
  // validatePrice,
  onUpdateCell,
  resetEditFlagSignal,
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

  useEffect(() => {
    setEditedFlags({});
    setEditedValues({});
  }, [resetEditFlagSignal]);

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

  const tempChange = (
    row: TireRow,
    rowIndex: number,
    field: PriceKeys,
    rawValue: string
  ) => {
    const cellKey = makeCellKey(row, rowIndex, field);
    // เก็บค่าเฉพาะสำหรับการพิมพ์ (ยังไม่ถือว่า edited จริง)
    setEditedValues((prev) => ({ ...prev, [cellKey]: rawValue }));
  };

  const commitChange = (
    row: TireRow,
    rowIndex: number,
    field: PriceKeys,
    rawValue: string
  ) => {
    const cellKey = makeCellKey(row, rowIndex, field);

    // แปลงเป็นตัวเลขและ cap ที่ 5000
    let numValue = rawValue === "" ? 0 : Number(rawValue);
    if (isNaN(numValue)) numValue = 0;
    if (numValue > 5000) numValue = 5000;

    const original =
      typeof row[field] === "number" ? Number(row[field] ?? 0) : 0;

    if (numValue === original) {
      // ถ้าไม่เปลี่ยนแปลง ให้ลบ edited marker/editedValues
      setEditedValues((prev) => {
        const copy = { ...prev };
        delete copy[cellKey];
        return copy;
      });
      setEditedFlags((prev) => {
        const copy = { ...prev };
        delete copy[cellKey];
        return copy;
      });
      // ไม่เรียก onUpdateCell, ไม่เปลี่ยน status
      return;
    }

    // ถ้าค่าเปลี่ยนจริง ให้บันทึกเป็น edited และอัพเดต rows + แจ้ง onUpdateCell
    setEditedValues((prev) => ({ ...prev, [cellKey]: numValue }));
    setEditedFlags((prev) => ({ ...prev, [cellKey]: "edited" }));

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

  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [activeCellRow, setActiveCellRow] = useState<TireRow | null>(null);
  const [activeCellField, setActiveCellField] = useState<PriceKeys | null>(
    null
  );

  // ประกาศ ref ที่ระดับคอมโพเนนต์
  const inputRefs = useRef<{ [cellKey: string]: HTMLInputElement | null }>({});

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
                  const isActive = activeCell === cellKey;
                  const cellClass =
                    flag === "invalid"
                      ? styles.invalid
                      : flag === "edited"
                      ? styles.edited
                      : "" + (isActive ? " " + styles.activeCell : "");
                  return (
                    <td
                      key={cellKey}
                      className={cellClass}
                      onDoubleClick={() => {
                        setActiveCell(cellKey);
                        setActiveCellRow(row);
                        setActiveCellField(field);
                        setTimeout(() => {
                          const input = inputRefs.current[cellKey];
                          if (input) {
                            input.focus();
                            const val = input.value;
                            input.setSelectionRange(val.length, val.length);
                          }
                        }, 0);
                      }}
                    >
                      <input
                        ref={(el) => {
                          inputRefs.current[cellKey] = el;
                        }}
                        value={getDisplayedValue(row, rowIndex, field)}
                        onChange={(e) =>
                          tempChange(row, rowIndex, field, e.target.value)
                        }
                        className={styles.inputCell}
                        onFocus={() => {
                          setActiveCell(cellKey);
                          setActiveCellRow(row);
                          setActiveCellField(field);
                        }}
                        onBlur={() => {
                          // finalize: ใช้ค่าจาก input ถ้ามี ref, ถ้าไม่มีใช้ editedValues หรือค่าเดิม
                          const input = inputRefs.current[cellKey];
                          const raw =
                            input?.value ??
                            String(
                              editedValues[makeCellKey(row, rowIndex, field)] ??
                                row[field] ??
                                ""
                            );
                          commitChange(row, rowIndex, field, raw);
                          setActiveCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            (e.currentTarget as HTMLInputElement).blur();
                          }
                        }}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          const val = e.currentTarget.value;
                          e.currentTarget.setSelectionRange(
                            val.length,
                            val.length
                          );
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {activeCell && activeCellRow && activeCellField && (
        <SetPriceButton
          row={activeCellRow}
          onRound100={() => {
            const rowIndex = rows.findIndex(
              (r) => r.tcps_id === activeCellRow.tcps_id
            );
            const newValue =
              Math.ceil(Number(activeCellRow[activeCellField] ?? 0) / 100) *
              100;
            commitChange(
              activeCellRow,
              rowIndex,
              activeCellField,
              String(newValue)
            );
          }}
          onRound50={() => {
            const rowIndex = rows.findIndex(
              (r) => r.tcps_id === activeCellRow.tcps_id
            );
            const val = Number(activeCellRow[activeCellField] ?? 0);
            const newValue = Math.ceil(val / 50) * 50;
            commitChange(
              activeCellRow,
              rowIndex,
              activeCellField,
              String(newValue)
            );
          }}
          onExit={() => setActiveCell(null)}
        />
      )}
    </div>
  );
};

export default UserTireTable;
