package services

import (
	"project-1/src/config"
	"project-1/src/models"
	"project-1/src/utils"
)

// RegisterUser menyimpan user baru ke database dengan hash password
func RegisterUser(user *models.User) (*models.User, error) {
	hash, err := utils.HashPassword(user.Password)
	if err != nil {
		return nil, err
	}
	user.Password = hash
	result := config.DB.Create(user)
	return user, result.Error
}

// LoginUser mencari user berdasarkan email dan validasi password
func LoginUser(email, password string) (*models.User, bool) {
	var user models.User
	result := config.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, false
	}
	if !utils.CheckPasswordHash(password, user.Password) {
		return nil, false
	}
	return &user, true
}
