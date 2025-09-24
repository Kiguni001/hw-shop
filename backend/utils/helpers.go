package utils

import (
	"hw-shop/backend/models"
	"time"

	"gorm.io/gorm"
)

func LogHistory(db *gorm.DB, userID uint, action string, detail string) {
	history := models.History{
		UserID:    userID,
		Action:    action,
		Detail:    detail,
		CreatedAt: time.Now(),
	}
	db.Create(&history)
}
