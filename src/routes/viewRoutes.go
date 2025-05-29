package routes

import "github.com/gin-gonic/gin"

// ViewRoutes mengatur routing statis untuk halaman-halaman frontend HTML
func ViewRoutes(router *gin.Engine) {

	// Middleware untuk menonaktifkan cache di semua response
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Cache-Control", "no-store")
	})

	// Sajikan file statis dari direktori ./frontend
	router.Static("/frontend", "./frontend")

	// [PERUBAHAN] Sajikan file gambar dari direktori ./uploads
	router.Static("/uploads", "./uploads")

	// Redirect root URL "/" ke halaman utama
	router.GET("/", func(c *gin.Context) {
		c.Redirect(302, "/home")
	})

	// Routing ke file HTML spesifik
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
	// Rute BARU untuk halaman admin
	router.GET("/admin", func(c *gin.Context) {
		c.File("./frontend/admin.html")
	})
}
