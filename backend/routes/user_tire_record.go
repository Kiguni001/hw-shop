package routes

import (
	"Kiguni001/hw-shop/handlers"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func UserTireRoutes(app *fiber.App, db *gorm.DB) {

	// User
	app.Get("/api/user/me", handlers.GetCurrentUser(db))
	app.Post("/api/user/me", handlers.GetCurrentUserPost(db))


    // endpoint เดียว ครอบคลุมทั้ง "ทั้งหมด" และ "กรองตาม user"
    app.Get("/api/user_tire", handlers.GetUserTireByUserID(db))

    app.Post("/api/user_tire/save", handlers.SaveUserTireRecords(db))
	
	app.Put("/api/user_tire/:tcps_id", handlers.UpdateUserTireHandler)

	app.Get("/api/company/:id", handlers.GetCompanyByID(db))


	

}