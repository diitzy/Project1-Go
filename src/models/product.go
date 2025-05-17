package models

import "gorm.io/gorm"

// Product merepresentasikan entitas produk dalam sistem
type Product struct {
	gorm.Model         // Menyediakan field ID, CreatedAt, UpdatedAt, DeletedAt
	Name        string // Nama produk
	Description string // Deskripsi produk
	Price       int    // Harga produk
	Image       string // Path atau URL gambar produk
}
