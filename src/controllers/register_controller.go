package controllers

import (
	"net/http"
	"project-1/src/config"
	"project-1/src/models"
	"project-1/src/services" // Import services untuk menggunakan HashPassword

	"github.com/gin-gonic/gin"
)

// PERBAIKAN: Hapus duplikasi HashPassword, gunakan dari services
func Register(c *gin.Context) {
	var request struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		Role     string `json:"role"` // Opsional, default akan 'user'
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Data tidak valid", "error": err.Error()})
		return
	}

	// Cek apakah email sudah terdaftar
	var existingUser models.User
	if config.DB.Where("email = ?", request.Email).First(&existingUser).Error == nil {
		c.JSON(http.StatusConflict, gin.H{"message": "Email sudah terdaftar"})
		return
	}

	// PERBAIKAN: Gunakan HashPassword dari services
	hashedPassword, err := services.HashPassword(request.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mengenkripsi password"})
		return
	}

	// Set default role jika tidak diberikan
	role := request.Role
	if role == "" {
		role = "user"
	}

	// Buat user baru
	newUser := models.User{
		Email:    request.Email,
		Password: hashedPassword,
		Role:     role,
	}

	// Simpan ke database
	if err := config.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mendaftar pengguna", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Registrasi berhasil"})
}
