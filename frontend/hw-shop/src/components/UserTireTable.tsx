import React, { useState } from "react";

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
  data: TireRow[];
  onSave: (rows: TireRow[]) => void;
  validatePrice: (field: string, value: number) => boolean;
};

const UserTireTable: React.FC<Props> = ({ data, onSave, validatePrice }) => {
  const [rows, setRows] = useState<TireRow[]>(data);
  const [edited, setEdited] = useState<{
    [key: string]: "valid" | "invalid" | "edited";
  }>({});

  const handleEdit = (
    rowIndex: number,
    field: keyof TireRow,
    value: number
  ) => {
    const newRows = [...rows];
    const numValue = Number(value);

    // update row
    // @ts-expect-error: backend API อาจส่ง string มาแทน number
    newRows[rowIndex][field] = numValue;

    // validate
    const key = `${rowIndex}-${field}`;
    if (!validatePrice(field as string, numValue)) {
      setEdited((prev) => ({ ...prev, [key]: "invalid" }));
    } else {
      setEdited((prev) => ({ ...prev, [key]: "edited" }));
    }

    setRows(newRows);
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Brand</th>
            <th className="border p-2">Pattern</th>
            <th className="border p-2">Sidewall</th>
            <th className="border p-2">R13</th>
            <th className="border p-2">R14</th>
            <th className="border p-2">R15</th>
            <th className="border p-2">R16</th>
            <th className="border p-2">R17</th>
            <th className="border p-2">R18</th>
            <th className="border p-2">R19</th>
            <th className="border p-2">R20</th>
            <th className="border p-2">R21</th>
            <th className="border p-2">R22</th>
            <th className="border p-2">Trade-in</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id}>
              <td className="border p-2">{row.tcps_tb_name}</td>
              <td className="border p-2">{row.tcps_tbi_name}</td>
              <td className="border p-2">{row.tcps_sidewall_name}</td>
              {Object.keys(row)
                .filter((k): k is PriceKeys => k.includes("price"))
                .map((field) => {
                  const key = `${rowIndex}-${field}`;
                  let bg = "";
                  if (edited[key] === "invalid") bg = "bg-red-300";
                  else if (edited[key] === "edited") bg = "bg-yellow-200";

                  return (
                    <td key={field} className={`border p-2 ${bg}`}>
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
                        className="w-20 border-none bg-transparent text-center focus:outline-none"
                      />
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <button
          onClick={() => onSave(rows)}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default UserTireTable;
