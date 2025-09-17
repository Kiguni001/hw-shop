import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/LoginPage.module.css";

const LoginPage: React.FC = () => {
  // เปลี่ยน email เป็น firstName
  const [firstName, setFirstName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // เปลี่ยนเงื่อนไขการตรวจสอบเป็น firstName
    if (!firstName || !password) {
      setError("กรุณากรอกชื่อจริงและรหัสผ่าน");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // เปลี่ยน body ที่ส่งไปให้ Backend เป็น first_name
        body: JSON.stringify({
          first_name: firstName,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      }

      const data = await response.json();
      console.log("เข้าสู่ระบบสำเร็จ:", data);

      // แทนที่ alert ด้วยการนำทางไปยังหน้าอื่น
      navigate("/home"); // เปลี่ยนเส้นทางไปยัง '/home'

      // ลบส่วนจำลองการทำงานออก เพราะใช้การเรียก API จริงแล้ว
      // const data = await response.json();
      // console.log("เข้าสู่ระบบสำเร็จ:", data);
      // alert(data.message);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
      }
    }

    // ลบส่วนจำลองการทำงานออก เพราะใช้การเรียก API จริงแล้ว
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>เข้าสู่ระบบ</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            {/* เปลี่ยน label และ id เป็นชื่อจริง */}
            <label htmlFor="firstName">ชื่อจริง</label>
            <input
              type="text" // เปลี่ยน type เป็น text
              id="firstName"
              className={styles.inputField}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            เข้าสู่ระบบ
          </button>
        </form>
        <p className={styles.footerText}>
          ยังไม่มีบัญชี?{" "}
          <Link to="/register" className={styles.link}>
            ลงทะเบียน
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
