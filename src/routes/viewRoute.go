package routes

import "github.com/gin-gonic/gin"

// ViewRoute mengatur routing statis untuk halaman-halaman frontend
func ViewRoute(router *gin.Engine) {

	// Middleware untuk menonaktifkan cache pada setiap request
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Cache-Control", "no-store")
	})

	// Routing statis untuk semua file di folder ./frontend
	router.Static("/frontend", "./frontend")

	// Redirect root URL ke halaman utama (home)
	router.GET("/", func(c *gin.Context) {
		c.Redirect(302, "/home")
	})

	// Route ke file HTML spesifik
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

	router.GET("/cart", func(c *gin.Context) {
		c.File("./frontend/cart.html")
	})

	router.GET("/checkout", func(c *gin.Context) {
		c.File("./frontend/checkout.html")
	})
}
