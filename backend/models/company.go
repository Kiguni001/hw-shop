package models

import "time"

type Company struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	CompanyName string `json:"company_name"` // ชื่อบริษัท
	TcpsUbID    string `json:"tcps_ub_id"`   // รหัสบริษัท
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
