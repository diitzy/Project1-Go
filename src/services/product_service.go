package services

import (
	"project-1/src/config"
	"project-1/src/models"
)

func GetAllProducts() ([]models.Product, error) {
	var products []models.Product
	result := config.DB.Find(&products)
	return products, result.Error
}

func CreateProduct(product models.Product) (models.Product, error) {
	result := config.DB.Create(&product)
	return product, result.Error
}
