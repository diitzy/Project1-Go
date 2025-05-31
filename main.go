package main

import (
	"log"
	"project-1/src/config"
	"project-1/src/middlewares"
	"project-1/src/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Koneksi ke database
	config.ConnectDB()

	// Inisialisasi router Gin
	router := gin.Default()

	// Middleware CORS
	router.Use(middlewares.CORSMiddleware())

	// Setup routes
	routes.ViewRoutes(router)
	routes.AuthRoutes(router)
	routes.ContactRoutes(router)
	routes.ProductRoutes(router)

	// Jalankan server
	log.Println("🚀 Server berjalan di http://localhost:8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatal("❌ Gagal menjalankan server:", err)
	}
}
