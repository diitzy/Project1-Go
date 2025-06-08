package controllers

import (
	"fmt"
	"net/http"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

func Checkout(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format tidak valid"})
		return
	}

	if len(order.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tidak ada item dalam pesanan"})
		return
	}

	// Hitung total
	var total float64 = 0
	for _, item := range order.Items {
		total += item.Price * float64(item.Quantity)
	}
	order.Total = total

	err := services.CreateOrder(&order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order sukses"})
}

// TERBARU
// GetAllOrdersHandler untuk endpoint admin melihat semua order
func GetAllOrdersHandler(c *gin.Context) {
	orders, err := services.GetAllOrders()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data orders"})
		return
	}
	c.JSON(http.StatusOK, orders)
}

// GetOrderByIDHandler untuk endpoint user melihat order by ID
func GetOrderByIDHandler(c *gin.Context) {
	idParam := c.Param("id")
	var id uint
	if _, err := fmt.Sscan(idParam, &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	order, err := services.GetOrderByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, order)
}
