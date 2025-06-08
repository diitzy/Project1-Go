package routes

import (
	"project-1/src/controllers"

	"github.com/gin-gonic/gin"
)

func OrderRoutes(router *gin.Engine) {
	router.POST("/checkout", controllers.Checkout)

	// TERBARU
	router.GET("/admin/orders", controllers.GetAllOrdersHandler)    // Untuk admin
	router.GET("/user/orders/:id", controllers.GetOrderByIDHandler) // Untuk user
}
