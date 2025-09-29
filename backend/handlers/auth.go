package handlers

import (
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

var Store = session.New()

func Login(c *fiber.Ctx) error {
	type LoginInput struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var input LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	var user models.User
	// ตรวจสอบ Admin
	if input.Username == "Admin" && input.Password == "zxcv1420a" {
		user = models.User{
			ID:        0,
			FirstName: "Admin",
			Role:      "admin",
		}
	} else {
		if err := database.DB.Where("first_name = ? AND password = ?", input.Username, input.Password).First(&user).Error; err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "invalid credentials"})
		}
	}

	// สร้าง Session
	sess, _ := Store.Get(c)
	sess.Set("user_id", user.ID)
	sess.Set("role", user.Role)
	sess.Set("tcps_id", user.TcpsID)
	sess.Save()

	return c.JSON(fiber.Map{"message": "login success", "role": user.Role})
}

func Logout(c *fiber.Ctx) error {
	sess, _ := Store.Get(c)
	sess.Destroy()
	return c.JSON(fiber.Map{"message": "logout success"})
}
