package main

import (
	"log"
	"os"
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Connect DB
	database.ConnectDB()
	database.Migrate()

	app := fiber.New()

	// Routes
	routes.SetupRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Fatal(app.Listen(":" + port))
}
