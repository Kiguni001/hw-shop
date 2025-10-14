import React, { useState, useEffect } from "react";
import styles from "../styles/HomePage.module.css";
import logo from "../assets/icons/logo.png";
import SearchBar from "../components/SearchBar";
import UserTireTable from "../components/UserTireTable";
import type { TireRow } from "../components/UserTireTable";
import type { PriceKeys } from "../components/UserTireTable";
// import { sendUpdatedPricesToServer } from "../services/api_service";
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

const HomePage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [company] = useState<CompanyData | null>(null);
  const [userTireData, setUserTireData] = useState<TireRow[]>([]);

  // 1️⃣ Fetch ข้อมูลผู้ใช้
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem("userUbId");
        console.log("User ID from sessionStorage:", userId);
        if (!userId) throw new Error("ไม่พบ userId");

        const res = await fetch("http://localhost:3000/api/user/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tcps_ub_id: userId }),
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
        console.log("✅ User tire data loaded:", data);

        // normalize: ให้แน่ใจว่าแต่ละ row มี status เป็น 1 หากไม่มี
        const normalized = data.map((r) => ({
          ...r,
          status: r.status ?? 1,
        }));

        setUserTireData(normalized);
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

        const serverJson = await res.json(); // <-- ต้องอยู่ตรงนี้
        console.log("📥 Response จาก API เซิฟเวอร์:", serverJson);

        if (!res.ok) {
          throw new Error(`อัปเดตไม่สำเร็จสำหรับ ${row.tcps_id}`);
        }

        console.log(`✅ อัปเดตสำเร็จสำหรับ ${row.tcps_id}`);
      }

      // หลังจากอัปเดตเสร็จ รีเซ็ต editedFlags (ใน UserTireTable) และ/หรือ local state
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

  // const handleSave = async () => {
  //   const editedRows = userTireData.filter((row) => row.status === 2);
  //   if (editedRows.length === 0) {
  //     alert("ไม่มีข้อมูลที่ถูกแก้ไข");
  //     return;
  //   }

  //   try {
  //     const updated = await sendUpdatedPricesToServer(
  //       user?.tcps_ub_id ?? "", // user_id และ branch_id
  //       editedRows
  //     );

  //     setUserTireData((prev) =>
  //       prev.map((row) => {
  //         const match = updated.find((u) => u.tcps_id === row.tcps_id);
  //         return match
  //           ? { ...row, status: 1, updatedAt: match.updated_at }
  //           : row;
  //       })
  //     );

  //     alert("อัปเดตจาก API เซิฟเวอร์เรียบร้อยแล้ว");
  //   } catch (err) {
  //     console.error(err);
  //     alert(
  //       "เกิดข้อผิดพลาด: " + (err instanceof Error ? err.message : String(err))
  //     );
  //   }
  // };

  // ✅ handleSyncToServer — ฟังก์ชันใหม่ (ส่งไป API เซิร์ฟเวอร์)
  const handleSyncToServer = async (editedRows: TireRow[]) => {
    try {
      if (!user) throw new Error("User not loaded");

      const payload = {
        user_id: user.tcps_ub_id,
        data_update: editedRows.map((row) => ({
          tcps_id: row.tcps_id,
          updated_at: row.updatedAt || new Date().toISOString(),
        })),
      };

      console.log("🔹 Payload ที่จะส่งไป API เซิร์ฟเวอร์:", payload);

      const response = await fetch("https://example.com/api/update_price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("✅ เซิร์ฟเวอร์ตอบกลับสำเร็จ:", result);
      } else {
        console.error("❌ เซิร์ฟเวอร์ตอบกลับล้มเหลว:", result);
      }
    } catch (error) {
      console.error("❌ error handleSyncToServer:", error);
    }
  };

  // ✅ handleSaveAndSync — ฟังก์ชันรวม (ใหม่)
  const handleSaveAndSync = async (editedRows: TireRow[]) => {
    console.log("🚀 เริ่มบันทึกและอัปเดตข้อมูลพร้อมกัน...");
    await handleSaveEditedRows(editedRows); // อัปเดตในระบบเรา
    await handleSyncToServer(editedRows); // ส่งไปยัง API เซิร์ฟเวอร์กลาง
    console.log("🎉 การบันทึกและซิงก์ข้อมูลเสร็จสมบูรณ์");
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
          />

          {/* ✅ ปุ่มบันทึก (ใหม่) */}
          <div style={{ textAlign: "right", marginTop: "16px" }}>
            <button
              onClick={() => {
                const editedRows = userTireData.filter(
                  (row) => row.status === 2
                );
                handleSaveAndSync(editedRows);
              }}
            >
              💾 บันทึก + ส่งไป API เซิร์ฟเวอร์
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
