package routes

import (
	"project-1/src/controllers"

	"github.com/gin-gonic/gin"
)

// ProductRoutes mendefinisikan semua endpoint terkait produk
func ProductRoutes(router *gin.Engine) {
	// Kelompokkan route dengan prefix /api sebagai namespace versi API
	api := router.Group("/api")
	{
		// [GET] /api/products - Mengambil semua data produk
		api.GET("/products", controllers.GetProducts)

		// [POST] /api/products - Menambahkan produk baru ke database
		api.POST("/products", controllers.AddProduct)
	}
}
