package services

import (
	"project-1/src/config"
	"project-1/src/models"
)

// GetAllProducts mengambil semua data produk dari database
func GetAllProducts() ([]models.Product, error) {
	var products []models.Product
	result := config.DB.Find(&products)
	return products, result.Error
}

// CreateProduct menyimpan data produk baru ke dalam database
func CreateProduct(product models.Product) (models.Product, error) {
	result := config.DB.Create(&product)
	return product, result.Error
}
