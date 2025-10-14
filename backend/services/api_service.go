package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"

	"gorm.io/gorm"
	"Kiguni001/hw-shop/models"
)

type UpdateListResponse2 struct {
    Status       string    `json:"status"`
    StatusReload string    `json:"status_reload"`
    DataList     []TireAPIJSON `json:"data_list"`
}
type TireAPI struct {
	TcpsID         string  `json:"tcps_id"`
	TcpsUbID         string  `json:"tcps_ub_id"`
	TcpsTbName       string  `json:"tcps_tb_name"`
	TcpsTbiName      string  `json:"tcps_tbi_name"`
	TcpsSidewallName string  `json:"tcps_sidewall_name"`
	TcpsPriceR13     float64 `json:"tcps_price_r13"`
	TcpsPriceR14     float64 `json:"tcps_price_r14"`
	TcpsPriceR15     float64 `json:"tcps_price_r15"`
	TcpsPriceR16     float64 `json:"tcps_price_r16"`
	TcpsPriceR17     float64 `json:"tcps_price_r17"`
	TcpsPriceR18     float64 `json:"tcps_price_r18"`
	TcpsPriceR19     float64 `json:"tcps_price_r19"`
	TcpsPriceR20     float64 `json:"tcps_price_r20"`
	TcpsPriceR21     float64 `json:"tcps_price_r21"`
	TcpsPriceR22     float64 `json:"tcps_price_r22"`
	TcpsPriceTradeIn float64 `json:"tcps_price_trade_in"`
	TcpsUpdatedAt    float64 `json:"updated_at"`
}
type TireAPIJSON struct {
	TcpsID         string  `json:"tcps_id"`
	TcpsUbID         string  `json:"tcps_ub_id"`
	TcpsTbName       string  `json:"tcps_tb_name"`
	TcpsTbiName      string  `json:"tcps_tbi_name"`
	TcpsSidewallName string  `json:"tcps_sidewall_name"`
	TcpsPriceR13     string `json:"tcps_price_r13"`
	TcpsPriceR14     string `json:"tcps_price_r14"`
	TcpsPriceR15     string `json:"tcps_price_r15"`
	TcpsPriceR16     string `json:"tcps_price_r16"`
	TcpsPriceR17     string `json:"tcps_price_r17"`
	TcpsPriceR18     string `json:"tcps_price_r18"`
	TcpsPriceR19     string `json:"tcps_price_r19"`
	TcpsPriceR20     string `json:"tcps_price_r20"`
	TcpsPriceR21     string `json:"tcps_price_r21"`
	TcpsPriceR22     string `json:"tcps_price_r22"`
	TcpsPriceTradeIn string `json:"tcps_price_trade_in"`
	TcpsUpdatedAt    string `json:"updated_at"`
}


type Updateprice struct {
    Status       string    `json:"status"`
    UpdateCount string    `json:"update_count"`
    DataList     []Data_update `json:"data_list"`
}
type Data_update struct {
	TcpsUbID         string  `json:"tcps_ub_id"`
	TcpsUpdatedAt    float64 `json:"updated_at"`
}
func strToFloat(s string) float64 {
    f, err := strconv.ParseFloat(s, 64)
    if err != nil {
        return 0
    }
    return f
}
func convertTire(jsonTire TireAPIJSON) TireAPI {
    return TireAPI{
        TcpsID:         jsonTire.TcpsID,   // ✅ ต้องเพิ่มบรรทัดนี้
        TcpsUbID:       jsonTire.TcpsUbID,
        TcpsTbName:     jsonTire.TcpsTbName,
        TcpsTbiName:    jsonTire.TcpsTbiName,
        TcpsSidewallName: jsonTire.TcpsSidewallName,
        TcpsPriceR13:     strToFloat(jsonTire.TcpsPriceR13),
        TcpsPriceR14:     strToFloat(jsonTire.TcpsPriceR14),
        TcpsPriceR15:     strToFloat(jsonTire.TcpsPriceR15),
        TcpsPriceR16:     strToFloat(jsonTire.TcpsPriceR16),
        TcpsPriceR17:     strToFloat(jsonTire.TcpsPriceR17),
        TcpsPriceR18:     strToFloat(jsonTire.TcpsPriceR18),
        TcpsPriceR19:     strToFloat(jsonTire.TcpsPriceR19),
        TcpsPriceR20:     strToFloat(jsonTire.TcpsPriceR20),
        TcpsPriceR21:     strToFloat(jsonTire.TcpsPriceR21),
        TcpsPriceR22:     strToFloat(jsonTire.TcpsPriceR22),
        TcpsPriceTradeIn: strToFloat(jsonTire.TcpsPriceTradeIn),
        TcpsUpdatedAt:    0, // แนะนำแปลงเป็น time.Time แทน float
    }
}

