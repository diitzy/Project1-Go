package controllers

import (
	"net/http"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

// GetProducts menangani permintaan GET untuk mengambil seluruh data produk
func GetProducts(c *gin.Context) {
	products, err := services.GetAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "❌ Gagal mengambil data produk",
		})
		return
	}

	c.JSON(http.StatusOK, products)
}

// AddProduct menangani permintaan POST untuk menambahkan produk baru
func AddProduct(c *gin.Context) {
	var product models.Product

	// Bind JSON request ke struct Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "❌ Format data tidak valid: " + err.Error(),
		})
		return
	}

	// Simpan produk baru melalui service layer
	newProduct, err := services.CreateProduct(product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "❌ Gagal menyimpan produk",
		})
		return
	}

	c.JSON(http.StatusCreated, newProduct)
}
