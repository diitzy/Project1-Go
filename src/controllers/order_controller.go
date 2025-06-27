package controllers

import (
	"fmt"
	"net/http"
	"project-1/src/models"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

func Checkout(c *gin.Context) {
	// 1) Bind incoming JSON
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if len(order.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tidak ada item dalam pesanan"})
		return
	}

	// 2) Attach the logged-in user
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

	// 3) **Deduplicate** order.Items by ProductID
	grouped := make(map[uint]*models.OrderItem)
	for _, it := range order.Items {
		// Each incoming `it` has ProductID now set correctly by JSON tag.
		if ex, found := grouped[it.ProductID]; found {
			ex.Quantity += it.Quantity
		} else {
			tmp := it
			tmp.ID = 0      // clear any bound ID
			tmp.OrderID = 0 // will be set by GORM
			grouped[it.ProductID] = &tmp
		}
	}
	// rebuild the slice
	order.Items = make([]models.OrderItem, 0, len(grouped))
	for _, v := range grouped {
		order.Items = append(order.Items, *v)
	}

	// 4) Compute total & set status
	var total float64
	for i := range order.Items {
		total += order.Items[i].Price * float64(order.Items[i].Quantity)
	}
	order.Total = total
	order.Status = "pending"

	fmt.Printf("CHECKOUT => %+v\n", order)

	// 5) Save it all in one go
	if err := services.CreateOrder(&order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 6) Return the created order
	c.JSON(http.StatusCreated, order)
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
// src/controllers/order_controller.go

func GetAllOrdersHandler(c *gin.Context) {
	// parse query params (format YYYY-MM-DD)
	start := c.Query("startDate")
	end := c.Query("endDate")

	var (
		orders []models.Order
		err    error
	)
	if start != "" && end != "" {
		// ambil dengan filter tanggal
		orders, err = services.GetOrdersByDate(start, end)
	} else {
		// ambil semua tanpa filter
		orders, err = services.GetAllOrders()
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal ambil pesanan"})
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

// GetOrdersByUserIDHandler untuk endpoint user melihat riwayat pesanan sendiri
func GetOrdersByUserIDHandler(c *gin.Context) {
	// Ambil userID dari context (middleware AuthUserMiddleware harusnya sudah menyimpannya)
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
