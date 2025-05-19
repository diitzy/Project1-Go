package controllers

import (
	"net/http"
	"strings"

	"project-1/src/config"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var request struct {
		Email    string `form:"email" binding:"required,email"`
		Password string `form:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid"})
		return
	}

	request.Email = strings.TrimSpace(request.Email)

	var user models.User
	if err := config.DB.Where("email = ?", request.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email tidak ditemukan"})
		return
	}

	if !services.CheckPasswordHash(request.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Password salah"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login berhasil", "user": user.Email})
}
