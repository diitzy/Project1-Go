package services

import (
	"errors"
	"project-1/src/config"
	"project-1/src/models"
)

// GetAllProducts - Service untuk mendapatkan semua produk (HILANG)
func GetAllProducts() ([]models.Product, error) {
	var products []models.Product
	result := config.DB.Find(&products)
	return products, result.Error
}

// GetProductByID - Service untuk mendapatkan produk berdasarkan ID (HILANG)
func GetProductByID(id uint) (models.Product, error) {
	var product models.Product
	result := config.DB.First(&product, id)
	if result.Error != nil {
		return models.Product{}, errors.New("produk tidak ditemukan")
	}
	return product, nil
}

// DeleteProduct - Service untuk menghapus produk (HILANG)
func DeleteProduct(id uint) error {
	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		return errors.New("produk tidak ditemukan")
	}
	return config.DB.Delete(&product).Error
}

// UpdateStock - Service untuk mengupdate stok produk (HILANG)
func UpdateStock(productID uint, quantityChange int) error {
	var product models.Product
	if err := config.DB.First(&product, productID).Error; err != nil {
		return errors.New("produk tidak ditemukan")
	}

	newStock := product.Stock + quantityChange
	if newStock < 0 {
		return errors.New("stok tidak mencukupi")
	}

	product.Stock = newStock
	return config.DB.Save(&product).Error
}

func CreateProduct(product models.Product) (models.Product, error) {
	// PERBAIKAN: Tambah validasi
	if product.Name == "" {
		return models.Product{}, errors.New("nama produk tidak boleh kosong")
	}
	if product.Price <= 0 {
		return models.Product{}, errors.New("harga produk harus lebih dari 0")
	}
	if product.Stock < 0 {
		return models.Product{}, errors.New("stok tidak boleh negatif")
	}

	result := config.DB.Create(&product)
	return product, result.Error
}

func UpdateProduct(id uint, productData models.Product) (models.Product, error) {
	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		return models.Product{}, errors.New("produk tidak ditemukan")
	}

	// PERBAIKAN: Tambah validasi
	if productData.Name == "" {
		return models.Product{}, errors.New("nama produk tidak boleh kosong")
	}
	if productData.Price <= 0 {
		return models.Product{}, errors.New("harga produk harus lebih dari 0")
	}
	if productData.Stock < 0 {
		return models.Product{}, errors.New("stok tidak boleh negatif")
	}

	product.Name = productData.Name
	product.Price = productData.Price
	product.Image = productData.Image
	product.Stock = productData.Stock

	if err := config.DB.Save(&product).Error; err != nil {
		return models.Product{}, err
	}
	return product, nil
}
