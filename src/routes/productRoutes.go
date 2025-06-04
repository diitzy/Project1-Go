package routes

import (
	"project-1/src/controllers"
	"project-1/src/middlewares"

	"github.com/gin-gonic/gin"
)

func ProductRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		// Rute publik
		api.GET("/products", controllers.GetProducts)
		api.GET("/products/:id", controllers.GetProductByID) // PERBAIKAN: Tambah rute get by ID

		// Rute cart - PERBAIKAN: Tambah rute cart yang hilang
		api.POST("/cart/add", controllers.AddToCart)
		api.POST("/cart/restore", controllers.RestoreStock)
	}
}

// Grup rute KHUSUS ADMIN
func ProductAdminRoutes(router *gin.Engine) {
	// Gunakan middleware admin untuk semua rute di grup ini
	adminGroup := router.Group("/admin", middlewares.AdminMiddleware())
	{
		adminGroup.POST("/products", controllers.AddProduct) // Pindah ke admin
		adminGroup.PUT("/products/:id", controllers.UpdateProduct)
		adminGroup.DELETE("/products/:id", controllers.DeleteProduct)
	}

}
