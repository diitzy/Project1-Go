package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Cek apakah user sudah login
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		email, err := c.Cookie("session_email")
		if err != nil || email == "" {
			c.Redirect(http.StatusFound, "/login")
			c.Abort()
			return
		}
		c.Next()
	}
}

// Cek role user
func RoleRequired(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, err := c.Cookie("session_role")
		if err != nil || userRole != role {
			c.String(http.StatusForbidden, "Akses ditolak")
			c.Abort()
			return
		}
		c.Next()
	}
}
