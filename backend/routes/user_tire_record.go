package routes

import (
	"Kiguni001/hw-shop/handlers"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func UserTireRoutes(app *fiber.App, db *gorm.DB) {
    // endpoint เดียว ครอบคลุมทั้ง "ทั้งหมด" และ "กรองตาม user"
    app.Get("/api/user_tire", handlers.GetUserTireByUserID(db))

    app.Post("/api/user_tire/save", handlers.SaveUserTireRecords(db))
}
