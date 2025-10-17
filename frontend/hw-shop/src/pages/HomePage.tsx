import React, { useState, useEffect } from "react";
import styles from "../styles/HomePage.module.css";
import logo from "../assets/icons/logo.png";
import SearchBar from "../components/SearchBar";
import UserTireTable from "../components/UserTireTable";
import ConfirmEditModal from "../components/ConfirmEditModal";
import type { TireRow } from "../components/UserTireTable";
import type { PriceKeys } from "../components/UserTireTable";
import userIcon from "../assets/icons/user.png";
import saleIcon from "../assets/icons/sale.png";
import exitIcon from "../assets/icons/esc.png";

interface UserData {
  first_name: string;
  last_name: string;
  tcps_ub_id: string;
}

interface CompanyData {
  company_name: string;
}

// Types for confirm modal rows
type ModalChange = {
  field: PriceKeys;
  original: number;
  current: number;
};

type ModalRow = {
  tcps_id?: string;
  tcps_tb_name: string;
  tcps_tbi_name: string;
  tcps_sidewall_name?: string;
  changes: ModalChange[];
};

const HomePage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [company] = useState<CompanyData | null>(null);
  const [userTireData, setUserTireData] = useState<TireRow[]>([]);
  const [resetEditFlagSignal, setResetEditFlagSignal] = useState(0);
  const [originalUserTireData, setOriginalUserTireData] = useState<TireRow[]>(
    []
  );
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [modalRows, setModalRows] = useState<ModalRow[]>([]);

  // 1️⃣ Fetch ข้อมูลผู้ใช้
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tcpsUbId = sessionStorage.getItem("userUbId");
        console.log("tcps_ub_id from sessionStorage:", tcpsUbId);
        if (!tcpsUbId) throw new Error("ไม่พบ tcps_ub_id");

        const res = await fetch("http://localhost:3000/api/user/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tcps_ub_id: tcpsUbId }),
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data: UserData = await res.json();
        console.log("✅ User data loaded:", data);
        setUser(data);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      }
    };

    fetchUserData();
  }, []);

  // 2️⃣ Fetch ตารางยางเฉพาะ user
  useEffect(() => {
    const fetchUserTire = async () => {
      if (!user?.tcps_ub_id) return;
      try {
        const res = await fetch(
          `http://localhost:3000/api/user_tire?tcps_ub_id=${user.tcps_ub_id}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch user tire data");
        const data: TireRow[] = await res.json();

        const normalized = data.map((r) => ({ ...r, status: r.status ?? 1 }));
        setUserTireData(normalized);
        // keep deep copy as original for diff
        setOriginalUserTireData(JSON.parse(JSON.stringify(normalized)));
      } catch (err) {
        console.error("❌ Error fetching user tire:", err);
      }
    };
    fetchUserTire();
  }, [user?.tcps_ub_id]);

  // ✅ อัปเดตข้อมูลใน state เมื่อมีการแก้ไขช่องราคา
  const handleUpdateTireRow = (
    tcpsId: string | undefined,
    field: PriceKeys,
    value: number
  ) => {
    if (!tcpsId) return;
    setUserTireData((prev) =>
      prev.map((row) =>
        row.tcps_id === tcpsId
          ? { ...row, [field]: value, status: 2 } // ✅ status = 2 แทน row ที่แก้ไข
          : row
      )
    );
  };

  // ✅ ฟังก์ชันบันทึกข้อมูลที่ถูกแก้ไข (PUT เฉพาะแถวที่มี status = 2)
  const handleSaveEditedRows = async (editedRows: TireRow[]) => {
    try {
      if (editedRows.length === 0) {
        alert("ไม่มีข้อมูลที่ถูกแก้ไข");
        return;
      }

      for (const row of editedRows) {
        if (!row.tcps_id) continue;

        console.log("📤 ส่งข้อมูลไปอัปเดต API:", row);

        const res = await fetch(
          `http://localhost:3000/api/user_tire/${row.tcps_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(row),
          }
        );

        const serverJson = await res.json();
        console.log("📥 Response จาก API เซิฟเวอร์:", serverJson);

        if (!res.ok) {
          throw new Error(`อัปเดตไม่สำเร็จสำหรับ ${row.tcps_id}`);
        }

        console.log(`✅ อัปเดตสำเร็จสำหรับ ${row.tcps_id}`);
      }

      setUserTireData((prev) =>
        prev.map((row) => {
          const editedRow = editedRows.find((r) => r.tcps_id === row.tcps_id);
          return editedRow ? { ...row } : row;
        })
      );

      alert("✅ บันทึกข้อมูลสำเร็จลง API ของคุณแล้ว!");
    } catch (err) {
      console.error("❌ Error saving:", err);
      alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // ✅ handleSyncToServer — ฟังก์ชันใหม่ (ส่งไป API เซิร์ฟเวอร์)
  const handleSyncToServer = async (editedRows: TireRow[]) => {
    try {
      if (!user) throw new Error("User not loaded");

      // เตรียมข้อมูล data_update ตามรูปแบบที่เซิร์ฟเวอร์ต้องการ
      const data_update = editedRows.map((row) => ({
        id: row.id,
        tcps_id: String(row.tcps_id ?? ""),
        tcps_ub_id: String(row.tcps_ub_id ?? ""),
        tcps_price_r13: String(row.tcps_price_r13 ?? ""),
        tcps_price_r14: String(row.tcps_price_r14 ?? ""),
        tcps_price_r15: String(row.tcps_price_r15 ?? ""),
        tcps_price_r16: String(row.tcps_price_r16 ?? ""),
        tcps_price_r17: String(row.tcps_price_r17 ?? ""),
        tcps_price_r18: String(row.tcps_price_r18 ?? ""),
        tcps_price_r19: String(row.tcps_price_r19 ?? ""),
        tcps_price_r20: String(row.tcps_price_r20 ?? ""),
        tcps_price_r21: String(row.tcps_price_r21 ?? ""),
        tcps_price_r22: String(row.tcps_price_r22 ?? ""),
        tcps_price_trade_in: String(row.tcps_price_trade_in ?? ""),
      }));

      // const userId = sessionStorage.getItem("user_id"); // <-- user_id จริง
      const payload = {
        user_id: 16,
        branch_id: String(user.tcps_ub_id ?? ""),
        Secure: "4fe24f2161c9a3e0825f54e2c26706e11396ff36",
        data_update: JSON.stringify(data_update),
      };

      console.log("🔹 Payload ที่จะส่งไป API เซิร์ฟเวอร์:", payload);

      // แสดงค่า key ทั้ง 4 ตัวใน console
      console.log("=== ตรวจสอบข้อมูลที่จะส่งไป API เซิร์ฟเวอร์ ===");
      console.log("user_id:", payload.user_id);
      console.log("branch_id:", payload.branch_id);
      console.log("Secure:", payload.Secure);
      console.log("data_update:", JSON.stringify(payload.data_update, null, 2));
      console.log("=== จบการตรวจสอบข้อมูล ===");

      const response = await fetch(
        "http://192.168.1.249/hongwei/api/webapp_customer/update_listcode_price",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (
        response.ok &&
        result.status === "success" &&
        Array.isArray(result.data)
      ) {
        console.log("✅ เซิร์ฟเวอร์ตอบกลับสำเร็จ:", result);

        setUserTireData((prev) =>
          prev.map((row) => {
            const updated = result.data.find(
              (r: { tcps_id: string }) => r.tcps_id === String(row.tcps_id)
            );
            if (updated) {
              return {
                ...row,
                updatedAt: updated.updated_at,
                status: 1,
              };
            }
            return row;
          })
        );
        setResetEditFlagSignal((prev) => prev + 1);
        alert("✅ Sync กับ API เซิร์ฟเวอร์สำเร็จ!");
      } else {
        console.error("❌ เซิร์ฟเวอร์ตอบกลับล้มเหลว:", result);
        alert(
          `❌ Sync กับ API เซิร์ฟเวอร์ล้มเหลว\n${
            typeof result === "object" && result.data
              ? JSON.stringify(result.data)
              : ""
          }`
        );
      }
    } catch (error) {
      console.error("❌ error handleSyncToServer:", error);
      alert("❌ เกิดข้อผิดพลาดในการ sync ข้อมูล");
    }
  };

  const handleSaveAndSync = async () => {
    const editedRows = userTireData.filter((row) => row.status === 2);
    if (editedRows.length === 0) {
      alert("ไม่มีข้อมูลที่ถูกแก้ไข");
      return;
    }
    await handleSaveEditedRows(editedRows); // อัปเดตในระบบเรา
    await handleSyncToServer(editedRows); // ส่งไปยัง API เซิร์ฟเวอร์กลางและอัปเดต status/updatedAt
  };

  // ✅ ฟัง event จาก SearchBar เพื่อเตรียม modal ก่อนบันทึก
  useEffect(() => {
    const handleSaveEvent = () => {
      // prepare edited rows and show modal
      const editedRows = userTireData.filter((row) => row.status === 2);
      if (editedRows.length === 0) {
        alert("ไม่มีข้อมูลที่ถูกแก้ไข");
        return;
      }

      // build modalRows with changed fields only
      const fields: PriceKeys[] = [
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

      const rowsForModal = editedRows
        .map((r) => {
          const original = originalUserTireData.find(
            (o) => o.tcps_id === r.tcps_id
          );
          const changes = fields
            .map((f) => {
              const origVal = original ? Number(original[f] ?? 0) : 0;
              const curVal = Number(r[f] ?? 0);
              if (origVal !== curVal)
                return { field: f, original: origVal, current: curVal };
              return null;
            })
            .filter(Boolean) as {
            field: PriceKeys;
            original: number;
            current: number;
          }[];
          return {
            tcps_id: r.tcps_id,
            tcps_tb_name: r.tcps_tb_name,
            tcps_tbi_name: r.tcps_tbi_name,
            tcps_sidewall_name: r.tcps_sidewall_name,
            changes,
          };
        })
        .filter((x) => x.changes && x.changes.length > 0);

      if (rowsForModal.length === 0) {
        alert("ไม่มีการเปลี่ยนแปลงจริง ๆ");
        return;
      }

      setModalRows(rowsForModal);
      setConfirmModalOpen(true);
    };

    window.addEventListener("SAVE_TIRES", handleSaveEvent);
    return () => window.removeEventListener("SAVE_TIRES", handleSaveEvent);
  }, [userTireData, originalUserTireData]);

  const confirmAndSave = async () => {
    setConfirmModalOpen(false);
    await handleSaveAndSync();
  };

  return (
    <div className={styles.homePageContainer}>
      {/* Zone 1 Sidebar */}
      <div className={styles.BoxZone1}>
        <div className={styles.Zone1}>
          <div className={styles.logoimg}>
            <img src={logo} alt="Logo" />
          </div>
          <div className={styles.line}></div>
          <button
            className={styles.profileButton}
            onClick={() => alert("แก้ไขโปรไฟล์")}
          >
            <img src={userIcon} alt="user icon" className={styles.icon} />
            <span>แก้ไขโปรไฟล์</span>
          </button>
          <button
            className={styles.saleButton}
            onClick={() => alert("จัดโปรโมชั่น")}
          >
            <img src={saleIcon} alt="sale icon" className={styles.icon} />
            <span>จัดโปรโมชั่น</span>
          </button>
          <button
            className={styles.exitButton}
            onClick={() => alert("ออกจากระบบ")}
          >
            <img src={exitIcon} alt="exit icon" className={styles.icon} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Zone 2 Main Content */}
      <div className={styles.BoxZone2}>
        <div className={styles.Zone2}>
          <div className={styles.userInfo}>
            <p className={styles.companyInfo}>
              <span className={styles.bullet}>•</span> บริษัท:{" "}
              {company?.company_name ?? "-"}
            </p>
            <h1 className={styles.userName}>
              ผู้ใช้: {user?.first_name} {user?.last_name}
            </h1>
          </div>
        </div>

        <div className={styles.Zone3}>
          <SearchBar rowCount={userTireData.length} />

          <UserTireTable
            rows={userTireData}
            userUbId={user?.tcps_ub_id ?? ""}
            validatePrice={(field, value) => value >= 0 && value < 5000}
            onUpdateCell={handleUpdateTireRow}
            resetEditFlagSignal={resetEditFlagSignal}
          />
          {/* ✅ ลบปุ่มบันทึกใน Zone3 ออก */}
        </div>
      </div>

      <ConfirmEditModal
        open={confirmModalOpen}
        rows={modalRows}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmAndSave}
      />
    </div>
  );
};

export default HomePage;
