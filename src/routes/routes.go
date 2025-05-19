package routes

import (
	"project-1/src/controllers"
	"project-1/src/middleware"

	"github.com/gin-gonic/gin"
)

// ProductRoutes mendefinisikan semua endpoint terkait produk
func ProductRoutes(router *gin.Engine) {
	// Grup API untuk versi dan namespace
	api := router.Group("/api")
	{
		// Endpoint untuk mendapatkan semua produk
		api.GET("/products", controllers.GetProducts)

		// Endpoint untuk menambahkan produk baru
		api.POST("/products", controllers.AddProduct)
	}
}

func InitRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.POST("/register", controllers.Register) // endpoint untuk registrasi
		api.POST("/login", controllers.Login)       // endpoint login dan generate token

		// endpoint yang dilindungi oleh middleware JWT
		api.GET("/protected", middleware.AuthMiddleware(), func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "Authorized"})
		})
	}
}
