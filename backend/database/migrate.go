package database

import (
	"Kiguni001/hw-shop/models"
)

func Migrate() {
	DB.AutoMigrate(
		&models.User{},
		&models.Company{},
		&models.MainTire{},
		&models.UserTire{},
		&models.History{},
	)
}
