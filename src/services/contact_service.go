package services

import (
	"project-1/src/config"
	"project-1/src/models"
)

// SaveMessage menyimpan pesan kontak ke database
func SaveMessage(msg models.Contact) error {
	result := config.DB.Create(&msg)
	return result.Error
}
