package models

import "time"

type Company struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	Name   string `json:"name"`
	TcpsUbID  string `json:"tcps_ub_id"` // company ID
	CreatedAt time.Time
	UpdatedAt time.Time
}
