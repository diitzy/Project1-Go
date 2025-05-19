package services

import (
	"project-1/src/config"
	"project-1/src/models"
)

// GetAllProducts mengambil semua data produk dari database dan mengembalikannya
func GetAllProducts() ([]models.Product, error) {
	var products []models.Product
	result := config.DB.Find(&products)
	return products, result.Error
}

// CreateProduct menyimpan data produk baru ke dalam database
// Menerima data produk sebagai input dan mengembalikannya beserta error jika ada
func CreateProduct(product models.Product) (models.Product, error) {
	result := config.DB.Create(&product)
	return product, result.Error
}
