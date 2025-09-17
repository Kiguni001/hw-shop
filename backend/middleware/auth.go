package middleware

import (
    "Kiguni001/hw-shop/models"
    "github.com/gofiber/fiber/v2"
)

// AdminOnly middleware ตรวจสอบว่าผู้ใช้เป็น Admin
func AdminOnly(c *fiber.Ctx) error {
    // สมมติ user info อยู่ใน Locals หลังจาก login / JWT
    user, ok := c.Locals("user").(*models.User)
    if !ok || user.Role != "admin" {
        return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
            "error": "Only Admin can perform this action",
        })
    }
    return c.Next()
}
