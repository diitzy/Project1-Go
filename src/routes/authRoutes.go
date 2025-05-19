package routes

import (
	"project-1/src/controllers"

	"github.com/gin-gonic/gin"
)

// AuthRoutes mendefinisikan semua endpoint yang berkaitan dengan autentikasi
func AuthRoutes(router *gin.Engine) {
	auth := router.Group("/api") // Prefix untuk semua route autentikasi
	{
		auth.POST("/login", controllers.Login) // Endpoint untuk proses login pengguna
	}
}
