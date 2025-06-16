package controllers

import (
	"net/http"
	"project-1/src/config"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt" // Import bcrypt
)

func Login(c *gin.Context) {
	var loginData models.User
	var userInDb models.User

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid"})
		return
	}

	// Cari user berdasarkan email
	if err := config.DB.Where("email = ?", loginData.Email).First(&userInDb).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau password salah"})
		return
	}

	// PERBAIKAN: Verifikasi password dengan bcrypt
	if err := bcrypt.CompareHashAndPassword([]byte(userInDb.Password), []byte(loginData.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau password salah"})
		return
	}

	// Buat token JWT yang berisi role
	token, err := services.GenerateToken(userInDb.ID, userInDb.Email, userInDb.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat token"})
		return
	}

	// Kirim token DAN role ke frontend
	c.JSON(http.StatusOK, gin.H{
		"message": "Login berhasil",
		"token":   token,
		"role":    userInDb.Role,
	})
}
