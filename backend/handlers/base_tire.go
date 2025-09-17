package handlers

import (
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"

	"github.com/gofiber/fiber/v2"
)

// GET /api/base-tires
func GetBaseTires(c *fiber.Ctx) error {
	var baseTires []models.BaseTire
	if err := database.DB.Find(&baseTires).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot fetch base tires"})
	}
	return c.JSON(baseTires)
}

// PUT /api/base-tires (AdminOnly)
func UpdateBaseTires(c *fiber.Ctx) error {
	var updates []models.BaseTire
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	for _, u := range updates {
		var base models.BaseTire
		if err := database.DB.First(&base, u.ID).Error; err != nil {
			continue
		}

		base.Size13 = u.Size13
		base.Size14 = u.Size14
		base.Size15 = u.Size15
		base.Size16 = u.Size16
		base.Size17 = u.Size17
		base.Size18 = u.Size18
		base.Size19 = u.Size19
		base.Size20 = u.Size20
		base.Size21 = u.Size21
		base.Size22 = u.Size22

		database.DB.Save(&base)

		// Sync ราคาตั้งต้นกับ CompanyTires
		var companyTires []models.CompanyTire
		database.DB.Find(&companyTires)
		for _, ct := range companyTires {
			changed := false
			if ct.Size13 < base.Size13 { ct.Size13 = base.Size13; changed = true }
			if ct.Size14 < base.Size14 { ct.Size14 = base.Size14; changed = true }
			if ct.Size15 < base.Size15 { ct.Size15 = base.Size15; changed = true }
			if ct.Size16 < base.Size16 { ct.Size16 = base.Size16; changed = true }
			if ct.Size17 < base.Size17 { ct.Size17 = base.Size17; changed = true }
			if ct.Size18 < base.Size18 { ct.Size18 = base.Size18; changed = true }
			if ct.Size19 < base.Size19 { ct.Size19 = base.Size19; changed = true }
			if ct.Size20 < base.Size20 { ct.Size20 = base.Size20; changed = true }
			if ct.Size21 < base.Size21 { ct.Size21 = base.Size21; changed = true }
			if ct.Size22 < base.Size22 { ct.Size22 = base.Size22; changed = true }

			if changed {
				database.DB.Save(&ct)
			}
		}
	}

	return c.JSON(fiber.Map{"message": "Base tires updated successfully"})
}
