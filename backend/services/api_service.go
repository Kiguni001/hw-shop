package services

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"hw-shop/backend/models"
)

// ดึงข้อมูลจาก API ตาม tcps_ub_id
func FetchTireDataFromAPI(tcpsUbID string) ([]models.UserTire, error) {
	url := "http://192.168.1.249/hongwei/api/webapp_customer/check_listcode_price"

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to call API: %v", err)
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	var allData []models.UserTire
	if err := json.Unmarshal(body, &allData); err != nil {
		return nil, fmt.Errorf("failed to unmarshal API response: %v", err)
	}

	// กรองเอาเฉพาะ row ที่ tcps_ub_id ตรงกับ user
	var filtered []models.UserTire
	for _, item := range allData {
		if item.TcpsUbID == tcpsUbID {
			item.UpdatedAt = time.Now()
			filtered = append(filtered, item)
		}
	}

	return filtered, nil
}

// เทียบข้อมูล API กับ DB
func CompareUserTire(dbData, apiData []models.UserTire) bool {
	if len(dbData) != len(apiData) {
		return false
	}
	// (Option) จะทำ deep compare ก็ได้ แต่เอาง่าย ๆ แค่จำนวนก่อน
	return true
}
