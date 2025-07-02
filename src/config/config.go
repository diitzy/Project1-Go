package config

import (
	"fmt"
	"log"
	"os"
	"project-1/src/models"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️  Gagal memuat .env file. Menggunakan nilai default atau ENV sistem.")
	}
}

func getDSN() string {
	loadEnv()

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

func ConnectDB() {
	dsn := getDSN()
	var err error

	for i := 0; i < 5; i++ {
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
		if err == nil {
			break
		}

		log.Printf("❌ Percobaan koneksi ke database gagal (%d/5): %v", i+1, err)
		if i < 4 {
			time.Sleep(2 * time.Second)
		}
	}

	if err != nil {
		log.Fatal("❌ Gagal koneksi ke database setelah 5 percobaan:", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("❌ Gagal mendapatkan instance database:", err)
	}

	if err := sqlDB.Ping(); err != nil {
		log.Fatal("❌ Gagal ping ke database:", err)
	}

	err = DB.AutoMigrate(
		&models.Contact{},
		&models.Product{},
		&models.User{},
		&models.Order{},
		&models.OrderItem{},
	)
	if err != nil {
		log.Fatal("❌ Gagal migrasi schema:", err)
	}

	fmt.Println("✅ Database berhasil terkoneksi dan dimigrasi")
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
