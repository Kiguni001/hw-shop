package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"hw-shop/backend/handlers"
	"hw-shop/backend/middleware"
)

func RegisterAuthRoutes(r *gin.Engine, db *gorm.DB) {
	handler := &handlers.AuthHandler{DB: db}

	group := r.Group("/auth")
	{
		group.POST("/login", handler.Login)
	}
}
