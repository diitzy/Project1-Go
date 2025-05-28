package routes

import (
	"project-1/src/controllers"

	"github.com/gin-gonic/gin"
)

// AuthRoutes mengatur semua rute terkait autentikasi
func AuthRoutes(router *gin.Engine) {
	auth := router.Group("/api")
	{
		auth.POST("/register", controllers.Register) // Route untuk registrasi
		auth.POST("/login", controllers.Login)       // Route untuk login
	}
}
