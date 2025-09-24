package handlers

import (
	"encoding/json"
	"time"
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"

	"github.com/gofiber/fiber/v2"
)

func LogHistory(userID uint, tireID uint, action string, oldValue interface{}, newValue interface{}) {
	oldJSON, _ := json.Marshal(oldValue)
	newJSON, _ := json.Marshal(newValue)

	history := models.History{
		UserID:   userID,
		TireID:   tireID,
		Action:   action,
		OldValue: string(oldJSON),
		NewValue: string(newJSON),
		CreatedAt: time.Now(),
	}

	database.DB.Create(&history)
}

// Optional: Get history ของ user
func GetUserHistory(c *fiber.Ctx) error {
	sess, _ := Store.Get(c)
	userID := sess.Get("user_id").(uint)

	var histories []models.History
	database.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&histories)

	return c.JSON(fiber.Map{"data": histories})
}
