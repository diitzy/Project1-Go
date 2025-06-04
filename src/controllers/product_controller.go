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

// GetProducts - Controller untuk mendapatkan semua produk
func GetProducts(c *gin.Context) {
	products, err := services.GetAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data produk"})
		return
	}
	c.JSON(http.StatusOK, products)
}

// AddProduct - Controller untuk menambah produk
func AddProduct(c *gin.Context) {
	var product models.Product

	// Parse form fields
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

	// Handle file upload
	file, err := c.FormFile("image")
	if err == nil { // Jika ada file yang diunggah
		// Buat direktori 'uploads' jika belum ada
		uploadDir := "./uploads"
		if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
			if mkDirErr := os.MkdirAll(uploadDir, os.ModePerm); mkDirErr != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat direktori upload: " + mkDirErr.Error()})
				return
			}
		}

		// Gunakan nama file asli atau generate nama unik
		filename := filepath.Base(file.Filename) // Hindari path traversal
		// filePath := filepath.Join(uploadDir, filename) // Seharusnya seperti ini
		// Untuk sementara, agar bisa diakses dari frontend jika diserve dari root /uploads
		filePathForDB := "/uploads/" + filename
		actualFilePath := filepath.Join(uploadDir, filename)

		if err := c.SaveUploadedFile(file, actualFilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan gambar: " + err.Error()})
			return
		}
		product.Image = filePathForDB // Simpan path yang bisa diakses web
	} else if err != http.ErrMissingFile {
		// Jika ada error selain file tidak ada
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gagal memproses gambar: " + err.Error()})
		return
	}
	// Jika err == http.ErrMissingFile, product.Image akan kosong, service harus validasi jika gambar wajib

	newProduct, errService := services.CreateProduct(product)
	if errService != nil {
		// Error dari service sudah termasuk validasi model (misal nama kosong, harga <= 0)
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
		c.JSON(http.StatusNotFound, gin.H{"error": "Produk tidak ditemukan"}) // services.GetProductByID sudah mengembalikan error ini
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

	// Ambil produk yang ada dari database
	existingProduct, errService := services.GetProductByID(uint(id))
	if errService != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Produk tidak ditemukan untuk diperbarui"})
		return
	}

	// Update field dari form data
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

	// Handle file upload jika ada file baru
	file, err := c.FormFile("image")
	if err == nil { // File baru diunggah
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

		// Hapus gambar lama jika ada dan berbeda (opsional, tergantung kebutuhan)
		// if existingProduct.Image != "" && existingProduct.Image != filePathForDB {
		// 	 oldImagePath := strings.Replace(existingProduct.Image, "/uploads/", uploadDir+"/", 1)
		//	 os.Remove(oldImagePath)
		// }

		if err := c.SaveUploadedFile(file, actualFilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan gambar baru: " + err.Error()})
			return
		}
		existingProduct.Image = filePathForDB
	} else if err != http.ErrMissingFile {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gagal memproses gambar: " + err.Error()})
		return
	}
	// Jika err == http.ErrMissingFile, existingProduct.Image tidak diubah (mempertahankan gambar lama)

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

	// Opsional: Hapus file gambar terkait saat produk dihapus
	// product, err := services.GetProductByID(uint(id))
	// if err == nil && product.Image != "" {
	// 	 imagePath := strings.Replace(product.Image, "/uploads/", "./uploads/", 1)
	//	 os.Remove(imagePath)
	// }

	if err := services.DeleteProduct(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus produk: " + err.Error()}) // services.DeleteProduct sudah mengembalikan error jika tidak ditemukan
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Produk berhasil dihapus"})
}
