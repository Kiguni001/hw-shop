import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/LoginPage.module.css";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!username || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ส่ง cookie/session ไปเก็บ session
        body: JSON.stringify({ username, password }), // ✅ แก้เป็น username
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      }

      // login สำเร็จ
      const data = await response.json();
      console.log("เข้าสู่ระบบสำเร็จ:", data);

      // redirect ตาม role
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>เข้าสู่ระบบ</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">ชื่อผู้ใช้</label>
            <input
              type="text"
              placeholder="Username"
              className={styles.inputField}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="Password"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
