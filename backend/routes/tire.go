package routes

import (
	"Kiguni001/hw-shop/handlers"
	"Kiguni001/hw-shop/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupTireRoutes(app *fiber.App) {
	api := app.Group("/api")

	// BaseTires (AdminOnly)
	api.Get("/base-tires", middleware.AdminOnly, handlers.GetBaseTires)
	api.Put("/base-tires", middleware.AdminOnly, handlers.UpdateBaseTires)


}
