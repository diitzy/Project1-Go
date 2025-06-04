// project-1/src/middlewares/auth_middleware.go

package middlewares

import (
	"net/http"
	"project-1/src/services" // Sesuaikan path jika perlu
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5" // Pastikan Anda mengimpor jwt-go
)

// AdminMiddleware memeriksa apakah pengguna adalah admin
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Header otorisasi dibutuhkan"})
			c.Abort()
			return
		}

		// Token biasanya dikirim dengan format "Bearer <token>"
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims := &services.Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			// Ganti dengan kunci rahasia yang sama dengan di auth_service
			return []byte("kunci_rahasia_super_aman_milik_anda"), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token tidak valid"})
			c.Abort()
			return
		}

		// Periksa rolenya!
		if claims.Role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Akses ditolak. Hanya untuk admin."})
			c.Abort()
			return
		}

		c.Next() // Lanjutkan ke controller jika role adalah admin
	}
}
