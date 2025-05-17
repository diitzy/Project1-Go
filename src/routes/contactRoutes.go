package routes

import (
	"project-1/src/controllers"

	"github.com/gin-gonic/gin"
)

func ContactRoutes(router *gin.Engine) {
	router.POST("/send-message", controllers.HandleContactForm)
}
