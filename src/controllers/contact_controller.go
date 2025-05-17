package controllers

import (
	"log"
	"net/http"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

// HandleContactForm memproses pengiriman form kontak
func HandleContactForm(c *gin.Context) {
	var msg models.Contact

	// Mengambil data dari form input
	log.Println("📩 Controller HandleContactForm terpanggil")

	msg.Name = c.PostForm("name")
	msg.Email = c.PostForm("email")
	msg.Message = c.PostForm("message")

	log.Printf("📥 Data masuk: %#v\n", msg)

	// Validasi sederhana
	if msg.Name == "" || msg.Email == "" || msg.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Semua kolom harus diisi."})
		return
	}

	// Simpan pesan ke database
	if err := services.SaveMessage(&msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan pesan."})
		return
	}

	// Tanggapan sukses
	c.Redirect(http.StatusFound, "/contact")
}
