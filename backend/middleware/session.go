package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

var Store = session.New()

func SessionMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		sess, err := Store.Get(c)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "cannot get session"})
		}
		c.Locals("session", sess)
		return c.Next()
	}
}
