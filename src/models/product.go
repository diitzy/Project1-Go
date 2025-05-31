package models

import "gorm.io/gorm"

// Product merepresentasikan data produk dalam database
type Product struct {
	gorm.Model         // PERBAIKAN: Tambah gorm.Model untuk konsistensi dengan model lain
	Name       string  `json:"name" gorm:"not null"`
	Price      float64 `json:"price" gorm:"not null"`
	Image      string  `json:"image"`
	Stock      int     `json:"stock" gorm:"default:0"`
}
