package models

import "gorm.io/gorm"

// Contact merepresentasikan data dari form kontak yang dikirim oleh pengguna.
// Struct ini otomatis memiliki kolom ID, CreatedAt, UpdatedAt, dan DeletedAt dari gorm.Model.
type Contact struct {
	gorm.Model        // Menyediakan ID, timestamps, dan soft delete
	Name       string // Nama pengirim pesan
	Email      string // Email pengirim
	Message    string // Isi pesan yang dikirim
}
