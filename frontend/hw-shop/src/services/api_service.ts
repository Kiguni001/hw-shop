// src/services/api_service.ts
import type { TireRow } from "../components/UserTireTable";

// ✅ Type สำหรับ response จาก API เซิฟเวอร์
export type ApiServerRow = {
  tcps_id: string;
  tcps_ub_id?: string; // บาง response อาจไม่มี แต่ถ้ามีก็ใช้
  updated_at: string;
};

// ✅ ฟังก์ชันช่วยแบ่ง array เป็น batch
const chunk = <T>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

// ✅ ตรวจสอบว่าเป็น object หรือไม่
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

// ✅ ตรวจสอบว่า object เป็น ApiServerRow หรือไม่
const isApiServerRow = (v: unknown): v is ApiServerRow =>
  isRecord(v) &&
  typeof v.tcps_id === "string" &&
  typeof v.updated_at === "string" &&
  (v.tcps_ub_id === undefined || typeof v.tcps_ub_id === "string");

// ✅ ฟังก์ชันหลัก: ส่งข้อมูลราคาไป API เซิฟเวอร์ และอัปเดต backend ของเรา
export const sendUpdatedPricesToServer = async (
  userUbId: string,
  rows: TireRow[],
  batchSize = 100
): Promise<ApiServerRow[]> => {
  if (!rows || rows.length === 0) return [];

  // sanitize branch_id (เอาแต่ตัวเลข)
  const branchId = String(userUbId ?? "").replace(/\D/g, "");

  // เตรียม data_update ตามรูปแบบที่ API ต้องการ (ทุกค่าเป็น string)
  const dataUpdateAll = rows
    .map((r) => {
      const tcpsUb = (r.tcps_ub_id ?? branchId ?? "")
        .toString()
        .replace(/\D/g, "");
      return {
        tcps_id: String(r.tcps_id ?? ""),
        tcps_ub_id: tcpsUb,
        tcps_price_r13: String(r.tcps_price_r13 ?? 0),
        tcps_price_r14: String(r.tcps_price_r14 ?? 0),
        tcps_price_r15: String(r.tcps_price_r15 ?? 0),
        tcps_price_r16: String(r.tcps_price_r16 ?? 0),
        tcps_price_r17: String(r.tcps_price_r17 ?? 0),
        tcps_price_r18: String(r.tcps_price_r18 ?? 0),
        tcps_price_r19: String(r.tcps_price_r19 ?? 0),
        tcps_price_r20: String(r.tcps_price_r20 ?? 0),
        tcps_price_r21: String(r.tcps_price_r21 ?? 0),
        tcps_price_r22: String(r.tcps_price_r22 ?? 0),
        tcps_price_trade_in: String(r.tcps_price_trade_in ?? 0),
        updated_at: r.updatedAt || "0001-01-01T00:00:00Z",
      };
    })
    .filter((x) => x.tcps_id !== "" && x.tcps_ub_id !== "");

  if (dataUpdateAll.length === 0) return [];

  // แบ่งเป็น batch ตาม batchSize
  const batches = chunk(dataUpdateAll, batchSize);
  const collected: ApiServerRow[] = [];

  // 🔁 ส่งแต่ละ batch ไป API เซิฟเวอร์
  for (const batch of batches) {
    const payload = {
      user_id: branchId,
      branch_id: branchId,
      Secure: "4fe24f2161c9a3e0825f54e2c26706e11396ff36",
      data_update: batch,
    };

    // ✅ Log 4 key ที่จะส่งไป API เซิฟเวอร์
    console.log("🔹 Payload ที่จะส่งไป API เซิฟเวอร์:");
    console.log("user_id:", payload.user_id);
    console.log("branch_id:", payload.branch_id);
    console.log("Secure:", payload.Secure);
    console.log("data_update:", JSON.stringify(payload.data_update, null, 2));

    try {
      const res = await fetch(
        "http://192.168.1.249/hongwei/api/webapp_customer/update_listcode_price",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      // ✅ Log raw response จาก API เซิฟเวอร์
      const raw = await res.json();
      console.log("📥 Response จาก API เซิฟเวอร์ (raw JSON):", raw);

      if (!res.ok) {
        throw new Error(`External API error: ${res.status} ${res.statusText}`);
      }

      if (!isRecord(raw)) continue;
      const maybeList = raw.data_list;
      if (!Array.isArray(maybeList)) continue;

      for (const item of maybeList) {
        if (isApiServerRow(item)) {
          collected.push({
            tcps_id: item.tcps_id,
            tcps_ub_id: item.tcps_ub_id,
            updated_at: item.updated_at,
          });
        }
      }
    } catch (err) {
      console.error("❌ Error ระหว่างส่งข้อมูลไปยัง API เซิฟเวอร์:", err);
    }
  }

  // 🔄 อัปเดต backend ของเรา
  if (collected.length > 0) {
    try {
      const backendRes = await fetch(
        "http://localhost:3000/api/user_tire/update_bulk",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(collected),
        }
      );
      if (!backendRes.ok) {
        throw new Error(`Local backend update failed: ${backendRes.status}`);
      }
    } catch (err) {
      console.error("⚠️ Error ระหว่างอัปเดต backend:", err);
    }
  }

  return collected;
};
