package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"hw-shop/backend/handlers"
)

func RegisterMainTireRoutes(r *gin.Engine, db *gorm.DB) {
	handler := &handlers.MainTireHandler{DB: db}

	group := r.Group("/main_tires")
	{
		group.GET("/", handler.GetMainTires)     // Admin ดึงข้อมูล
		group.PUT("/:id", handler.UpdateMainTire) // Admin อัพเดทยาง
	}
}
