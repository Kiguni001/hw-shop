package routes

import (
	"Kiguni001/hw-shop/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Auth
	api.Post("/login", handlers.Login)
	api.Post("/logout", handlers.Logout)

	// Company
	app.Post("/api/company", handlers.CreateCompany)

	app.Post("/api/user", handlers.CreateCompanyFull)


	// UserTire
	api.Get("/user/tires", handlers.GetUserTires)
	api.Post("/user/tires/update", handlers.UpdateUserTires)

	// Sync / History
	SetupSyncRoutes(app)

	// Admin MainTire
	SetupMainTireRoutes(app)
}
