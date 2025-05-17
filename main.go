package main

import (
	"project-1/src/config"
	"project-1/src/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDB()

	router := gin.Default()
	routes.ViewRoute(router)

	routes.RegisterRoutes(router)

	router.Run(":8080")
}
