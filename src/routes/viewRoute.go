package routes

import "github.com/gin-gonic/gin"

func ViewRoute(router *gin.Engine) {

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Cache-Control", "no-store")
	})

	//Static route from public
	router.Static("/frontend", "./frontend")

	//redirect route to login page
	router.GET("/", func(c *gin.Context) {
		c.Redirect(302, "/home")
	})

	router.GET("/home", func(c *gin.Context) {
		c.File("./frontend/index.html")
	})

	router.GET("/about", func(c *gin.Context) {
		c.File("./frontend/about.html")
	})

	router.GET("/contact", func(c *gin.Context) {
		c.File("./frontend/contact.html")
	})

	router.GET("/shop", func(c *gin.Context) {
		c.File("./frontend/shop.html")
	})
}
