package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type TireAPI struct {
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
}

// ดึงข้อมูลราคาจาก API
func FetchPriceList(tcpsUbID string) ([]TireAPI, error) {
	url := fmt.Sprintf("http://192.168.1.249/hongwei/api/webapp_customer/check_listcode_price?tcps_ub_id=%s", tcpsUbID)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)

	var tires []TireAPI
	if err := json.Unmarshal(body, &tires); err != nil {
		return nil, err
	}
	return tires, nil
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
