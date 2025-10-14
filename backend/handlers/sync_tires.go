// backend/handlers/user_tire.go
package handlers

import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
	"bytes" 

    "github.com/gofiber/fiber/v2"
    "gorm.io/gorm"
    "Kiguni001/hw-shop/models"
)

type SyncRequest struct {
    EditedRows []models.UserTire `json:"editedRows"`
}

func SyncTires(c *fiber.Ctx) error {
    db := c.Locals("db").(*gorm.DB) // assume db ถูก inject ไว้ใน middleware

    var req SyncRequest
    if err := c.BodyParser(&req); err != nil {
        return c.Status(http.StatusBadRequest).JSON(fiber.Map{
            "error": "invalid request",
        })
    }

    results := []map[string]interface{}{}

    for _, row := range req.EditedRows {
        if row.TcpsID == "" {
            continue
        }

        // 1️⃣ อัปเดต local DB
        row.UpdatedAt = time.Now()
        row.Status = 2 // รอส่ง API
        if err := db.Model(&models.UserTire{}).Where("tcps_id = ?", row.TcpsID).Updates(&row).Error; err != nil {
            results = append(results, map[string]interface{}{
                "tcps_id": row.TcpsID,
                "success": false,
                "error":   err.Error(),
            })
            continue
        }

        // 2️⃣ ส่งต่อไป API เซิร์ฟเวอร์กลาง
        payload := map[string]interface{}{
            "data_update": []map[string]interface{}{
                {
                    "tcps_id":    row.TcpsID,
                    "updated_at": row.UpdatedAt.Format(time.RFC3339),
                    "tcps_price_r13": row.TcpsPriceR13,
                    "tcps_price_r14": row.TcpsPriceR14,
                    "tcps_price_r15": row.TcpsPriceR15,
                    "tcps_price_r16": row.TcpsPriceR16,
                    "tcps_price_r17": row.TcpsPriceR17,
                    "tcps_price_r18": row.TcpsPriceR18,
                    "tcps_price_r19": row.TcpsPriceR19,
                    "tcps_price_r20": row.TcpsPriceR20,
                    "tcps_price_r21": row.TcpsPriceR21,
                    "tcps_price_r22": row.TcpsPriceR22,
                    "tcps_price_trade_in": row.TcpsPriceTradeIn,
                },
            },
        }

        jsonPayload, _ := json.Marshal(payload)
        resp, err := http.Post("http://192.168.1.249/hongwei/api/webapp_customer/update_listcode_price",
            "application/json", 
            bytes.NewBuffer(jsonPayload),
        )

        if err != nil || resp.StatusCode != http.StatusOK {
            results = append(results, map[string]interface{}{
                "tcps_id": row.TcpsID,
                "success": false,
                "error":   fmt.Sprintf("failed to sync to server, %v", err),
            })
            continue
        }

        // 3️⃣ อัปเดต status เป็น 1 = ส่งเรียบร้อย
        db.Model(&models.UserTire{}).Where("tcps_id = ?", row.TcpsID).Update("status", 1)

        results = append(results, map[string]interface{}{
            "tcps_id": row.TcpsID,
            "success": true,
        })
    }

    return c.JSON(fiber.Map{
        "results": results,
    })
}
