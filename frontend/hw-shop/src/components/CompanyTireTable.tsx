import React, { useEffect, useState } from "react";
import "../styles/TireTable.css";

interface Tire {
  ID: number;
  brand: string;
  pattern: string;
  sidewall: string;
  size_13: number;
  size_14: number;
  size_15: number;
  size_16: number;
  size_17: number;
  size_18: number;
  size_19: number;
  size_20: number;
  size_21: number;
  size_22: number;
}

type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

const headers = [
  "Brand",
  "Pattern",
  "Sidewall",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
];

const numericKeys: NumberKeys<Tire>[] = [
  "size_13",
  "size_14",
  "size_15",
  "size_16",
  "size_17",
  "size_18",
  "size_19",
  "size_20",
  "size_21",
  "size_22",
];

interface Props {
  companyId: number;
}

type EditedMap = Record<string, number>;
type DataMap = Record<number, Tire[]>;

const CompanyTireTable: React.FC<Props> = ({ companyId }) => {
  const [data, setData] = useState<DataMap>({});
  const [edited, setEdited] = useState<EditedMap>({});

  // สร้างข้อมูลทดลองสำหรับบริษัทนี้ตอน mount
  useEffect(() => {
    if (!data[companyId]) {
      const sampleData: Tire[] = [
        {
          ID: 1,
          brand: "Michelin",
          pattern: "Pilot",
          sidewall: "Black",
          size_13: 5,
          size_14: 5,
          size_15: 5,
          size_16: 5,
          size_17: 5,
          size_18: 5,
          size_19: 5,
          size_20: 5,
          size_21: 5,
          size_22: 5,
        },
        {
          ID: 2,
          brand: "Bridgestone",
          pattern: "D689",
          sidewall: "",
          size_13: 5,
          size_14: 5,
          size_15: 5,
          size_16: 5,
          size_17: 5,
          size_18: 5,
          size_19: 5,
          size_20: 5,
          size_21: 5,
          size_22: 5,
        },
      ];
      setData((prev: DataMap) => ({ ...prev, [companyId]: sampleData }));
    }
  }, [companyId, data]);

  const handleDoubleClick = (rowId: number, key: NumberKeys<Tire>) => {
    const original = data[companyId]?.find((r) => r.ID === rowId)?.[key];
    if (original === undefined) return;

    const newValue = window.prompt("แก้ไขค่า:", String(original));
    if (!newValue) return;

    setEdited((prev: EditedMap) => ({
      ...prev,
      [`${companyId}-${rowId}-${key}`]: Number(newValue),
    }));
  };

  const handleSave = () => {
    setData((prev: DataMap) => {
      const companyData =
        prev[companyId]?.map((row) => {
          const updatedRow: Tire = { ...row };
          numericKeys.forEach((k) => {
            const idKey = `${companyId}-${row.ID}-${k}`;
            if (edited[idKey] !== undefined) {
              updatedRow[k] = edited[idKey];
            }
          });
          return updatedRow;
        }) || [];
      return { ...prev, [companyId]: companyData };
    });
    setEdited({});
  };

  return (
    <>
      <h2>Company Tires (ID: {companyId})</h2>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data[companyId]?.map((row: Tire) => (
              <tr key={row.ID}>
                <td>{row.brand}</td>
                <td>{row.pattern}</td>
                <td>{row.sidewall}</td>
                {numericKeys.map((k) => {
                  const idKey = `${companyId}-${row.ID}-${k}`;
                  return (
                    <td
                      key={idKey}
                      onDoubleClick={() => handleDoubleClick(row.ID, k)}
                    >
                      {edited[idKey] ?? row[k]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleSave}>บันทึก</button>
    </>
  );
};

export default CompanyTireTable;
