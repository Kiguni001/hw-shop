package handlers

import (
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"
	"Kiguni001/hw-shop/services"
	"time"

	"github.com/gofiber/fiber/v2"
)

// Sync user_tire ของ user กับ API ทุกครั้งหน้า Home/Refresh
func SyncUserTires(c *fiber.Ctx) error {
	sess, _ := Store.Get(c)
	tcpsUbID := sess.Get("tcps_ub_id").(string)

	// ดึงข้อมูลจาก API
	apiTires, err := services.FetchPriceList(tcpsUbID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to fetch API"})
	}

	for _, t := range apiTires {
		var userTire models.UserTire
		err := database.DB.Where("tcps_id = ? AND tcps_ub_id = ? AND tcps_tb_name = ? AND tcps_tbi_name = ? AND tcps_sidewall_name = ?", 
			t.TcpsID, t.TcpsUbID, t.TcpsTbName, t.TcpsTbiName, t.TcpsSidewallName).First(&userTire).Error

		if err != nil {
			// ถ้าไม่มี row ให้สร้างใหม่
			newRow := models.UserTire{
				TcpsID:           t.TcpsID,
				TcpsUbID:         t.TcpsUbID,
				TcpsTbName:       t.TcpsTbName,
				TcpsTbiName:      t.TcpsTbiName,
				TcpsSidewallName: t.TcpsSidewallName,
				TcpsPriceR13:     t.TcpsPriceR13,
				TcpsPriceR14:     t.TcpsPriceR14,
				TcpsPriceR15:     t.TcpsPriceR15,
				TcpsPriceR16:     t.TcpsPriceR16,
				TcpsPriceR17:     t.TcpsPriceR17,
				TcpsPriceR18:     t.TcpsPriceR18,
				TcpsPriceR19:     t.TcpsPriceR19,
				TcpsPriceR20:     t.TcpsPriceR20,
				TcpsPriceR21:     t.TcpsPriceR21,
				TcpsPriceR22:     t.TcpsPriceR22,
				TcpsPriceTradeIn: t.TcpsPriceTradeIn,
				UpdatedAt:        time.Now(),
			}
			database.DB.Create(&newRow)
		} else {
			// อัปเดตทุก field ให้ตรงกับ API
			database.DB.Model(&userTire).Updates(models.UserTire{
				TcpsPriceR13:     t.TcpsPriceR13,
				TcpsPriceR14:     t.TcpsPriceR14,
				TcpsPriceR15:     t.TcpsPriceR15,
				TcpsPriceR16:     t.TcpsPriceR16,
				TcpsPriceR17:     t.TcpsPriceR17,
				TcpsPriceR18:     t.TcpsPriceR18,
				TcpsPriceR19:     t.TcpsPriceR19,
				TcpsPriceR20:     t.TcpsPriceR20,
				TcpsPriceR21:     t.TcpsPriceR21,
				TcpsPriceR22:     t.TcpsPriceR22,
				TcpsPriceTradeIn: t.TcpsPriceTradeIn,
				UpdatedAt:        time.Now(),
			})
		}
	}

	// Return updated user_tire
	var tires []models.UserTire
	database.DB.Where("tcps_ub_id = ?", tcpsUbID).Find(&tires)

	return c.JSON(fiber.Map{"data": tires})
}
