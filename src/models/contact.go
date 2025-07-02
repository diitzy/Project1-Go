package models

import (
	"time"

	"gorm.io/gorm"
)

type Contact struct {
	gorm.Model
	ID        uint      `json:"ID" gorm:"primaryKey"`
	Name      string    `json:"Name"`
	Email     string    `json:"Email"`
	Message   string    `json:"Message"`
	CreatedAt time.Time `json:"CreatedAt"`
}
