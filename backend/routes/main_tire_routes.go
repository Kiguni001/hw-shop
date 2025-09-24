package routes

import (
	"Kiguni001/hw-shop/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupMainTireRoutes(app *fiber.App) {
	admin := app.Group("/api/admin") // เฉพาะ admin

	admin.Get("/main_tires", handlers.GetMainTires)
	admin.Post("/main_tires", handlers.CreateMainTire)
	admin.Put("/main_tires/:id", handlers.UpdateMainTire)
	admin.Delete("/main_tires/:id", handlers.DeleteMainTire)
}
