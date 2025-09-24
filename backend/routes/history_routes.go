package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"hw-shop/backend/handlers"
)

func RegisterHistoryRoutes(r *gin.Engine, db *gorm.DB) {
	handler := &handlers.HistoryHandler{DB: db}

	group := r.Group("/history")
	{
		group.GET("/", handler.GetAll)       // ดูทั้งหมด
		group.GET("/:id", handler.GetByUser) // ดูเฉพาะ user
	}
}
