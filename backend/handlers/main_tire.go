package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"hw-shop/backend/models"
)

type MainTireHandler struct {
	DB *gorm.DB
}

// ✅ Admin ดูข้อมูล main_tire
func (h *MainTireHandler) GetMainTires(c *gin.Context) {
	var tires []models.MainTire
	if err := h.DB.Find(&tires).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tires)
}

// ✅ Admin แก้ไข main_tire ได้อิสระ
func (h *MainTireHandler) UpdateMainTire(c *gin.Context) {
	id := c.Param("id")
	var tire models.MainTire
	if err := h.DB.First(&tire, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "tire not found"})
		return
	}

	var input models.MainTire
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}

	input.UpdatedAt = time.Now()
	if err := h.DB.Model(&tire).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "updated successfully", "data": tire})
}
