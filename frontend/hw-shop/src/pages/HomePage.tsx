import React, { useState, useEffect } from "react";
import styles from "../styles/HomePage.module.css";
import logo from "../assets/icons/logo.png";
import SearchBar from "../components/SearchBar";
import UserTireTable from "../components/UserTireTable";
import type { TireRow } from "../components/UserTireTable";
import type { PriceKeys } from "../components/UserTireTable";
import { sendUpdatedPricesToServer } from "../services/api_service";

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

  type ApiServerRow = {
    tcps_id: string;
    tcps_ub_id: string;
    updated_at: string;
  };

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
  // ใน HomePage.tsx
  // ใน HomePage.tsx
  // ใน HomePage.tsx
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

  // ...existing code...
  const handleSave = async () => {
    const editedRows = userTireData.filter((row) => row.status === 2);
    if (editedRows.length === 0) {
      alert("ไม่มีข้อมูลที่ถูกแก้ไข");
      return;
    }

    try {
      const resp = await sendUpdatedPricesToServer(
        user?.tcps_ub_id ?? "",
        editedRows
      );
      console.log("Updated rows:", resp);

      type RawApiRow = {
        tcps_id?: string;
        tcps_ub_id?: string;
        updated_at?: string;
        // เพิ่ม field อื่น ๆ ถ้ามี
      };

      const updatedRows: ApiServerRow[] = Array.isArray(resp.data_list)
        ? (resp.data_list as RawApiRow[])
            .filter(
              (r) =>
                typeof r.updated_at === "string" &&
                typeof r.tcps_id === "string" &&
                typeof r.tcps_ub_id === "string"
            )
            .map((r) => ({
              tcps_id: r.tcps_id!,
              tcps_ub_id: r.tcps_ub_id!,
              updated_at: r.updated_at!,
            }))
        : [];

      setUserTireData((prev) =>
        prev.map((row) => {
          const updated = updatedRows.find(
            (r) => r.tcps_id === row.tcps_id && r.tcps_ub_id === row.tcps_ub_id
          );
          return updated
            ? { ...row, status: 1, updatedAt: updated.updated_at }
            : row;
        })
      );

      alert("อัปเดตจาก API เซิฟเวอร์เรียบร้อยแล้ว");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการอัปเดตจาก API เซิฟเวอร์");
    }
  };
  // ...existing code...

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
            <img
              src="/src/assets/icons/user.png"
              alt="user icon"
              className={styles.icon}
            />
            <span>แก้ไขโปรไฟล์</span>
          </button>
          <button
            className={styles.saleButton}
            onClick={() => alert("จัดโปรโมชั่น")}
          >
            <img
              src="/src/assets/icons/sale.png"
              alt="sale icon"
              className={styles.icon}
            />
            <span>จัดโปรโมชั่น</span>
          </button>
          <button
            className={styles.exitButton}
            onClick={() => alert("ออกจากระบบ")}
          >
            <img
              src="/src/assets/icons/esc.png"
              alt="exit icon"
              className={styles.icon}
            />
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
            onSaveEditedRows={handleSaveEditedRows} // ✅ ส่ง callback ให้ table
          />

          {/* ✅ ปุ่มบันทึก (ใหม่) */}
          <div style={{ textAlign: "right", marginTop: "16px" }}>
            <button
              style={{
                background: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              // onClick={() => {
              //   // ดึงแถวที่แก้ไขจาก table ผ่าน state ของ HomePage
              //   const editedRows = userTireData.filter(
              //     (row) => row.status === 2
              //   );
              //   if (editedRows.length > 0) {
              //     handleSaveEditedRows(editedRows); // ✅ ส่ง array ไป
              //   } else {
              //     alert("ไม่มีข้อมูลที่ถูกแก้ไข");
              //   }
              // }}
              onClick={handleSave} // ✅ เรียกฟังก์ชัน handleSave ตรงๆ
            >
              💾 บันทึกการแก้ไข
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
