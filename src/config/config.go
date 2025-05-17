package config

import (
	"fmt"
	"log"
	"os"

	"project-1/src/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := getDSN()
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = DB.AutoMigrate(&models.Product{})
	if err != nil {
		log.Fatal("Migration failed:", err)
	}
	fmt.Println("Database connected and migrated")
}

// Contoh fungsi untuk ambil dari ENV, bisa disesuaikan sesuai kebutuhanmu
func getDSN() string {
	user := getEnv("DB_USER", "root")
	pass := getEnv("DB_PASS", "")
	host := getEnv("DB_HOST", "127.0.0.1")
	port := getEnv("DB_PORT", "3306")
	name := getEnv("DB_NAME", "ecommerce")

	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, pass, host, port, name,
	)
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
