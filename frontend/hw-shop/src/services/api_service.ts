import type { TireRow } from "../components/UserTireTable";

export const sendUpdatedPricesToServer = async (
  userUbId: string,
  rows: TireRow[]
) => {
  if (rows.length === 0) {
    return { data_list: [] };
  }

  // เตรียมข้อมูลส่ง API...
  const dataUpdate = rows.map((r) => ({
    tcps_id: r.tcps_id,
    tcps_ub_id: r.tcps_ub_id,
    tcps_price_r13: r.tcps_price_r13?.toString() || "0",
    tcps_price_r14: r.tcps_price_r14?.toString() || "0",
    tcps_price_r15: r.tcps_price_r15?.toString() || "0",
    tcps_price_r16: r.tcps_price_r16?.toString() || "0",
    tcps_price_r17: r.tcps_price_r17?.toString() || "0",
    tcps_price_r18: r.tcps_price_r18?.toString() || "0",
    tcps_price_r19: r.tcps_price_r19?.toString() || "0",
    tcps_price_r20: r.tcps_price_r20?.toString() || "0",
    tcps_price_r21: r.tcps_price_r21?.toString() || "0",
    tcps_price_r22: r.tcps_price_r22?.toString() || "0",
    tcps_price_trade_in: r.tcps_price_trade_in?.toString() || "0",
    updated_at: r.updatedAt || "0001-01-01T00:00:00Z",
  }));

  const payload = {
    data_update: dataUpdate,
    Secure: "4fe24f2161c9a3e0825f54e2c26706e11396ff36",
    branch_id: userUbId,
  };

  const res = await fetch(
    "http://192.168.1.249/hongwei/api/webapp_customer/update_listcode_price",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const serverJson = await res.json();

  type ApiServerRow = {
    tcps_id: string;
    tcps_ub_id: string;
    updated_at: string;
  };

  const updatedRows: ApiServerRow[] = serverJson.data_list || [];

  if (updatedRows.length === 0) {
    return { data_list: [] };
  }

  const backendRes = await fetch(
    "http://localhost:3000/api/user_tire/update_bulk",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRows),
    }
  );

  await backendRes.json();

  const finalRows = rows.map((r) => {
    const match = updatedRows.find(
      (u) => u.tcps_id === r.tcps_id && u.tcps_ub_id === r.tcps_ub_id
    );
    if (match) {
      return { ...r, updatedAt: match.updated_at, status: 1 };
    }
    return r;
  });

  return { data_list: finalRows };
};
