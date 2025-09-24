package models

import "time"

type History struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	Action    string    `json:"action"`    // เช่น "update_price", "create_company"
	Detail    string    `json:"detail"`    // เก็บข้อความสั้น ๆ อธิบาย
	CreatedAt time.Time `json:"created_at"`
}
