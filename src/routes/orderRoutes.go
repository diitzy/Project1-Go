package routes

import (
	"project-1/src/controllers"
	"project-1/src/middlewares"

	"github.com/gin-gonic/gin"
)

func OrderRoutes(router *gin.Engine) {
	router.POST("/checkout", controllers.Checkout)
	router.GET("/admin/orders", controllers.GetAllOrdersHandler)
	// untuk admin update status pesanan
	router.PATCH("/admin/orders/:id/status", controllers.UpdateOrderStatusHandler)

	userGroup := router.Group("/user")
	userGroup.Use(middlewares.AuthUserMiddleware()) // Tambahkan ini
	userGroup.GET("/orders", controllers.GetOrdersByUserIDHandler)
}
