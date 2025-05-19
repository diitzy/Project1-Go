package routes

import (
	"project-1/src/controllers"

	"github.com/gin-gonic/gin"
)

// ContactRoutes mendefinisikan endpoint untuk pengiriman form kontak
func ContactRoutes(router *gin.Engine) {
	// Endpoint POST untuk menerima data dari form kontak dan memprosesnya
	router.POST("/send-message", controllers.HandleContactForm)
}
