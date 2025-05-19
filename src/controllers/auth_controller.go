package controllers

import (
	"net/http"
	"project-1/src/models"
	"project-1/src/services"
	"project-1/src/utils"

	"github.com/gin-gonic/gin"
)

// Register menangani pendaftaran user baru
func Register(c *gin.Context) {
	var user models.User
	// Parsing JSON input ke struct User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	savedUser, err := services.RegisterUser(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create user"})
		return
	}

	c.JSON(http.StatusCreated, savedUser)
}

// Login menangani autentikasi user dan menghasilkan token
func Login(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, valid := services.LoginUser(input.Email, input.Password)
	if !valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
