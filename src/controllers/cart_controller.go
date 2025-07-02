package controllers

import (
	"net/http"
	"project-1/src/services"

	"github.com/gin-gonic/gin"
)

type CartRequest struct {
	ProductID uint `json:"productId"`
	Quantity  int  `json:"quantity"`
}

func AddToCart(c *gin.Context) {
	var req CartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid"})
		return
	}

	if err := services.UpdateStock(req.ProductID, -req.Quantity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Stok berhasil diperbarui"})
}

func RestoreStock(c *gin.Context) {
	var req CartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid"})
		return
	}

	if err := services.UpdateStock(req.ProductID, req.Quantity); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Stok berhasil dikembalikan"})
}
