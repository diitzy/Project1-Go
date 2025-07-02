package controllers

import (
	"net/http"
	"os"
	"path/filepath"
	"project-1/src/models"
	"project-1/src/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context) {
	products, err := services.GetAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data produk"})
		return
	}
	c.JSON(http.StatusOK, products)
}

func AddProduct(c *gin.Context) {
	var product models.Product

	product.Name = c.PostForm("name")
	priceStr := c.PostForm("price")
	stockStr := c.PostForm("stock")

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format harga tidak valid: " + err.Error()})
		return
	}
	product.Price = price

	stock, err := strconv.Atoi(stockStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format stok tidak valid: " + err.Error()})
		return
	}
	product.Stock = stock

	file, err := c.FormFile("image")
	if err == nil {

		uploadDir := "./uploads"
		if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
			if mkDirErr := os.MkdirAll(uploadDir, os.ModePerm); mkDirErr != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat direktori upload: " + mkDirErr.Error()})
				return
			}
		}

		filename := filepath.Base(file.Filename)

		filePathForDB := "/uploads/" + filename
		actualFilePath := filepath.Join(uploadDir, filename)

		if err := c.SaveUploadedFile(file, actualFilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan gambar: " + err.Error()})
			return
		}
		product.Image = filePathForDB
	} else if err != http.ErrMissingFile {

		c.JSON(http.StatusBadRequest, gin.H{"error": "Gagal memproses gambar: " + err.Error()})
		return
	}

	newProduct, errService := services.CreateProduct(product)
	if errService != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": errService.Error()})
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

func UpdateProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID produk tidak valid"})
		return
	}

	existingProduct, errService := services.GetProductByID(uint(id))
	if errService != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Produk tidak ditemukan untuk diperbarui"})
		return
	}

	existingProduct.Name = c.PostForm("name")
	priceStr := c.PostForm("price")
	stockStr := c.PostForm("stock")

	if priceStr != "" {
		price, err := strconv.ParseFloat(priceStr, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format harga tidak valid: " + err.Error()})
			return
		}
		existingProduct.Price = price
	}

	if stockStr != "" {
		stock, err := strconv.Atoi(stockStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format stok tidak valid: " + err.Error()})
			return
		}
		existingProduct.Stock = stock
	}

	file, err := c.FormFile("image")
	if err == nil {
		uploadDir := "./uploads"
		if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
			if mkDirErr := os.MkdirAll(uploadDir, os.ModePerm); mkDirErr != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat direktori upload: " + mkDirErr.Error()})
				return
			}
		}
		filename := filepath.Base(file.Filename)
		filePathForDB := "/uploads/" + filename
		actualFilePath := filepath.Join(uploadDir, filename)

		if err := c.SaveUploadedFile(file, actualFilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan gambar baru: " + err.Error()})
			return
		}
		existingProduct.Image = filePathForDB
	} else if err != http.ErrMissingFile {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gagal memproses gambar: " + err.Error()})
		return
	}

	updatedProduct, errService := services.UpdateProduct(uint(id), existingProduct)
	if errService != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui produk: " + errService.Error()})
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
