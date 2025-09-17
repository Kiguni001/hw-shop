import React from "react";
import { useState, useEffect } from "react";
import styles from "../styles/HomePage.module.css";
import logo from "../assets/icons/logo.png";
import SearchBar from "../components/SearchBar";

interface UserData {
  first_name: string;
  last_name: string;
  company_name: string;
}

const HomePage: React.FC = () => {
  // สร้าง state สำหรับเก็บข้อมูลผู้ใช้
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // สมมติว่ามี API สำหรับดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
        // ในโปรเจกต์จริง คุณจะต้องส่ง Authentication Token ไปด้วย
        const response = await fetch("http://localhost:3001/api/user/me");

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data: UserData = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // [] เพื่อให้ useEffect ทำงานแค่ครั้งเดียวตอนโหลดหน้าเว็บ

  if (loading) {
    return <div className={styles.container}>กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  return (
    <div className={styles.homePageContainer}>
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

      <div className={styles.BoxZone2}>
        <div className={styles.Zone2}>
          <div className={styles.userInfo}>
            {/* แสดงผลตามที่คุณต้องการ */}
            <p className={styles.companyInfo}>
              <span className={styles.bullet}>•</span> บริษัท:{" "}
              {user?.company_name}
            </p>
            <h1 className={styles.userName}>
              ผู้ใช้: {user?.first_name} {user?.last_name}
            </h1>
          </div>
        </div>
        <div className={styles.Zone3}>
          <SearchBar />
          <p>This is some content for Zone 3.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
