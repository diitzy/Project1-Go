package routes

import (
	"project-1/src/controllers"

	"github.com/gin-gonic/gin"
)

func ContactRoutes(router *gin.Engine) {

	adminGroup := router.Group("/admin")
	{
		adminGroup.GET("/messages", controllers.GetAllMessages)
	}

	router.POST("/send-message", controllers.HandleContactForm)

	router.OPTIONS("/admin/messages", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Status(200)
	})
}
