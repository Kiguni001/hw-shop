package routes

import (
	"Kiguni001/hw-shop/handlers"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func UserTireRoutes(app *fiber.App, db *gorm.DB) {
    app.Get("/api/user_tire", handlers.GetUserTirePrices)
    // app.Post("/api/user_tire/save", handlers.SaveUserTireRecords(db))
}
