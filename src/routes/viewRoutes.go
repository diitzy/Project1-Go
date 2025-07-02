package routes

import "github.com/gin-gonic/gin"

func ViewRoutes(router *gin.Engine) {

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Cache-Control", "no-store")
	})

	router.Static("/frontend", "./frontend")

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

	router.GET("/login", func(c *gin.Context) {
		c.File("./frontend/login.html")
	})

	router.GET("/register", func(c *gin.Context) {
		c.File("./frontend/register.html")
	})

	router.GET("/forgot-password", func(c *gin.Context) {
		c.File("./frontend/forgot-password.html")
	})

	router.GET("/cart", func(c *gin.Context) {
		c.File("./frontend/cart.html")
	})

	router.GET("/checkout", func(c *gin.Context) {
		c.File("./frontend/checkout.html")
	})

	router.GET("/admin", func(c *gin.Context) {
		c.File("./frontend/admin.html")
	})

	router.GET("/profile", func(c *gin.Context) {
		c.File("./frontend/profile.html")
	})

}
