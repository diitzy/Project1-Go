package services

import (
	"project-1/src/config"
	"project-1/src/models"
)

func CreateOrder(order *models.Order) error {
	result := config.DB.Create(order)
	return result.Error
}

func GetOrdersByUser(userID uint) ([]models.Order, error) {
	var orders []models.Order
	if err := config.DB.Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		return nil, err
	}
	return orders, nil
}
