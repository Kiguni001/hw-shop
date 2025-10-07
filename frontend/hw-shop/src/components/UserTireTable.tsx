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
  id?: number; // optional (kept for backward compat) — primary unique identifier if backend provides
  tcps_id?: string; // <-- เพิ่ม tcps_id (แนะนำให้ backend ส่ง)
  tcps_ub_id: string;
  tcps_tb_name: string;
  tcps_tbi_name: string;
  tcps_sidewall_name: string;
  status?: number; // 0 = ปกติ, 2 = รออัพเดต API
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
  onSaveEditedRows?: (rows: TireRow[]) => void; // ⭐ เพิ่ม prop ใหม่
};

const UserTireTable: React.FC<Props> = ({
  rows: initialRows,
  validatePrice,
  onUpdateCell,
  onSaveEditedRows,
}) => {
  const [rows, setRows] = useState<TireRow[]>(initialRows);

  // เก็บค่า input ที่แก้ไขแบบเฉพาะช่อง (keyed by tcps_id + rowIndex + field)
  const [editedValues, setEditedValues] = useState<{
    [key: string]: number | string;
  }>({});
  // status ของ cell (edited / invalid)
  const [editedFlags, setEditedFlags] = useState<{
    [key: string]: "valid" | "invalid" | "edited";
  }>({});

  // ถ้า rows เปลี่ยน เราอาจล้างค่าบางอย่างที่ไม่ต้องการเก็บต่อ (optional)
  useEffect(() => {
    // ถ้าต้องการให้ editedValues คงอยู่ระหว่าง refresh ของ rows ให้ลบบรรทัดนี้ออก
    // setEditedValues({});
    // setEditedFlags({});
  }, [rows]);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

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

  // สร้าง key ที่ไม่ซ้ำ: tcps_id (prefer) + rowIndex + field
  const makeCellKey = (row: TireRow, rowIndex: number, field: PriceKeys) => {
    // ถ้า backend ส่ง tcps_id ให้ใช้ ถ้าไม่มีก็ fallback ไปใช้ (id || `${rowIndex}`)
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
    console.log("Point 1: handleChange called", {
      row,
      rowIndex,
      field,
      rawValue,
    });

    const cellKey = makeCellKey(row, rowIndex, field);
    console.log("Point 2: cellKey generated", cellKey);

    // เก็บค่า string เพื่อให้ผู้ใช้สามารถลบแล้วพิมพ์ได้ (แต่ส่งเป็น number ต่อไป)
    setEditedValues((prev) => {
      const updated = { ...prev, [cellKey]: rawValue };
      console.log("Point 3: editedValues updated", updated);
      return updated;
    });

    const numValue = rawValue === "" ? 0 : Number(rawValue);

    console.log("Point 4", numValue);

    // validate และตั้ง flag
    if (!validatePrice(field, numValue)) {
      setEditedFlags((prev) => ({ ...prev, [cellKey]: "invalid" }));
    } else {
      setEditedFlags((prev) => ({ ...prev, [cellKey]: "edited" }));
    }
    console.log("Point 5", numValue);
    // แจ้ง parent ว่ามีการเปลี่ยนแปลง (parent จะอัพเดท rows state ของตัวเอง)
    if (onUpdateCell) {
      onUpdateCell(row.tcps_id, field, numValue);
    }
    console.log("Point 6", numValue);
  };

  // ดึงค่า input ที่จะแสดง: ถ้ามี editedValues ให้ใช้ค่านั้น ไม่งั้นใช้ row[field]
  const getDisplayedValue = (
    row: TireRow,
    rowIndex: number,
    field: PriceKeys
  ): string | number => {
    const cellKey = makeCellKey(row, rowIndex, field);
    if (cellKey in editedValues) return editedValues[cellKey];
    // ถ้า backend ส่งค่าเป็น number ให้แสดง ถ้า undefined ให้เป็น empty string
    return row[field] ?? "";
  };

  // หาแถวที่ถูกแก้ไขจาก editedFlags
  // const getEditedRows = (): TireRow[] => {
  // const editedRowIds = new Set<string>();
  // Object.entries(editedFlags).forEach(([key, flag]) => {
  //   console.log("111");
  //   if (flag === "edited" || 1 == 1) {
  //     const tcpsId = key.split("-")[0]; // ดึง tcps_id จาก key
  //     editedRowIds.add(tcpsId);
  //   }
  // });
  // // คืนค่าข้อมูลแถวเต็มจาก rows
  // return rows.filter((r) => r.tcps_id && editedRowIds.has(r.tcps_id));
  // return rows.filter(
  //   (r) =>
  //     typeof r.tcps_id === "string" && // ✅ ตรวจสอบว่ามีค่า string
  //     Object.keys(editedFlags).some(
  //       (key) => key.startsWith(r.tcps_id!) && editedFlags[key] === "edited"
  //     )
  // );
  // return rows.filter((r) => {
  //   if (!r.tcps_id) return false;

  //   return Object.keys(editedFlags).some((key) => {
  //     const tcpsIdFromKey = key.split("-")[0]; // ดึง tcps_id จริงจาก key
  //     return tcpsIdFromKey === r.tcps_id && editedFlags[key] === "edited";
  //   });
  // });

  // const editedRowIds = new Set<string>();

  // Object.entries(editedFlags).forEach(([key, flag]) => {
  //   if (flag === "edited") {
  //     const tcpsId = key.split("-")[1]; // ดึง tcps_id จาก key
  //     editedRowIds.add(tcpsId);
  //   }
  // });

  // console.log("🟢 Edited tcps_id set:", editedRowIds);
  // rows.forEach((r, i) => {
  //   console.log(
  //     `Row ${i}: tcps_id='${r.tcps_id}' | in editedRowIds? ${
  //       r.tcps_id ? editedRowIds.has(r.tcps_id.replace(/^-/, "")) : false
  //     }`
  //   );
  // });

  // filter rows ที่ tcps_id อยู่ใน Set
  // return rows.filter((r) => r.tcps_id && editedRowIds.has(r.tcps_id));
  // return rows.filter((r) => r.tcps_id && r.tcps_id.toString() == "174");

  // };

  const getEditedRows = (): TireRow[] => {
    const editedRowIds = new Set<string>();

    Object.entries(editedFlags).forEach(([key, flag]) => {
      if (flag === "edited") {
        // ลบ "-" ข้างหน้า key เพื่อดึง tcps_id
        const tcpsId = key.replace(/^-/, "").split("-")[0];
        editedRowIds.add(tcpsId);
      }
    });

    console.log("🟢 Edited tcps_id set:", editedRowIds);

    return rows.filter((r, i) => {
      if (!r.tcps_id) return false;
      const normalizedId = r.tcps_id.replace(/^-/, "");
      const include = editedRowIds.has(normalizedId);
      console.log(
        `Row ${i}: tcps_id='${r.tcps_id}' -> normalized='${normalizedId}', include=${include}`
      );
      return include;
    });
  };

  useEffect(() => {
    console.log("🟢 editedFlags changed:", editedFlags);
  }, [editedFlags]);

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
                {/* ✅ เพิ่มคอลัมน์ลำดับ */}
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
      <button
        className={styles.saveButton}
        onClick={() => {
          const editedRows = getEditedRows();
          console.log("🟢 Edited rows to save:", editedRows);
          if (editedRows.length > 0) {
            onSaveEditedRows?.(editedRows); // เรียก callback จาก HomePage
          } else {
            alert("ไม่มีข้อมูลที่ถูกแก้ไข");
          }
        }}
      >
        บันทึกการเปลี่ยนแปลง
      </button>
      ;
    </div>
  );
};

export default UserTireTable;
