package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	RegisterAuthRoutes(r, db)
	RegisterCompanyRoutes(r, db)
	RegisterUserTireRoutes(r, db)
	RegisterMainTireRoutes(r, db)
	RegisterHistoryRoutes(r, db) // ✅ เพิ่มตรงนี้
}
