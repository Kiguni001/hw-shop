package models

type Company struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Name     string `json:"name" gorm:"unique"`
	TcpsUbID string `json:"tcps_ub_id" gorm:"unique"`
}
