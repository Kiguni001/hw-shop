// handlers/user.go
package handlers

import (
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"
	"log"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func RegisterUser(c *fiber.Ctx) error {
	user := new(models.User)

	if err := c.BodyParser(user); err != nil {
		log.Println("Body parse error:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	var existingUser models.User
	if err := database.DB.Where("first_name = ?", user.FirstName).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "First name already exists"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Password hash error:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not hash password"})
	}
	user.PasswordHash = string(hashedPassword)

	if err := database.DB.Create(&user).Error; err != nil {
		log.Println("Database create error:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":   "User registered successfully",
		"user_id":   user.ID,
		"companyID": user.CompanyID,
	})
}

func LoginUser(c *fiber.Ctx) error {
	type LoginRequest struct {
		FirstName string `json:"first_name"`
		Password  string `json:"password"`
	}

	loginData := new(LoginRequest)
	if err := c.BodyParser(loginData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	var user models.User
	result := database.DB.Where("first_name = ?", loginData.FirstName).First(&user)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid first name or password"})
		}
		log.Println("Database query error:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginData.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid first name or password"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":   "Login successful!",
		"user_id":   user.ID,
		"companyID": user.CompanyID,
	})
}

func GetMe(c *fiber.Ctx) error {
	userID := c.Locals("userID")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.JSON(fiber.Map{
		"user_id":   user.ID,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"phone":     user.PhoneNumber,
		"companyID": user.CompanyID,
		"position":  user.Position,
		"role":      user.Role,
	})
}
