package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"backend/models"
	"backend/routes"
)

func main() {
	dsn := "host=localhost user=postgres password=postgres dbname=tiredb port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Auto migrate tables
	db.AutoMigrate(&models.UserTire{}, &models.MainTire{})

	r := gin.Default()
	routes.RegisterRoutes(r, db)

	r.Run(":8080")
}
