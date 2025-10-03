package main

import (
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/routes"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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

	// ✅ เปิด CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowCredentials: true,
	}))

	// Routes
	routes.SetupRoutes(app)

	// ส่ง database.DB ไปยัง route ของ UserTire
	routes.UserTireRoutes(app, database.DB)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Fatal(app.Listen(":" + port))
}
