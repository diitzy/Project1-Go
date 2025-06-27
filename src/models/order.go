package models

import "gorm.io/gorm"

type Order struct {
	gorm.Model
	UserID  uint
	Name    string
	Address string
	Payment string
	Status  string `gorm:"type:varchar(20);default:'pending'" json:"Status"`
	Total   float64
	Items   []OrderItem `gorm:"foreignKey:OrderID"`
}

type OrderItem struct {
	gorm.Model
	OrderID   uint
	ProductID uint
	Name      string
	Price     float64
	Quantity  int
}
