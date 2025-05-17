package models

import "gorm.io/gorm"

type Contact struct {
	gorm.Model
	Name    string
	Email   string
	Message string
}
