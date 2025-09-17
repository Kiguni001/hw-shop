package routes

import (
    "Kiguni001/hw-shop/handlers"
    "Kiguni001/hw-shop/middleware"
    "github.com/gofiber/fiber/v2"
)

func RegisterCompanyRoutes(app *fiber.App) {
    api := app.Group("/api")

    // สร้างบริษัทใหม่ (Admin Only)
    api.Post("/admin/create-company", middleware.AdminOnly, handlers.CreateCompany)

    // ดึงรายชื่อบริษัท
    api.Get("/companies", handlers.GetCompanies)
}
