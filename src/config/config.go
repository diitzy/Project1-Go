package config

import (
	"fmt"
	"log"
	"os"

	"project-1/src/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// DB adalah instance global untuk koneksi database
var DB *gorm.DB

// ConnectDB bertugas untuk menghubungkan aplikasi ke database dan melakukan migrasi awal
func ConnectDB() {
	dsn := getDSN()
	var err error

	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Gagal koneksi ke database:", err)
	}

	// Migrasi model Product ke dalam schema database
	err = DB.AutoMigrate(&models.Contact{}, &models.Product{})
	if err != nil {
		log.Fatal("❌ Gagal migrasi schema:", err)
	}

	fmt.Println("✅ Database berhasil terkoneksi dan dimigrasi")
}

// getDSN membangun Data Source Name dari environment variable
func getDSN() string {
	user := getEnv("DB_USER", "root")
	pass := getEnv("DB_PASS", "")
	host := getEnv("DB_HOST", "127.0.0.1")
	port := getEnv("DB_PORT", "3306")
	name := getEnv("DB_NAME", "project1-go")

	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, pass, host, port, name,
	)
}

// getEnv mengambil nilai dari environment variable atau fallback default jika tidak ditemukan
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
