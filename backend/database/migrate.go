// database/migrate.go
package database

import (
	"log"

	"Kiguni001/hw-shop/models"
)

func Migrate() {
	err := DB.AutoMigrate(
		&models.Company{},
		&models.User{},
		&models.MainTire{},
		&models.UserTire{},
		&models.History{},
	)
	if err != nil {
		log.Fatal("AutoMigrate failed:", err)
	}
}
