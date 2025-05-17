package routes

import (
	"project-1/src/controllers"

	"github.com/gin-gonic/gin"
)

// ContactRoutes mendefinisikan endpoint terkait form kontak
func ContactRoutes(router *gin.Engine) {
	router.POST("/send-message", controllers.HandleContactForm)
}