// ดึงข้อมูลราคาจาก API
func FetchPriceList(tcpsUbID string) ([]TireAPI, error) {

	url := "http://192.168.1.249/hongwei/api/webapp_customer/check_listcode_price"
	payload := map[string]interface{}{
		"user_id": "16",
		"data_check":       "[{}]",
		"Secure":       "4fe24f2161c9a3e0825f54e2c26706e11396ff36",
		"branch_id":       tcpsUbID,
	}
	jsonData, _ := json.Marshal(payload)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	var updated []TireAPI

	var respData UpdateListResponse2
	err2 := json.Unmarshal(body, &respData)
	if err2 != nil {
		fmt.Print("JSON Decode Error:", err2)
	}

	// ตอนนี้ DataList เป็น array แล้ว
	fmt.Println("Status:", respData.Status)
	fmt.Println("Rows:", respData.StatusReload)
	fmt.Println("Rows:", len(respData.DataList))

	if respData.Status != "success" {
		return updated, nil
	}


	if len(respData.DataList) > 0 {
    var tires []TireAPI
    for _, t := range respData.DataList {
        tires = append(tires, convertTire(t))
    }
    updated = tires
}
	return updated, nil
}



// ส่งข้อมูลแก้ไขราคาทั้งก้อนไปยัง API
func UpdatePriceList(tcpsUbID string, data []TireAPI) ([]TireAPI, error) {
	url := "http://192.168.1.249/hongwei/api/webapp_customer/update_listcode_price"
	payload := map[string]interface{}{
		"tcps_ub_id": tcpsUbID,
		"data":       data,
	}
	jsonData, _ := json.Marshal(payload)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)

	var updated []TireAPI
	if err := json.Unmarshal(body, &updated); err != nil {
		return nil, err
	}
	return updated, nil
}

// โครงสร้างข้อมูลที่ส่งไปยัง API
type SyncPayload struct {
	UserID     string      `json:"user_id"`
	DataUpdate interface{} `json:"data_update"`
	Secure     string      `json:"Secure"`
	BranchID   string      `json:"branch_id"`
}

// โครงสร้างข้อมูลที่ API ตอบกลับ
type SyncResponse struct {
	TcpsID     string `json:"tcps_id"`
	UpdatedAt  string `json:"updated_at"`
}

