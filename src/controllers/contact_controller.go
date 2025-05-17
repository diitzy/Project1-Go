package controllers

import (
	"net/http"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

// HandleContactForm menangani form kontak dari frontend
func HandleContactForm(c *gin.Context) {
	var msg models.Contact

	// Bind form-data (application/x-www-form-urlencoded)
	msg.Name = c.PostForm("name")
	msg.Email = c.PostForm("email")
	msg.Message = c.PostForm("message")

	// Validasi sederhana
	if msg.Name == "" || msg.Email == "" || msg.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Semua kolom harus diisi."})
		return
	}

	// Simpan ke database
	if err := services.SaveMessage(msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan pesan."})
		return
	}

	// Redirect ke halaman kontak setelah sukses
	c.Redirect(http.StatusFound, "/contact")
}
