package services

import (
	"fmt"
	"log"
	"project-1/src/config"
	"project-1/src/models"
)

func SaveMessage(msg *models.Contact) error {
	log.Printf("💾 Menyimpan pesan: %#v", msg)

	if msg.Name == "" || msg.Email == "" || msg.Message == "" {
		log.Println("❌ Data tidak lengkap")
		return fmt.Errorf("data tidak lengkap")
	}

	if err := config.DB.Create(msg).Error; err != nil {
		log.Printf("❌ Gagal menyimpan pesan ke database: %v", err)
		return err
	}

	log.Printf("✅ Pesan berhasil disimpan dengan ID: %d", msg.ID)
	return nil
}

func GetAllMessages() ([]models.Contact, error) {
	var messages []models.Contact

	log.Println("📨 Mengambil semua pesan dari database...")

	if err := config.DB.Order("created_at desc").Find(&messages).Error; err != nil {
		log.Printf("❌ Gagal mengambil pesan dari database: %v", err)
		return nil, err
	}

	log.Printf("✅ Berhasil mengambil %d pesan", len(messages))
	return messages, nil
}

func GetMessageByID(id uint) (*models.Contact, error) {
	var message models.Contact

	if err := config.DB.First(&message, id).Error; err != nil {
		log.Printf("❌ Gagal mengambil pesan dengan ID %d: %v", id, err)
		return nil, err
	}

	return &message, nil
}

func DeleteMessage(id uint) error {
	if err := config.DB.Delete(&models.Contact{}, id).Error; err != nil {
		log.Printf("❌ Gagal menghapus pesan dengan ID %d: %v", id, err)
		return err
	}

	log.Printf("✅ Pesan dengan ID %d berhasil dihapus", id)
	return nil
}
