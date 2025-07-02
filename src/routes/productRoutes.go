package routes

import (
	"project-1/src/controllers"
	"project-1/src/middlewares"

	"github.com/gin-gonic/gin"
)

func ProductRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{

		api.GET("/products", controllers.GetProducts)
		api.GET("/products/:id", controllers.GetProductByID)

		api.POST("/cart/add", controllers.AddToCart)
		api.POST("/cart/restore", controllers.RestoreStock)
	}
}

func ProductAdminRoutes(router *gin.Engine) {

	adminGroup := router.Group("/admin", middlewares.AdminMiddleware())
	{
		adminGroup.POST("/products", controllers.AddProduct)
		adminGroup.PUT("/products/:id", controllers.UpdateProduct)
		adminGroup.DELETE("/products/:id", controllers.DeleteProduct)
	}

}
