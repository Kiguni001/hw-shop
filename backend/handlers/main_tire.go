package handlers

import (
	"time"
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"

	"github.com/gofiber/fiber/v2"
)

// ดึง main_tire ทั้งหมด
func GetMainTires(c *fiber.Ctx) error {
	var tires []models.MainTire
	database.DB.Find(&tires)
	return c.JSON(fiber.Map{"data": tires})
}

// สร้าง row ใหม่ใน main_tire
func CreateMainTire(c *fiber.Ctx) error {
	var input models.MainTire
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()
	database.DB.Create(&input)

	return c.JSON(fiber.Map{"message": "main_tire created", "data": input})
}

// แก้ไข row ของ main_tire
func UpdateMainTire(c *fiber.Ctx) error {
	id := c.Params("id")
	var tire models.MainTire
	if err := database.DB.First(&tire, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "not found"})
	}

	var input models.MainTire
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	input.UpdatedAt = time.Now()
	database.DB.Model(&tire).Updates(input)

	return c.JSON(fiber.Map{"message": "main_tire updated", "data": tire})
}

// ลบ row ของ main_tire
func DeleteMainTire(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.MainTire{}, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "delete failed"})
	}
	return c.JSON(fiber.Map{"message": "main_tire deleted"})
}
