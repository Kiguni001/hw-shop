package models

type User struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
	Password  string `json:"password"`
	Position  string `json:"position"`
	Role      string `json:"role"`    // admin / user
	TcpsID    string `json:"tcps_id"` // company ref
}
