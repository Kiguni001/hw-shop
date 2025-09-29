package handlers

import (
	"time"
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"
	"Kiguni001/hw-shop/services"

	"github.com/gofiber/fiber/v2"
)

// ดึง user_tire ของ user
func GetUserTires(c *fiber.Ctx) error {
	sess, _ := Store.Get(c)
	tcpsUbID := sess.Get("tcps_ub_id").(string)

	var tires []models.UserTire
	database.DB.Where("tcps_ub_id = ?", tcpsUbID).Find(&tires)

	return c.JSON(fiber.Map{"data": tires})
}

// Update ราคาทั้งก้อน
func UpdateUserTires(c *fiber.Ctx) error {
	sess, _ := Store.Get(c)
	TcpsUbID := sess.Get("tcps_ub_id").(string)

	var input []models.UserTire
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	// ดึง main_tire ทั้งหมด
	var mainTires []models.MainTire
	database.DB.Find(&mainTires)

	// Validate และ mark
	for i, row := range input {
		for _, m := range mainTires {
						if m.TcpsTbName == row.TcpsTbName && m.TcpsTbiName == row.TcpsTbiName && m.TcpsSidewallName == row.TcpsSidewallName {
				// ตรวจสอบราคาตาม main_tire
				if row.TcpsPriceR13 < m.TcpsPriceR13 || row.TcpsPriceR13 >= 5000 {
					row.TcpsPriceR13 = -1 // ทำเครื่องหมายไม่ผ่าน validation
				}
				if row.TcpsPriceR14 < m.TcpsPriceR14 || row.TcpsPriceR14 >= 5000 {
					row.TcpsPriceR14 = -1
				}
				if row.TcpsPriceR15 < m.TcpsPriceR15 || row.TcpsPriceR15 >= 5000 {
					row.TcpsPriceR15 = -1
				}
				if row.TcpsPriceR16 < m.TcpsPriceR16 || row.TcpsPriceR16 >= 5000 {
					row.TcpsPriceR16 = -1
				}
				if row.TcpsPriceR17 < m.TcpsPriceR17 || row.TcpsPriceR17 >= 5000 {
					row.TcpsPriceR17 = -1
				}
				if row.TcpsPriceR18 < m.TcpsPriceR18 || row.TcpsPriceR18 >= 5000 {
					row.TcpsPriceR18 = -1
				}
				if row.TcpsPriceR19 < m.TcpsPriceR19 || row.TcpsPriceR19 >= 5000 {
					row.TcpsPriceR19 = -1
				}
				if row.TcpsPriceR20 < m.TcpsPriceR20 || row.TcpsPriceR20 >= 5000 {
					row.TcpsPriceR20 = -1
				}
				if row.TcpsPriceR21 < m.TcpsPriceR21 || row.TcpsPriceR21 >= 5000 {
					row.TcpsPriceR21 = -1
				}
				if row.TcpsPriceR22 < m.TcpsPriceR22 || row.TcpsPriceR22 >= 5000 {
					row.TcpsPriceR22 = -1
				}
				if row.TcpsPriceTradeIn < m.TcpsPriceTradeIn || row.TcpsPriceTradeIn >= 5000 {
					row.TcpsPriceTradeIn = -1
				}
			}
		}
		input[i] = row
	}

	// ตรวจสอบว่า validation ผ่านหรือไม่
	for _, r := range input {
		if r.TcpsPriceR13 == -1 || r.TcpsPriceR14 == -1 || r.TcpsPriceR15 == -1 || r.TcpsPriceR16 == -1 ||
			r.TcpsPriceR17 == -1 || r.TcpsPriceR18 == -1 || r.TcpsPriceR19 == -1 || r.TcpsPriceR20 == -1 ||
			r.TcpsPriceR21 == -1 || r.TcpsPriceR22 == -1 || r.TcpsPriceTradeIn == -1 {
			// mark cell ที่ไม่ผ่านเป็นสีแดงใน frontend (user จะเห็น JSON หรือ frontend จะ render)
			return c.Status(400).JSON(fiber.Map{"error": "validation failed", "data": input})
		}
	}

	// ส่งไปยัง API
	var apiData []services.TireAPI
	for _, r := range input {
		apiData = append(apiData, services.TireAPI{
			TcpsID:           r.TcpsID,
			TcpsUbID:         r.TcpsUbID,
			TcpsTbName:       r.TcpsTbName,
			TcpsTbiName:      r.TcpsTbiName,
			TcpsSidewallName: r.TcpsSidewallName,
			TcpsPriceR13:     r.TcpsPriceR13,
			TcpsPriceR14:     r.TcpsPriceR14,
			TcpsPriceR15:     r.TcpsPriceR15,
			TcpsPriceR16:     r.TcpsPriceR16,
			TcpsPriceR17:     r.TcpsPriceR17,
			TcpsPriceR18:     r.TcpsPriceR18,
			TcpsPriceR19:     r.TcpsPriceR19,
			TcpsPriceR20:     r.TcpsPriceR20,
			TcpsPriceR21:     r.TcpsPriceR21,
			TcpsPriceR22:     r.TcpsPriceR22,
			TcpsPriceTradeIn: r.TcpsPriceTradeIn,
		})
	}

	updated, err := services.UpdatePriceList(TcpsUbID, apiData)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "API update failed"})
	}

	// อัปเดตฐานข้อมูลของเรา
	for _, u := range updated {
		database.DB.Model(&models.UserTire{}).Where("tcps_id = ? AND tcps_ub_id = ? AND tcps_tb_name = ? AND tcps_tbi_name = ? AND tcps_sidewall_name = ?", u.TcpsID, u.TcpsUbID, u.TcpsTbName, u.TcpsTbiName, u.TcpsSidewallName).Updates(models.UserTire{
			TcpsPriceR13:     u.TcpsPriceR13,
			TcpsPriceR14:     u.TcpsPriceR14,
			TcpsPriceR15:     u.TcpsPriceR15,
			TcpsPriceR16:     u.TcpsPriceR16,
			TcpsPriceR17:     u.TcpsPriceR17,
			TcpsPriceR18:     u.TcpsPriceR18,
			TcpsPriceR19:     u.TcpsPriceR19,
			TcpsPriceR20:     u.TcpsPriceR20,
			TcpsPriceR21:     u.TcpsPriceR21,
			TcpsPriceR22:     u.TcpsPriceR22,
			TcpsPriceTradeIn: u.TcpsPriceTradeIn,
			UpdatedAt:        time.Now(),
		})
	}

	return c.JSON(fiber.Map{"message": "update success", "data": updated})
}

