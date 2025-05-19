package routes

import (
	"project-1/src/controllers"

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
