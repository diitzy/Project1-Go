package models

import "gorm.io/gorm"

// User merepresentasikan akun pengguna dalam sistem.
// Struct ini menyimpan informasi kredensial yang dibutuhkan untuk autentikasi.
type User struct {
	gorm.Model        // Field default dari GORM: ID, CreatedAt, UpdatedAt, DeletedAt
	Email      string `gorm:"unique;not null"` // Email pengguna, harus unik dan tidak boleh kosong
	Password   string `gorm:"not null"`        // Password yang telah di-hash, tidak boleh kosong
}
