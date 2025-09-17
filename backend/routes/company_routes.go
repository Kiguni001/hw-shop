package routes

import (
	"Kiguni001/hw-shop/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupCompanyRoutes(app *fiber.App) {
	api := app.Group("/api")

	api.Post("/companies", handlers.CreateCompany)
	api.Get("/companies", handlers.GetCompanies)
}
