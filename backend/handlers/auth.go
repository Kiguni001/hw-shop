package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"hw-shop/backend/middleware" 
	"hw-shop/backend/models"
	

)

type AuthHandler struct {
	DB *gorm.DB
}

// login สำหรับ admin / user
func (h *AuthHandler) Login(c *gin.Context) {
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}

	// admin ตายตัว
	if input.Username == "Admin" && input.Password == "zxcv1420a" {
		token, _ := middleware.GenerateToken("Admin", "admin")
		c.JSON(http.StatusOK, gin.H{"token": token, "role": "admin"})
		return
	}

	// user จาก DB
	var user models.User
	if err := h.DB.Where("first_name = ? AND password = ?", input.Username, input.Password).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	token, _ := middleware.GenerateToken(user.FirstName, "user")
	c.JSON(http.StatusOK, gin.H{"token": token, "role": "user"})
}
