package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"hw-shop/backend/handlers"
	"hw-shop/backend/middleware"
)

// routes/user_tire_routes.go
func RegisterUserTireRoutes(r *gin.Engine, db *gorm.DB) {
	handler := &handlers.UserTireHandler{DB: db}

	group := r.Group("/user_tires")
	group.Use(middleware.AuthMiddleware()) // protect route
	{
		group.GET("/:tcps_ub_id", handler.GetUserTires)
		group.PUT("/:tcps_ub_id", handler.UpdateUserTires)
		group.POST("/sync/:tcps_ub_id", handler.SyncUserTires)
	}
}
