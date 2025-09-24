package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"hw-shop/backend/handlers"
)

func RegisterCompanyRoutes(r *gin.Engine, db *gorm.DB) {
	handler := &handlers.CompanyHandler{DB: db}

	group := r.Group("/companies")
	{
		group.POST("/", handler.CreateCompany)
	}
}
