package main

import (
	"project-1/src/config"
	"project-1/src/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Menghubungkan ke database
	config.ConnectDB()

	// Membuat instance default dari router Gin
	router := gin.Default()

	// Mengatur route untuk tampilan (jika ada, misal halaman HTML)
	routes.ViewRoute(router)

	// Mengatur route untuk API produk
	routes.AuthRoutes(router)
	routes.ContactRoutes(router)
	routes.ProductRoutes(router)

	// Menjalankan server pada port 8080
	router.Run(":8080")
}
