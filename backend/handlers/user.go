// handlers/user.go
package handlers

import (
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"
	"log"

	"github.com/gofiber/fiber/v2"
)

// GetUsersByCompany - ดึง user ของบริษัทตัวเอง
func GetUsersByCompany(c *fiber.Ctx) error {
	cid := c.Locals("cid").(uint)

	var users []models.User
	if err := database.DB.Where("cid = ?", cid).Find(&users).Error; err != nil {
		log.Println("Get users error:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot fetch users"})
	}

	return c.JSON(users)
}
