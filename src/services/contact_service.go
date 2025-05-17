package services

import (
	"project-1/src/config"
	"project-1/src/models"
)

// SaveMessage menyimpan data contact ke database
func SaveMessage(contact *models.Contact) error {
	result := config.DB.Create(contact)
	return result.Error
}
