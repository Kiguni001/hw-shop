package models

import "time"

type History struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	UserID   uint   `json:"user_id"`
	TireID   uint   `json:"tire_id"`
	Action   string `json:"action"`    // edit price, sync, etc
	OldValue string `json:"old_value"` // JSON string
	NewValue string `json:"new_value"` // JSON string
	CreatedAt time.Time
}
