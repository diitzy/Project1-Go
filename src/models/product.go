package models

import "gorm.io/gorm"

// Product merepresentasikan entitas produk dalam sistem.
// Struct ini digunakan untuk menyimpan dan mengambil data produk dari database.
type Product struct {
	gorm.Model         // Menyediakan field ID, CreatedAt, UpdatedAt, DeletedAt secara otomatis
	Name        string // Nama produk yang ditampilkan kepada pengguna
	Description string // Deskripsi rinci mengenai produk
	Price       int    // Harga produk dalam satuan rupiah
	Image       string // Path lokal atau URL gambar produk
}
