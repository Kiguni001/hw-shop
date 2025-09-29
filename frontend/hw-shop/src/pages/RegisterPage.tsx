// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import type { FormEvent } from "react";
import styles from "../styles/RegisterPage.module.css";

interface Company {
  id: number;
  name: string;
  tcps_ub_id: string;
}

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1); // สเต็ป 1 = สร้างบริษัท, 2 = สร้าง user
  const [companyName, setCompanyName] = useState("");
  const [tcpsUbId, setTcpsUbId] = useState("");
  const [companyCreated, setCompanyCreated] = useState<Company | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  // Step 1: สร้างบริษัท
  const handleCreateCompany = async (e: FormEvent) => {
    e.preventDefault();
    if (!companyName || !tcpsUbId) {
      setError("กรุณากรอกชื่อบริษัทและ TCP ID");
      return;
    }
    setError(null);

    const companyData = {
      name: companyName, // สมมติคุณเก็บชื่อบริษัทใน state companyName
      tcps_ub_id: tcpsUbId, // สมมติคุณเก็บ tcps_ub_id ใน state tcpsUbId
    };

    try {
      const response = await fetch("http://localhost:3000/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "ไม่สามารถสร้างบริษัทได้");
      }

      const data = await response.json();
      setCompanyCreated({
        id: data.id,
        name: companyName,
        tcps_ub_id: tcpsUbId,
      });
      setStep(2);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
    }
  };

  // Step 2: สร้าง User แรกของบริษัท
  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !position || !password) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    if (!companyCreated) return;

    setError(null);

    // console.log(companyName);
    // console.log(tcpsUbId);
    // console.log("companyName");
    // console.log(companyName);
    // console.log(tcpsUbId);
    // console.log("tcpsUbId");
    try {
      // console.log("companyName");
      // console.log(companyName);
      // console.log(tcpsUbId);
      // console.log("tcpsUbId");
      const response = await fetch("http://localhost:3000/api/user", {
        // app.Post("/api/user", handlers.CreateCompany)
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName,
          tcpsUbId: tcpsUbId,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          position: position,
          password: password,
          // tcps_ub_id: companyCreated.tcps_ub_id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "ไม่สามารถสร้างผู้ใช้ได้");
      }

      const data = await response.json();
      alert(data.message || "สร้างผู้ใช้สำเร็จ!");
      // รีเซ็ตฟอร์มหรือ redirect ไปหน้า login
      setStep(1);
      setCompanyName("");
      setTcpsUbId("");
      setCompanyCreated(null);
      setFirstName("");
      setLastName("");
      setPhone("");
      setPosition("");
      setPassword("");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
    }
  };

  return (
    <div className={styles.registerPageContainer}>
      <div className={styles.registerBox}>
        {step === 1 && (
          <>
            <h2 className={styles.title}>สร้างบริษัท</h2>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <form
              onSubmit={handleCreateCompany}
              className={styles.registerForm}
            >
              <div className={styles.inputGroup}>
                <label htmlFor="companyName">ชื่อบริษัท</label>
                <input
                  type="text"
                  id="companyName"
                  className={styles.inputField}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="tcpsUbId">TCP ID</label>
                <input
                  type="text"
                  id="tcpsUbId"
                  className={styles.inputField}
                  value={tcpsUbId}
                  onChange={(e) => setTcpsUbId(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.registerButton}>
                สร้างบริษัท
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={styles.title}>สร้างผู้ใช้แรกของบริษัท</h2>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleCreateUser} className={styles.registerForm}>
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
                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  id="phone"
                  className={styles.inputField}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
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
                สร้างผู้ใช้
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
