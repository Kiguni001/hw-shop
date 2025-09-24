package handlers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"hw-shop/backend/models"
)

type CompanyHandler struct {
	DB *gorm.DB
}

type CreateCompanyInput struct {
	Name      string `json:"name"`
	TcpsUbID  string `json:"tcps_ub_id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
	Password  string `json:"password"`
	Position  string `json:"position"`
}

// ✅ สร้างบริษัทใหม่
func (h *CompanyHandler) CreateCompany(c *gin.Context) {
	var input CreateCompanyInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}

	// --- เช็คชื่อบริษัทไม่ให้ซ้ำ ---
	var existing models.Company
	if err := h.DB.Where("name = ?", input.Name).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "company name already exists"})
		return
	}

	// --- สร้างบริษัท ---
	company := models.Company{Name: input.Name, TcpsUbID: input.TcpsUbID}
	if err := h.DB.Create(&company).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// --- สร้าง user แรกของบริษัท ---
	user := models.User{
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Phone:     input.Phone,
		Password:  input.Password,
		Position:  input.Position,
		Role:      "user",
		TcpsID:    input.TcpsUbID,
	}
	if err := h.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// --- ดึงข้อมูล user_tire จาก API ---
	apiURL := "http://192.168.1.249/hongwei/api/webapp_customer/check_listcode_price"
	resp, err := http.Get(apiURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "API request failed"})
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	var apiData []models.UserTire
	if err := json.Unmarshal(body, &apiData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse API response"})
		return
	}

	// --- filter เฉพาะ tcps_ub_id ที่ตรง ---
	var tires []models.UserTire
	for _, t := range apiData {
		if t.TcpsUbID == input.TcpsUbID {
			t.UpdatedAt = time.Now()
			tires = append(tires, t)
		}
	}
	if len(tires) > 0 {
		if err := h.DB.Create(&tires).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "company created", "company": company, "user": user})
}
