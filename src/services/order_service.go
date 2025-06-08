package services

import (
	"project-1/src/config"
	"project-1/src/models"
)

func CreateOrder(order *models.Order) error {
	return config.DB.Create(order).Error
}

// TERBARU
