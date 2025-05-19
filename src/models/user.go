package models

type User struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Name     string `json:"name" binding:"required"`
	Email    string `gorm:"unique" json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}
