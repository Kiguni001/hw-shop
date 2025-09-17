// src/pages/RegisterPage.tsx
import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import styles from "../styles/RegisterPage.module.css";

interface Company {
  id: number;
  name: string;
}

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [companyId, setCompanyId] = useState<number | "">("");
  const [position, setPosition] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ดึงรายชื่อบริษัทจาก API
  useEffect(() => {
    fetch("http://localhost:3001/api/companies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCompanies(data);
        else setCompanies([]);
      })
      .catch((err) => {
        console.error("Cannot fetch companies:", err);
        setCompanies([]);
      });
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!companyId) {
      setError("กรุณาเลือกบริษัท");
      return;
    }

    setError(null);

    const userData = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      company_id: companyId, // ส่งเป็น ID ของบริษัท
      position: position,
      password_hash: password,
    };

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      alert(data.message);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    }
  };

  return (
    <div className={styles.registerPageContainer}>
      <div className={styles.registerBox}>
        <h2 className={styles.title}>ลงทะเบียน</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName">ชื่อจริง</label>
            <input
              type="text"
              id="firstName"
              className={styles.inputField}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="lastName">นามสกุล</label>
            <input
              type="text"
              id="lastName"
              className={styles.inputField}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phoneNumber">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              id="phoneNumber"
              className={styles.inputField}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="companyId">บริษัท</label>
            <select
              id="companyId"
              className={styles.inputField}
              value={companyId}
              onChange={(e) => setCompanyId(Number(e.target.value))}
              required
            >
              <option value="">-- เลือกบริษัท --</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="position">ตำแหน่ง</label>
            <input
              type="text"
              id="position"
              className={styles.inputField}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
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

          <button type="submit" className={styles.registerButton}>
            ลงทะเบียน
          </button>
        </form>
        <p className={styles.footerText}>
          มีบัญชีอยู่แล้ว?{" "}
          <a href="/login" className={styles.link}>
            เข้าสู่ระบบ
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
