package controllers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"project-1/src/models"
	"project-1/src/services"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

const uploadDir = "./uploads/"

func GetProducts(c *gin.Context) {
	products, err := services.GetAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data produk"})
		return
	}
	c.JSON(http.StatusOK, products)
}

func AddProduct(c *gin.Context) {
	// Ambil nilai form teks
	name := c.PostForm("name")
	priceStr := c.PostForm("price")
	stockStr := c.PostForm("stock")

	// Validasi input
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nama produk tidak boleh kosong"})
		return
	}

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil || price <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format harga tidak valid atau harus lebih dari 0"})
		return
	}

	stock, err := strconv.Atoi(stockStr)
	if err != nil || stock < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format stok tidak valid atau tidak boleh negatif"})
		return
	}

	// Ambil file dari form
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File gambar tidak ditemukan: " + err.Error()})
		return
	}

	// Buat nama file unik
	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(file.Filename))
	savePath := filepath.Join(uploadDir, filename)

	// Simpan file
	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan file gambar: " + err.Error()})
		return
	}

	// Buat objek produk
	product := models.Product{
		Name:  name,
		Price: price,
		Stock: stock,
		Image: "/uploads/" + filename,
	}

	newProduct, err := services.CreateProduct(product)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, newProduct)
}

func GetProductByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID produk tidak valid"})
		return
	}

	product, err := services.GetProductByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Produk tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, product)
}

// PERBAIKAN: Update product untuk mendukung form-data
func UpdateProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID produk tidak valid"})
		return
	}

	// Ambil produk existing
	existingProduct, err := services.GetProductByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Produk tidak ditemukan"})
		return
	}

	// Ambil nilai dari form
	name := c.PostForm("name")
	priceStr := c.PostForm("price")
	stockStr := c.PostForm("stock")

	// Validasi input
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nama produk tidak boleh kosong"})
		return
	}

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil || price <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format harga tidak valid atau harus lebih dari 0"})
		return
	}

	stock, err := strconv.Atoi(stockStr)
	if err != nil || stock < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format stok tidak valid atau tidak boleh negatif"})
		return
	}

	// Update data produk
	product := models.Product{
		Name:  name,
		Price: price,
		Stock: stock,
		Image: existingProduct.Image, // Gunakan gambar lama sebagai default
	}

	// Cek apakah ada file gambar baru
	file, err := c.FormFile("image")
	if err == nil { // Jika ada file baru
		// Buat nama file unik
		filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(file.Filename))
		savePath := filepath.Join(uploadDir, filename)

		// Simpan file baru
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan file gambar: " + err.Error()})
			return
		}

		product.Image = "/uploads/" + filename
	}

	updatedProduct, err := services.UpdateProduct(uint(id), product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui produk: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedProduct)
}

func DeleteProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID produk tidak valid"})
		return
	}

	if err := services.DeleteProduct(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus produk: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Produk berhasil dihapus"})
}
