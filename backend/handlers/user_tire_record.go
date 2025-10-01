package handlers

import (
	"Kiguni001/hw-shop/models"
    "Kiguni001/hw-shop/database"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetUserTirePrices(c *fiber.Ctx) error {
	var tires []models.UserTire

	// ดึงเฉพาะ column ราคาที่ต้องการ
	if err := database.DB.Select([]string{
		"tcps_tb_name",
        "tcps_tbi_name",
        "tcps_sidewall_name",
        "tcps_price_r13",
        "tcps_price_r14",
        "tcps_price_r15",
		"tcps_price_r16",
		"tcps_price_r17",
		"tcps_price_r18",
		"tcps_price_r19",
		"tcps_price_r20",
		"tcps_price_r21",
        "tcps_price_r22",
        "tcps_price_trade_in",
	}).Find(&tires).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(tires)
}

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
