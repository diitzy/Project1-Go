package services

import (
	"golang.org/x/crypto/bcrypt"
)

// HashPassword menerima plain password dan menghasilkan hash-nya
func HashPassword(password string) (string, error) {
	// Gunakan cost 14 untuk keamanan tingkat tinggi (bisa disesuaikan)
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash membandingkan password dengan hash-nya
func CheckPasswordHash(password, hash string) bool {
	// Mengembalikan true jika password cocok dengan hash yang diberikan
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
