package routes

import (
	"github.com/gofiber/fiber/v2"
	"Kiguni001/hw-shop/handlers"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Auth
	api.Post("/login", handlers.Login)
	api.Post("/logout", handlers.Logout)

	// Company
	api.Post("/company", handlers.CreateCompany)

	// UserTire
	api.Get("/user/tires", handlers.GetUserTires)
	api.Post("/user/tires/update", handlers.UpdateUserTires)

	// Sync / History
	SetupSyncRoutes(app)

	// Admin MainTire
	SetupMainTireRoutes(app)
}
