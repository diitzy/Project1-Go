package services

import (
	"project-1/src/config"
	"project-1/src/models"
)

func CreateOrder(order *models.Order) error {
	tx := config.DB.Begin()

	if err := tx.Create(order).Error; err != nil {
		tx.Rollback()
		return err
	}

	for _, item := range order.Items {
		item.OrderID = order.ID // penting: set manual foreign key
		if err := tx.Create(&item).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}

// TERBARU
// GetAllOrders mengambil seluruh data order dari database
func GetAllOrders() ([]models.Order, error) {
	var orders []models.Order
	err := config.DB.Preload("Items").Find(&orders).Error
	return orders, err
}

// GetOrderByID mengambil data order berdasarkan ID
func GetOrderByID(id uint) (models.Order, error) {
	var order models.Order
	err := config.DB.Preload("Items").First(&order, id).Error
	return order, err
}