// ฟังก์ชันหลัก
func SyncUpdatedPrices(user models.User, db *gorm.DB) error {
	const apiURL = "http://192.168.1.249/hongwei/api/webapp_customer/update_listcode_price"
	const secureKey = "4fe24f2161c9a3e0825f54e2c26706e11396ff36"

	fmt.Println("🔍 เริ่มกระบวนการ Sync ข้อมูลราคากับ API เซิร์ฟเวอร์...")

	// 1️⃣ ดึงข้อมูลทุกแถวที่ Status = 2
	var pendingTires []models.UserTire
	if err := db.Where("status = ?", 2).Find(&pendingTires).Error; err != nil {
		return fmt.Errorf("ไม่สามารถดึงข้อมูลที่ต้องการ Sync ได้: %v", err)
	}

	if len(pendingTires) == 0 {
		fmt.Println("⚠️ ไม่มีข้อมูลสถานะ 2 สำหรับการ Sync")
		return nil
	}

	// 2️⃣ แปลงข้อมูลเป็น JSON ที่จะส่ง
	dataUpdate := []map[string]interface{}{}
	for _, t := range pendingTires {
		row := map[string]interface{}{
			"tcps_id":            t.TcpsID,
			"tcps_ub_id":         t.TcpsUbID,
			"tcps_price_r13":     fmt.Sprintf("%.0f", t.TcpsPriceR13),
			"tcps_price_r14":     fmt.Sprintf("%.0f", t.TcpsPriceR14),
			"tcps_price_r15":     fmt.Sprintf("%.0f", t.TcpsPriceR15),
			"tcps_price_r16":     fmt.Sprintf("%.0f", t.TcpsPriceR16),
			"tcps_price_r17":     fmt.Sprintf("%.0f", t.TcpsPriceR17),
			"tcps_price_r18":     fmt.Sprintf("%.0f", t.TcpsPriceR18),
			"tcps_price_r19":     fmt.Sprintf("%.0f", t.TcpsPriceR19),
			"tcps_price_r20":     fmt.Sprintf("%.0f", t.TcpsPriceR20),
			"tcps_price_r21":     fmt.Sprintf("%.0f", t.TcpsPriceR21),
			"tcps_price_r22":     fmt.Sprintf("%.0f", t.TcpsPriceR22),
			"tcps_price_trade_in": fmt.Sprintf("%.0f", t.TcpsPriceTradeIn),
		}
		dataUpdate = append(dataUpdate, row)
	}

	payload := SyncPayload{
		UserID:     fmt.Sprintf("%d", user.ID),
		DataUpdate: dataUpdate,
		Secure:     secureKey,
		BranchID:   user.TcpsUbID,
	}

	jsonData, _ := json.Marshal(payload)
	fmt.Println("📦 ข้อมูลที่กำลังส่งไปยัง API:")
	fmt.Println(string(jsonData))

	// 3️⃣ ส่งข้อมูลไปยัง API เซิร์ฟเวอร์
	resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("❌ ไม่สามารถเชื่อมต่อ API เซิร์ฟเวอร์ได้: %v", err)
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("📨 การตอบกลับจาก API เซิร์ฟเวอร์:")
	fmt.Println(string(body))

	// 4️⃣ แปลงข้อมูลตอบกลับ
	var apiResponse []SyncResponse
	if err := json.Unmarshal(body, &apiResponse); err != nil {
		return fmt.Errorf("❌ แปลงข้อมูลตอบกลับจาก API ไม่ได้: %v", err)
	}

	// 5️⃣ อัปเดตฐานข้อมูล
	for _, res := range apiResponse {
		// แปลงเวลาเป็น time.Time
		timestamp, err := time.Parse("2006-01-02 15:04:05", res.UpdatedAt)
		if err != nil {
			timestamp = time.Now()
		}

		if err := db.Model(&models.UserTire{}).
			Where("tcps_id = ?", res.TcpsID).
			Updates(map[string]interface{}{
				"updated_at": timestamp,
				"status":     1,
			}).Error; err != nil {
			fmt.Printf("⚠️ ไม่สามารถอัปเดตข้อมูลสำหรับ tcps_id %s: %v\n", res.TcpsID, err)
		} else {
			fmt.Printf("✅ อัปเดตสำเร็จ: tcps_id %s → updated_at %s\n", res.TcpsID, res.UpdatedAt)
		}
	}

	fmt.Println("🎯 การ Sync ข้อมูลกับ API เซิร์ฟเวอร์เสร็จสมบูรณ์")
	return nil
}
