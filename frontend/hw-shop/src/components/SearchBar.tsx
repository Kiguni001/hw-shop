import React from "react";
import styles from "../styles/SearchBar.module.css";

const SearchBar: React.FC = () => {
  const handleSaveClick = () => {
    // 👉 ส่ง Event ไปให้ TireTable
    window.dispatchEvent(new Event("SAVE_TIRES"));
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchContainerKid}>
        {/* กล่องค้นหา */}
        <div className={styles.searchZone1}>
          <div className={styles.searchBox}>
            <div className={styles.textBox}>
              <input type="text" placeholder="ค้นหา..." />
            </div>
            <div className={styles.searchIcon}>
              <button className={styles.searchBtn}>
                <img
                  src="/src/assets/icons/search.png"
                  alt="search icon"
                  className={styles.icon}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.searchZone2}>
        {/* ปุ่มค้นหาด้วย Brand */}
        <button className={styles.brandBtn}>ค้นหาด้วย Brand</button>

        {/* แสดงจำนวน */}
        <span className={styles.itemCount}>แสดงทั้งหมด xxxx รายการ</span>

        {/* ปุ่มบันทึก */}
        <button className={styles.saveBtn} onClick={handleSaveClick}>
          บันทึกการแก้ไข
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
