package controllers

import (
	"net/http"
	"strings"

	"project-1/src/config"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

// Login menangani proses autentikasi pengguna berdasarkan email dan password
func Login(c *gin.Context) {
	// Struktur untuk menampung input dari form login
	var request struct {
		Email    string `form:"email" binding:"required,email"`
		Password string `form:"password" binding:"required,min=6"`
	}

	// Validasi input dari request
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid"})
		return
	}

	// Trim spasi pada email
	request.Email = strings.TrimSpace(request.Email)

	// Ambil user dari database berdasarkan email
	var user models.User
	if err := config.DB.Where("email = ?", request.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email tidak ditemukan"})
		return
	}

	// Cek apakah password cocok dengan hash yang tersimpan
	if !services.CheckPasswordHash(request.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Password salah"})
		return
	}

	// Jika sukses, kembalikan respon sukses dan informasi user
	c.JSON(http.StatusOK, gin.H{
		"message": "Login berhasil",
		"user":    user.Email,
	})
}
