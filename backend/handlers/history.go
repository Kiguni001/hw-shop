package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"hw-shop/backend/models"
)

type HistoryHandler struct {
	DB *gorm.DB
}

// ✅ ดูประวัติทั้งหมด
func (h *HistoryHandler) GetAll(c *gin.Context) {
	var histories []models.History
	if err := h.DB.Order("created_at desc").Find(&histories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, histories)
}

// ✅ ดูประวัติของ user ตาม id
func (h *HistoryHandler) GetByUser(c *gin.Context) {
	userID := c.Param("id")

	var histories []models.History
	if err := h.DB.Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&histories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, histories)
}
