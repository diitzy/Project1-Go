package controllers

import (
	"log"
	"net/http"
	"project-1/src/config"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

func HandleContactForm(c *gin.Context) {
	var msg models.Contact

	log.Println("📩 Controller HandleContactForm terpanggil")

	msg.Name = c.PostForm("name")
	msg.Email = c.PostForm("email")
	msg.Message = c.PostForm("message")

	log.Printf("📥 Data masuk: %#v\n", msg)

	if msg.Name == "" || msg.Email == "" || msg.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Semua kolom harus diisi.",
		})
		return
	}

	if err := services.SaveMessage(&msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal menyimpan pesan.",
		})
		return
	}

	c.Redirect(http.StatusFound, "/contact")
}

func GetAllMessages(c *gin.Context) {
	var messages []models.Contact

	log.Println("📨 Controller GetAllMessages terpanggil")

	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if err := config.DB.Order("created_at desc").Find(&messages).Error; err != nil {
		log.Printf("❌ Gagal mengambil data pesan dari database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal mengambil data pesan dari database",
		})
		return
	}

	log.Printf("✅ Berhasil mengambil %d pesan", len(messages))

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, messages)
}
