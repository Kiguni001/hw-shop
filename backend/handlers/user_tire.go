package handlers

import (
	"time"
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"
	"Kiguni001/hw-shop/services"
	"gorm.io/gorm"

	"github.com/gofiber/fiber/v2"
)

// GetUserTireByUserID ดึงเฉพาะ row ของ user ที่กำหนด
func GetUserTireByUserID(db *gorm.DB) fiber.Handler {
    return func(c *fiber.Ctx) error {
        userID := c.Query("tcps_ub_id") // ดึงค่าจาก query string

        var tires []models.UserTire
        query := db.Select([]string{
            "id", // เพิ่ม id ให้แต่ละ row
            "tcps_id",
            "tcps_ub_id",
            "tcps_tb_name",
            "tcps_tbi_name",
            "tcps_sidewall_name",
            "tcps_price_r13",
            "tcps_price_r14",
            "tcps_price_r15",
            "tcps_price_r16",
            "tcps_price_r17",
            "tcps_price_r18",
            "tcps_price_r19",
            "tcps_price_r20",
            "tcps_price_r21",
            "tcps_price_r22",
            "tcps_price_trade_in",
            "status", // ✅ เพิ่ม field status ให้ถูก select มาด้วย
        })

        // เช็คว่า userID ถูกส่งมาหรือไม่
        if userID != "" {
            query = query.Where("tcps_ub_id = ?", userID)
            println("UserID:", userID)
        }

        if err := query.Find(&tires).Error; err != nil {
            return c.Status(500).JSON(fiber.Map{"error": err.Error()})
        }

        // ✅ ตั้ง default status = 1 ถ้าเป็น 0 (หรือยังไม่ถูกกำหนด)
        for i := range tires {
            if tires[i].Status == 0 {
                tires[i].Status = 1
            }
        }

        return c.JSON(tires)
    }
}





// // ดึง user_tire ของ user
func GetUserTires(db *gorm.DB) fiber.Handler {
    return func(c *fiber.Ctx) error {
        var tires []models.UserTire
        if err := db.Select("*").Find(&tires).Error; err != nil {
            return c.Status(500).JSON(fiber.Map{"error": err.Error()})
        }
        return c.JSON(tires)
    }
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

// UpdateUserTireHandler : PUT /api/user_tire/:tcps_id
func UpdateUserTireHandler(c *fiber.Ctx) error {
    tcpsID := c.Params("tcps_id")
    if tcpsID == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "tcps_id required",
        })
    }

    var input models.UserTire
    if err := c.BodyParser(&input); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "invalid JSON",
        })
    }

    db := database.DB

    var tire models.UserTire
    if err := db.Where("tcps_id = ? AND tcps_ub_id = ?", tcpsID, input.TcpsUbID).First(&tire).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "record not found",
        })
    }

    // อัปเดต fields ที่รับมา
    db.Model(&tire).Updates(input)

    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "Update successful",
        "tcps_id": tcpsID,
    })
}

// UpdateUserTiresFromAPI รับ JSON จาก API เซิฟเวอร์
func UpdateUserTiresFromAPI(c *fiber.Ctx) error {
	var input []struct {
		TcpsID    string `json:"tcps_id"`
		UpdatedAt string `json:"updated_at"`
	}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	db := database.DB

	for _, r := range input {
		// อัปเดตเฉพาะ updated_at และ status ของ row ที่ tcps_id ตรงกัน
		db.Model(&models.UserTire{}).
			Where("tcps_id = ?", r.TcpsID).
			Updates(map[string]interface{}{
				"updated_at": r.UpdatedAt,
				"status":     1,
			})
	}

	return c.JSON(fiber.Map{
		"message": "update from API success",
		"count":   len(input),
	})
}

func SyncUserTireHandler(c *fiber.Ctx, db *gorm.DB) error {
	userID := c.Params("user_id")

	// 🔍 ดึงข้อมูลผู้ใช้จากฐานข้อมูล
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "ไม่พบผู้ใช้ที่ระบุ",
		})
	}

	// 🔁 เรียกใช้ฟังก์ชัน SyncUpdatedPrices จาก services
	if err := services.SyncUpdatedPrices(user, db); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error":  "เกิดข้อผิดพลาดระหว่าง Sync ข้อมูล",
			"detail": err.Error(),
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "✅ sync เสร็จสมบูรณ์",
	})
}