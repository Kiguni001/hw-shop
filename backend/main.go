package main

import (
	"log"
	"os"

	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	// โหลดไฟล์ .env (ถ้ามี)
	if os.Getenv("DATABASE_URL") == "" {
		err := godotenv.Load()
		if err != nil {
			log.Println("⚠️  Error loading .env file")
		}
	}

	// เชื่อมต่อฐานข้อมูล + migrate
	database.ConnectDB()
	database.Migrate()

	// สร้าง Fiber app
	app := fiber.New()

	// เปิด CORS ให้ frontend เรียกได้
	app.Use(cors.New())

	// Setup routes ที่ใช้งานจริง
	routes.SetupRoutes(app)
	routes.SetupCompanyRoutes(app)
	// routes.SetupTireRoutes(app)          // ถ้ายังไม่ได้ใช้ ลบออกก่อน
	// routes.SetupCompanyTireRoutes(app)   // ถ้ายังไม่ได้ใช้ ลบออกก่อน
	// routes.RegisterAdminRoutes(app)      // ถ้ายังไม่ได้ใช้ ลบออกก่อน

	// เริ่มเซิร์ฟเวอร์
	log.Fatal(app.Listen(":3001"))
}
