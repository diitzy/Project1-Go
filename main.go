package main

import (
	"project-1/src/config"
	"project-1/src/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Menghubungkan ke database
	config.ConnectDB()

	// Melakukan migrasi otomatis pada model Product
	// config.DB.AutoMigrate(&models.Contact{})
	// config.DB.AutoMigrate(&models.Product{})
	// config.DB.AutoMigrate(&models.Contact{}, &models.Product{}, &models.User{})

	// Membuat instance default dari router Gin
	router := gin.Default()

	// Mengatur route untuk tampilan (jika ada, misal halaman HTML)
	routes.ViewRoute(router)

	// Mengatur route untuk API produk
	routes.ContactRoutes(router)
	routes.ProductRoutes(router)

	// Menjalankan server pada port 8080
	router.Run(":8080")
}
