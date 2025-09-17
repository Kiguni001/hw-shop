package routes

import (
	"Kiguni001/hw-shop/handlers"
	"Kiguni001/hw-shop/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterAdminRoutes(app *fiber.App) {
	admin := app.Group("/api/admin")

	admin.Post("/create-company", middleware.AdminOnly, handlers.CreateCompany)
	admin.Put("/base-tires", middleware.AdminOnly, handlers.UpdateBaseTires)
}
