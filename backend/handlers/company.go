package handlers

import (
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"

	"github.com/gofiber/fiber/v2"
)

// CreateCompany - เพิ่มบริษัทใหม่
func CreateCompany(c *fiber.Ctx) error {
	var company models.Company

	if err := c.BodyParser(&company); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "ไม่สามารถอ่านข้อมูลได้",
		})
	}

	if result := database.DB.Create(&company); result.Error != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "ไม่สามารถสร้างบริษัทได้",
		})
	}

	return c.Status(201).JSON(company)
}

// GetCompanies - ดึงข้อมูลบริษัททั้งหมด
func GetCompanies(c *fiber.Ctx) error {
	var companies []models.Company

	if result := database.DB.Find(&companies); result.Error != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "ไม่สามารถดึงข้อมูลบริษัทได้",
		})
	}

	return c.JSON(companies)
}
