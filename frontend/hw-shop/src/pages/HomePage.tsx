import React, { useState, useEffect } from "react";
import styles from "../styles/HomePage.module.css";
import logo from "../assets/icons/logo.png";
import SearchBar from "../components/SearchBar";
import UserTireTable from "../components/UserTireTable";
import type { TireRow } from "../components/UserTireTable";

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
  const [company, setCompany] = useState<CompanyData | null>(null);
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

  // 2️⃣ Fetch ข้อมูลบริษัท หลังจาก user โหลดแล้ว
  // useEffect(() => {
  //   const fetchCompany = async () => {
  //     if (!user?.tcps_ub_id) return;
  //     try {
  //       const res = await fetch(
  //         `http://localhost:3000/api/company/${user.tcps_ub_id}`,
  //         { credentials: "include" }
  //       );
  //       if (!res.ok) throw new Error("Failed to fetch company data");
  //       const data: CompanyData = await res.json();
  //       console.log("✅ Company data loaded:", data);
  //       setCompany(data);
  //     } catch (err) {
  //       console.error("❌ Error fetching company:", err);
  //     }
  //   };
  //   fetchCompany();
  // }, [user?.tcps_ub_id]);

  // 3️⃣ Fetch ตารางยางเฉพาะ user
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
        setUserTireData(data);
      } catch (err) {
        console.error("❌ Error fetching user tire:", err);
      }
    };
    fetchUserTire();
  }, [user?.tcps_ub_id]);

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
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
