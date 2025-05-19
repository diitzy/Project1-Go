package routes

import (
	"project-1/src/controllers"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.Engine) {
	auth := router.Group("/api")
	{
		auth.POST("/login", controllers.Login)
	}
}
