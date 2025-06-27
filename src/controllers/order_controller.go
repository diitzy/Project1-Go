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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(order.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tidak ada item dalam pesanan"})
		return
	}

	var total float64 = 0
	for i := range order.Items {
		total += order.Items[i].Price * float64(order.Items[i].Quantity)
		order.Items[i].ID = 0      // prevent ID collision
		order.Items[i].OrderID = 0 // will be set after Order saved
	}
	order.Total = total
	order.Status = "pending"

	fmt.Printf("RECEIVED ORDER: %+v\n", order)

	if err := services.CreateOrder(&order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order sukses"})
}

// UpdateOrderStatusHandler untuk admin mengubah status pesanan
func UpdateOrderStatusHandler(c *gin.Context) {
	// parse ID
	var id uint
	if _, err := fmt.Sscan(c.Param("id"), &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	// parse body { status: "berhasil" }
	var req struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// update
	if err := services.UpdateOrderStatus(id, req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal update status"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Status diperbarui"})
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

func GetOrdersByUserIDHandler(c *gin.Context) {
	userIDAny, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User tidak dikenali"})
		return
	}

	userID, ok := userIDAny.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Format userID tidak valid"})
		return
	}

	orders, err := services.GetOrdersByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil pesanan"})
		return
	}

	c.JSON(http.StatusOK, orders)
}
