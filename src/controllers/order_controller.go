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

	uidAny, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User tidak terautentikasi"})
		return
	}
	userID, ok := uidAny.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Format userID tidak valid"})
		return
	}
	order.UserID = userID

	grouped := make(map[uint]*models.OrderItem)
	for _, it := range order.Items {

		if ex, found := grouped[it.ProductID]; found {
			ex.Quantity += it.Quantity
		} else {
			tmp := it
			tmp.ID = 0
			tmp.OrderID = 0
			grouped[it.ProductID] = &tmp
		}
	}

	order.Items = make([]models.OrderItem, 0, len(grouped))
	for _, v := range grouped {
		order.Items = append(order.Items, *v)
	}

	var total float64
	for i := range order.Items {
		total += order.Items[i].Price * float64(order.Items[i].Quantity)
	}
	order.Total = total
	order.Status = "pending"

	fmt.Printf("CHECKOUT => %+v\n", order)

	if err := services.CreateOrder(&order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, order)
}

func UpdateOrderStatusHandler(c *gin.Context) {

	var id uint
	if _, err := fmt.Sscan(c.Param("id"), &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	var req struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := services.UpdateOrderStatus(id, req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal update status"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Status diperbarui"})
}

func GetAllOrdersHandler(c *gin.Context) {

	start := c.Query("startDate")
	end := c.Query("endDate")

	var (
		orders []models.Order
		err    error
	)
	if start != "" && end != "" {

		orders, err = services.GetOrdersByDate(start, end)
	} else {

		orders, err = services.GetAllOrders()
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal ambil pesanan"})
		return
	}
	c.JSON(http.StatusOK, orders)
}

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

	uid, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User tidak terautentikasi"})
		return
	}

	userID, ok := uid.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid userID"})
		return
	}

	orders, err := services.GetOrdersByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal ambil riwayat pesanan"})
		return
	}
	c.JSON(http.StatusOK, orders)
}
