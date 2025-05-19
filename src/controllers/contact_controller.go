package controllers

import (
	"log"
	"net/http"
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
