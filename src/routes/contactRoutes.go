package routes

import (
	"project-1/src/controllers"

	"github.com/gin-gonic/gin"
)

// ContactRoutes mendefinisikan endpoint untuk pengiriman form kontak
func ContactRoutes(router *gin.Engine) {
	// Endpoint untuk admin - mengambil semua pesan
	// Tambahkan middleware auth jika diperlukan
	adminGroup := router.Group("/admin")
	{
		adminGroup.GET("/messages", controllers.GetAllMessages)
	}

	// Endpoint public untuk mengirim pesan
	router.POST("/send-message", controllers.HandleContactForm)
	
	// Handle preflight OPTIONS request untuk CORS
	router.OPTIONS("/admin/messages", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Status(200)
	})
}