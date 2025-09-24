package models

import "time"

type Company struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	Name   string `json:"name"`
	TcpsID string `json:"tcps_id"` // company identifier
	CreatedAt time.Time
	UpdatedAt time.Time
}
