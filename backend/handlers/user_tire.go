package handlers

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"hw-shop/backend/models"
)

type UserTireHandler struct {
	DB *gorm.DB
}

// ✅ ดึงข้อมูล user_tire ของ user ตาม tcps_ub_id
func (h *UserTireHandler) GetUserTires(c *gin.Context) {
	tcpsUbID := c.Param("tcps_ub_id")
	var tires []models.UserTire
	if err := h.DB.Where("tcps_ub_id = ?", tcpsUbID).Find(&tires).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tires)
}

// ✅ อัปเดตราคาทั้งก้อน (validate ตาม main_tire + ส่ง API)
func (h *UserTireHandler) UpdateUserTires(c *gin.Context) {
	tcpsUbID := c.Param("tcps_ub_id")
var input []models.UserTire
if err := c.ShouldBindJSON(&input); err != nil {
	c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
	return
}

// filter เฉพาะ tcpsUbID ของ user
var filtered []models.UserTire
for _, t := range input {
	if t.TcpsUbID == tcpsUbID {
		filtered = append(filtered, t)
	}
}

// ใช้ filtered ต่อไป
var invalidRows []map[string]interface{}
for _, t := range filtered {
	var ref models.MainTire
	err := h.DB.Where("tcps_tb_name = ? AND tcps_tbi_name = ? AND tcps_sidewall_name = ?",
		t.TcpsTbName, t.TcpsTbiName, t.TcpsSidewallName).First(&ref).Error
	if err != nil {
		invalidRows = append(invalidRows, map[string]interface{}{
			"tire":   t,
			"reason": "reference not found",
		})
		continue
	}

		// ตรวจสอบทุกช่อง R13-R22 + trade_in
		priceFields := map[string]float64{
			"R13":       t.TcpsPriceR13,
			"R14":       t.TcpsPriceR14,
			"R15":       t.TcpsPriceR15,
			"R16":       t.TcpsPriceR16,
			"R17":       t.TcpsPriceR17,
			"R18":       t.TcpsPriceR18,
			"R19":       t.TcpsPriceR19,
			"R20":       t.TcpsPriceR20,
			"R21":       t.TcpsPriceR21,
			"R22":       t.TcpsPriceR22,
			"TradeIn":   t.TcpsPriceTradeIn,
		}
		refFields := map[string]float64{
			"R13":       ref.TcpsPriceR13,
			"R14":       ref.TcpsPriceR14,
			"R15":       ref.TcpsPriceR15,
			"R16":       ref.TcpsPriceR16,
			"R17":       ref.TcpsPriceR17,
			"R18":       ref.TcpsPriceR18,
			"R19":       ref.TcpsPriceR19,
			"R20":       ref.TcpsPriceR20,
			"R21":       ref.TcpsPriceR21,
			"R22":       ref.TcpsPriceR22,
			"TradeIn":   ref.TcpsPriceTradeIn,
		}

		for field, value := range priceFields {
			if value < refFields[field] || value >= 5000 {
				invalidRows = append(invalidRows, map[string]interface{}{
					"tire":   t,
					"field":  field,
					"reason": "invalid price",
				})
			}
		}
	}

	if len(invalidRows) > 0 {
		// ส่งกลับให้ frontend highlight สีแดง
		c.JSON(http.StatusBadRequest, gin.H{"invalid": invalidRows})
		return
	}

	// --- ส่งข้อมูลทั้งหมดไป API update ---
	apiURL := "http://192.168.1.249/hongwei/api/webapp_customer/update_listcode_price"
	jsonData, _ := json.Marshal(input)

	resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "API request failed"})
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadRequest, gin.H{"error": "API rejected", "response": string(body)})
		return
	}

	// --- API ส่งราคาล่าสุดกลับมา → update DB ---
	var updated []models.UserTire
	if err := json.Unmarshal(body, &updated); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse API response"})
		return
	}

	for _, t := range updated {
		t.UpdatedAt = time.Now()
		h.DB.Model(&models.UserTire{}).Where("id = ?", t.ID).Updates(t)
	}

	c.JSON(http.StatusOK, gin.H{"message": "updated successfully", "data": updated})
}

// ✅ Sync ตอน user เข้า Home / refresh หน้า
func (h *UserTireHandler) SyncUserTires(c *gin.Context) {
	tcpsUbID := c.Param("tcps_ub_id")

	// ดึงข้อมูลจาก API
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse API"})
		return
	}

	// filter เฉพาะ tcps_ub_id ของ user
	var filtered []models.UserTire
	for _, t := range apiData {
		if t.TcpsUbID == tcpsUbID {
			t.UpdatedAt = time.Now()
			filtered = append(filtered, t)
		}
	}

	// update DB (insert/update) ให้ตรงกับ API
for _, t := range filtered {
	h.DB.Clauses(
		clause.OnConflict{
			Columns:   []clause.Column{{Name: "tcps_tb_name"}, {Name: "tcps_tbi_name"}, {Name: "tcps_sidewall_name"}, {Name: "tcps_ub_id"}},
			UpdateAll: true,
		},
	).Create(&t)
}

	c.JSON(http.StatusOK, gin.H{"message": "sync completed"})
}
