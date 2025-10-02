package handlers

import (
	"Kiguni001/hw-shop/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SaveUserTireRecords(db *gorm.DB) fiber.Handler {
    return func(c *fiber.Ctx) error {
        var tires []models.UserTireRecord
        if err := c.BodyParser(&tires); err != nil {
            return c.Status(400).JSON(fiber.Map{"error": err.Error()})
        }

        for _, tire := range tires {
            if err := db.Model(&models.UserTireRecord{}).Where("id = ?", tire.ID).Updates(tire).Error; err != nil {
                return c.Status(500).JSON(fiber.Map{"error": err.Error()})
            }
        }

        return c.JSON(fiber.Map{"message": "success"})
    }
}
