package handlers

import (
	"time"
	"Kiguni001/hw-shop/database"
	"Kiguni001/hw-shop/models"
	"Kiguni001/hw-shop/services"

	"github.com/gofiber/fiber/v2"
)

func CreateCompany(c *fiber.Ctx) error {
	type Input struct {
		Name       string `json:"name"`
		TcpsUbID   string `json:"tcps_ub_id"`
		Users      []struct {
			FirstName string `json:"first_name"`
			LastName  string `json:"last_name"`
			Phone     string `json:"phone"`
			Password  string `json:"password"`
			Position  string `json:"position"`
		} `json:"users"`
	}

	var input Input
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	// ตรวจชื่อบริษัทซ้ำ
	var count int64
	database.DB.Model(&models.Company{}).Where("name = ?", input.Name).Count(&count)
	if count > 0 {
		return c.Status(400).JSON(fiber.Map{"error": "company already exists"})
	}

	// สร้างบริษัท
	company := models.Company{
		Name:   input.Name,
		TcpsID: input.TcpsUbID,
	}
	database.DB.Create(&company)

	// สร้าง user
	for _, u := range input.Users {
		user := models.User{
			FirstName: u.FirstName,
			LastName:  u.LastName,
			Phone:     u.Phone,
			Password:  u.Password,
			Position:  u.Position,
			Role:      "user",
			TcpsID:    input.TcpsUbID,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		database.DB.Create(&user)
	}

	// Clone data จาก API
	apiTires, err := services.FetchPriceList(input.TcpsUbID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to fetch API data"})
	}

	for _, t := range apiTires {
		userTire := models.UserTire{
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
		database.DB.Create(&userTire)
	}

	return c.JSON(fiber.Map{"message": "company and users created"})
}
