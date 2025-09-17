// database/connection.go
package database

import (
	"fmt"
	"log"
	"os"

	"Kiguni001/hw-shop/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error

	// อ่านค่าจาก ENV ก่อน ถ้าไม่มีจะใช้ DSN ด้านล่าง
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=zxcv1420vcxz1024 dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Bangkok"
	}

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	fmt.Println("✅ Connected to database successfully!")
}

// ใช้สำหรับ migrate ตาราง
func Migrate() {
	err := DB.AutoMigrate(&models.Company{}, &models.User{})
	if err != nil {
		log.Fatal("❌ Failed to migrate database:", err)
	}

	fmt.Println("✅ Database migrated successfully!")
}
