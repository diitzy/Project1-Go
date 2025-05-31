package services

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt" // Import bcrypt
)

var jwtKey = []byte("kunci_rahasia_super_aman_milik_anda")

// PERBAIKAN: Gunakan jwt.RegisteredClaims instead of jwt.StandardClaims
type Claims struct {
	Email                string `json:"email"`
	Role                 string `json:"role"`
	jwt.RegisteredClaims        // Mengganti jwt.StandardClaims
}

// HashPassword mengenkripsi password menggunakan bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// GenerateToken membuat token JWT baru untuk pengguna
func GenerateToken(email string, role string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)

	claims := &Claims{
		Email: email,
		Role:  role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime), // Perbaikan format
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}
