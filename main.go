package main

import (
	"project-1/src/config"
	"project-1/src/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Inisialisasi koneksi ke database
	config.ConnectDB()

	// Membuat instance router default dari Gin
	router := gin.Default()

	// Daftarkan routing untuk tampilan frontend (HTML)
	routes.ViewRoutes(router)

	// Daftarkan routing untuk autentikasi
	routes.AuthRoutes(router)

	// Daftarkan routing untuk form kontak
	routes.ContactRoutes(router)

	// Daftarkan routing untuk produk
	routes.ProductRoutes(router)

	// Jalankan server pada port 8080
	router.Run(":8080")
}
