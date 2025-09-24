package routes

import (
	"Kiguni001/hw-shop/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupSyncRoutes(app *fiber.App) {
	api := app.Group("/api/user")
	api.Get("/tires/sync", handlers.SyncUserTires)
	api.Get("/history", handlers.GetUserHistory)
}
