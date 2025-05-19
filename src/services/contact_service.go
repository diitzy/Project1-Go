package services

import (
	"project-1/src/config"
	"project-1/src/models"
)

// SaveMessage menyimpan data dari form kontak ke dalam database.
// Menerima pointer ke struct Contact, lalu menyisipkannya ke tabel terkait.
func SaveMessage(contact *models.Contact) error {
	result := config.DB.Create(contact)
	return result.Error
}
