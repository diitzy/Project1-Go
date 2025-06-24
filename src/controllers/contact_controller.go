package controllers

import (
	"log"
	"net/http"
	"project-1/src/config"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

// HandleContactForm memproses pengiriman data dari form kontak
func HandleContactForm(c *gin.Context) {
	var msg models.Contact

	// Logging pemanggilan controller
	log.Println("📩 Controller HandleContactForm terpanggil")

	// Mengambil data dari form input menggunakan metode POST
	msg.Name = c.PostForm("name")
	msg.Email = c.PostForm("email")
	msg.Message = c.PostForm("message")

	// Logging data input
	log.Printf("📥 Data masuk: %#v\n", msg)

	// Validasi input dasar
	if msg.Name == "" || msg.Email == "" || msg.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Semua kolom harus diisi.",
		})
		return
	}

	// Menyimpan pesan ke database menggunakan service layer
	if err := services.SaveMessage(&msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal menyimpan pesan.",
		})
		return
	}

	// Redirect ke halaman kontak setelah pengiriman berhasil
	c.Redirect(http.StatusFound, "/contact")
}

// GetAllMessages menangani pengambilan semua data pesan dari database
func GetAllMessages(c *gin.Context) {
	var messages []models.Contact

	log.Println("📨 Controller GetAllMessages terpanggil")

	// Validasi token admin (jika diperlukan)
	// Anda bisa menambahkan middleware autentikasi di sini
	
	// Set headers untuk CORS jika diperlukan
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Query database untuk mengambil semua pesan
	if err := config.DB.Order("created_at desc").Find(&messages).Error; err != nil {
		log.Printf("❌ Gagal mengambil data pesan dari database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal mengambil data pesan dari database",
		})
		return
	}

	log.Printf("✅ Berhasil mengambil %d pesan", len(messages))

	// Set content type dan return response
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, messages)
}