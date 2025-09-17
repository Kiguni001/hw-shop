// models/user.go
package models

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	FirstName    string    `gorm:"not null" json:"first_name"`
	LastName     string    `json:"last_name"`
	PhoneNumber  string    `json:"phone_number"`
	PasswordHash string    `gorm:"not null" json:"password_hash"`
	Position     string    `json:"position"`
	Role         string    `json:"role"`

	// Foreign key → ผูกกับ Company
	CompanyID uint    `json:"company_id"`
	Company   Company `gorm:"foreignKey:CompanyID" json:"company"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
