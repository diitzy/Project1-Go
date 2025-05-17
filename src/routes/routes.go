package routes

import (
	"project-1/src/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/products", controllers.GetProducts)
		api.POST("/products", controllers.AddProduct)
	}
}
