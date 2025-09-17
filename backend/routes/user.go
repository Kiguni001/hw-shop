// routes/user.go หรือสร้าง routes/company_routes.go ก็ได้
package routes

import (
	"Kiguni001/hw-shop/handlers"
	"Kiguni001/hw-shop/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Companies
	api.Get("/companies", handlers.GetCompanies)
	api.Post("/admin/create-company", middleware.AdminOnly, handlers.CreateCompany)

	// Users
	api.Post("/register", handlers.RegisterUser)
	api.Post("/login", handlers.LoginUser)
	api.Get("/user/me", handlers.GetMe)
}
