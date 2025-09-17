package handlers

import (
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"

	"github.com/gofiber/fiber/v2"
)

// GET /api/tires
func GetTires(c *fiber.Ctx) error {
    var tires []models.Tire
    if err := database.DB.Find(&tires).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot fetch tires"})
    }
    return c.JSON(tires)
}


// PUT /api/tires
func UpdateTires(c *fiber.Ctx) error {
    var updates []models.Tire
    if err := c.BodyParser(&updates); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
    }

    for _, t := range updates {
        var tire models.Tire
        if err := database.DB.First(&tire, t.ID).Error; err != nil {
            continue
        }
        // อัปเดตค่าแต่ละช่องตัวเลข
        tire.Size13 = t.Size13
        tire.Size14 = t.Size14
        tire.Size15 = t.Size15
        tire.Size16 = t.Size16
        tire.Size17 = t.Size17
        tire.Size18 = t.Size18
        tire.Size19 = t.Size19
        tire.Size20 = t.Size20
        tire.Size21 = t.Size21
        tire.Size22 = t.Size22

        database.DB.Save(&tire)
    }
    return c.JSON(fiber.Map{"message": "Tires updated successfully"})
}

// POST /api/tires
func CreateTire(c *fiber.Ctx) error {
    tire := new(models.Tire)

    if err := c.BodyParser(tire); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
    }

    if err := database.DB.Create(&tire).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot create tire"})
    }

    return c.Status(fiber.StatusCreated).JSON(tire)
}
