package routes

import (
    "github.com/gofiber/fiber/v2"
    "Kiguni001/hw-shop/handlers"
)

func AuthRoutes(app *fiber.App) {
    app.Post("/api/auth/login", handlers.Login)

}
