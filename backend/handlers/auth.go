package handlers

import (
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"
	"time"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/golang-jwt/jwt/v5"
)

var Store = session.New()

var jwtSecret = []byte("your_super_secret_key") // เปลี่ยนเป็น key ของคุณ

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
			TcpsUbID:  "admin",
		}
	} else {
		if err := database.DB.Where("first_name = ? AND password = ?", input.Username, input.Password).First(&user).Error; err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "invalid credentials"})
		}
	}

fmt.Println("Login user:", user.FirstName, "TcpsUbID:", user.TcpsUbID)

	// สร้าง Session
	sess, _ := Store.Get(c)
	sess.Set("user_id", user.ID)
	sess.Set("role", user.Role)
	sess.Set("tcps_ub_id", user.TcpsUbID)
	sess.Save()

	// สร้าง JWT Token
	claims := jwt.MapClaims{
		"user_id":    user.ID,
		"role":       user.Role,
		"tcps_ub_id": user.TcpsUbID,
		"exp":        time.Now().Add(time.Hour * 24).Unix(), // หมดอายุ 1 วัน
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "cannot create token"})
	}

	// ส่ง response กลับ client
	return c.JSON(fiber.Map{
		"message":    "login success",
		"role":       user.Role,
		"user_id":    user.ID,         // ✅ เพิ่มบรรทัดนี้
		"tcps_ub_id": user.TcpsUbID,
		"token":      signedToken,
	})
}


func Logout(c *fiber.Ctx) error {
	sess, _ := Store.Get(c)
	sess.Destroy()
	return c.JSON(fiber.Map{"message": "logout success"})
}


