package controllers

import (
	"net/http"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

// GetProducts menangani permintaan GET untuk mengambil seluruh data produk dari database
func GetProducts(c *gin.Context) {
	// Mengambil semua produk melalui service layer
	products, err := services.GetAllProducts()
	if err != nil {
		// Jika gagal, kirimkan pesan kesalahan
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "❌ Gagal mengambil data produk",
		})
		return
	}

	// Kirim data produk dalam format JSON dengan status 200
	c.JSON(http.StatusOK, products)
}

// AddProduct menangani permintaan POST untuk menambahkan produk baru
func AddProduct(c *gin.Context) {
	var product models.Product

	// Bind request JSON ke struct Product dan validasi format
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

	// Kirim respons sukses dengan data produk yang baru ditambahkan
	c.JSON(http.StatusCreated, newProduct)
}
