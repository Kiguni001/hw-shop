package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	dbURL := os.Getenv("DATABASE_URL")
	dbType := os.Getenv("DB_TYPE") // postgres / mysql

	switch dbType {
	case "postgres":
		DB, err = gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	case "mysql":
		DB, err = gorm.Open(mysql.Open(dbURL), &gorm.Config{})
	default:
		log.Fatal("Unsupported DB_TYPE")
	}

	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	fmt.Println("✅ Database connected!")
}
