// project-1/src/models/user_model.go

package models

import "gorm.io/gorm"

// User merepresentasikan data pengguna
type User struct {
	gorm.Model
	Email    string `gorm:"unique;not null" json:"email"`
	Password string `gorm:"not null" json:"password"`
	Role     string `gorm:"default:'user';not null" json:"role"` // <-- TAMBAHKAN BARIS INI
}
