package controllers

import (
	"net/http"
	"project-1/src/models"
	"project-1/src/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	var order models.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak valid"})
		return
	}

	if err := services.CreateOrder(&order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat pesanan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pesanan berhasil dibuat"})
}

func GetUserOrders(c *gin.Context) {
	userIdStr := c.Query("userId")
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID user tidak valid"})
		return
	}

	orders, err := services.GetOrdersByUser(uint(userId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data pesanan"})
		return
	}

	c.JSON(http.StatusOK, orders)
}
