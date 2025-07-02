package services

import (
	"fmt"
	"project-1/src/config"
	"project-1/src/models"
	"time"
)

func CreateOrder(order *models.Order) error {
	tx := config.DB.Begin()

	if err := tx.Create(order).Error; err != nil {
		tx.Rollback()
		return err
	}

	for i := range order.Items {
		order.Items[i].OrderID = order.ID
		order.Items[i].Model.ID = 0
		if err := tx.Create(&order.Items[i]).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}

func GetAllOrders() ([]models.Order, error) {
	var orders []models.Order
	err := config.DB.Preload("Items").Find(&orders).Error
	return orders, err
}

func GetOrdersByDate(start, end string) ([]models.Order, error) {
	var orders []models.Order

	s, err1 := time.Parse("2006-01-02", start)
	e, err2 := time.Parse("2006-01-02", end)
	if err1 != nil || err2 != nil {
		return nil, fmt.Errorf("format tanggal salah")
	}

	e = e.Add(23*time.Hour + 59*time.Minute + 59*time.Second)

	err := config.DB.
		Preload("Items").
		Where("created_at BETWEEN ? AND ?", s, e).
		Find(&orders).
		Error
	return orders, err
}

func GetOrderByID(id uint) (models.Order, error) {
	var order models.Order
	err := config.DB.Preload("Items").First(&order, id).Error
	return order, err
}

func GetOrdersByUserID(userID uint) ([]models.Order, error) {
	var orders []models.Order
	err := config.DB.
		Preload("Items").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&orders).
		Error
	return orders, err
}

func UpdateOrderStatus(id uint, status string) error {
	return config.DB.
		Model(&models.Order{}).
		Where("id = ?", id).
		Update("status", status).
		Error
}
