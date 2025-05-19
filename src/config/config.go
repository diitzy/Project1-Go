package config

import (
	"fmt"
	"log"
	"os"

	"project-1/src/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// DB adalah instance global dari *gorm.DB untuk koneksi database
var DB *gorm.DB

// getDSN membangun Data Source Name dari environment variable yang tersedia
func getDSN() string {
	user := getEnv("DB_USER", "root")
	pass := getEnv("DB_PASS", "")
	host := getEnv("DB_HOST", "127.0.0.1")
	port := getEnv("DB_PORT", "3306")
	name := getEnv("DB_NAME", "project1-go")

	// Format DSN sesuai dengan driver MySQL GORM
	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, pass, host, port, name,
	)
}

// ConnectDB menginisialisasi koneksi ke database dan melakukan migrasi model
func ConnectDB() {
	dsn := getDSN()
	var err error

	// Membuka koneksi ke database menggunakan DSN
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Gagal koneksi ke database:", err)
	}

	// Melakukan auto-migrasi untuk model yang dibutuhkan
	err = DB.AutoMigrate(
		&models.Contact{},
		&models.Product{},
		&models.User{},
	)
	if err != nil {
		log.Fatal("❌ Gagal migrasi schema:", err)
	}

	fmt.Println("✅ Database berhasil terkoneksi dan dimigrasi")

	// Contoh hashing password untuk kebutuhan awal
	// password := "admin123"
	// hash, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	// fmt.Println(string(hash))
	// fmt.Println("✅ Hash berhasil dibuat.")
}

// getEnv mengambil nilai dari environment variable atau menggunakan fallback default jika tidak ditemukan
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
