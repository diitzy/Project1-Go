package controllers

import (
	"net/http"
	"project-1/src/config"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	// Bind JSON input ke struct
	var request struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		Role     string `json:"role"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Data tidak valid", "error": err.Error()})
		return
	}

	// Cek duplikasi email
	var existingUser models.User
	if config.DB.Where("email = ?", request.Email).First(&existingUser).Error == nil {
		c.JSON(http.StatusConflict, gin.H{"message": "Email sudah terdaftar"})
		return
	}

	// Hash password
	hashedPassword, err := services.HashPassword(request.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mengenkripsi password"})
		return
	}

	// Set role default jika kosong
	role := request.Role
	if role == "" {
		role = "user"
	}

	// Buat model user baru
	newUser := models.User{
		Email:    request.Email,
		Password: hashedPassword,
		Role:     role,
	}

	if err := config.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mendaftar pengguna", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Registrasi berhasil"})
}
