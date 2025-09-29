package models

import "time"

type User struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
	Password  string `json:"password"`
	Position  string `json:"position"`
	Role      string `json:"role"`    // Admin / user
	TcpsUbID  string  `json:"tcps_ub_id"` // company ID
	CreatedAt time.Time
	UpdatedAt time.Time
}
