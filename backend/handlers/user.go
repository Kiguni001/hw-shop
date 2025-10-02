package handlers

import (
	"Kiguni001/hw-shop/models"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// ดึงข้อมูลผู้ใช้ปัจจุบันจาก session
func GetCurrentUser(db *gorm.DB) fiber.Handler {
    return func(c *fiber.Ctx) error {
        // ดึง session จาก Store
//    acpsUbID := c.Params("user_ub_id")
//         print(acpsUbID)
        sess, err := Store.Get(c)
        if err != nil {
            return c.Status(500).JSON(fiber.Map{"error": "ไม่สามารถอ่าน session"})
        }

        userID := sess.Get("user_id")
        if userID == nil {
            return c.Status(401).JSON(fiber.Map{"error": "ไม่พบผู้ใช้"})
        }

        var user models.User
        if err := db.First(&user, "id = ?", userID).Error; err != nil {
            return c.Status(404).JSON(fiber.Map{"error": "ผู้ใช้ไม่พบ"})
        }

		fmt.Println("GetCurrentUser: ID =", user.ID, "FirstName =", user.FirstName, "TcpsUbID =", user.TcpsUbID)
        
		return c.JSON(user)
    }
}
func GetCurrentUserPost(db *gorm.DB) fiber.Handler {
    return func(c *fiber.Ctx) error {
        var body struct {
            TcpsUbID string `json:"tcps_ub_id"`
        }
        if err := c.BodyParser(&body); err != nil {
            return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
        }

        var user models.User
        if err := db.First(&user, "tcps_ub_id = ?", body.TcpsUbID).Error; err != nil {
            return c.Status(404).JSON(fiber.Map{"error": "ผู้ใช้ไม่พบ"})
        }

        return c.JSON(user)
    }
}

func GetCompanyByID(db *gorm.DB) fiber.Handler {
    return func(c *fiber.Ctx) error {
        tcpsUbID := c.Params("id")
        var company models.Company // สมมติมี struct Company
        if err := db.Where("tcps_ub_id = ?", tcpsUbID).First(&company).Error; err != nil {
            return c.Status(404).JSON(fiber.Map{"error": "company not found"})
        }
        return c.JSON(company)
    }
}

