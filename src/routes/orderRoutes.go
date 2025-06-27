package routes

import (
	"project-1/src/controllers"
	"project-1/src/middlewares"

	"github.com/gin-gonic/gin"
)

func OrderRoutes(router *gin.Engine) {
	router.POST("/checkout", middlewares.AuthUserMiddleware(), controllers.Checkout)

	router.GET("/admin/orders", controllers.GetAllOrdersHandler)
	router.PATCH("/admin/orders/:id/status", controllers.UpdateOrderStatusHandler)

	userGroup := router.Group("/user")
	userGroup.Use(middlewares.AuthUserMiddleware())
	userGroup.GET("/orders", controllers.GetOrdersByUserIDHandler)
}
