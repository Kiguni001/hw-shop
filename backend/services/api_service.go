package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
)

// type TireAPI2 struct {
//     TcpsID            string `json:"tcps_id"`
//     TcpsUbID          string `json:"tcps_ub_id"`
//     TcpsTbID          string `json:"tcps_tb_id"`
//     TcpsTbiID         string `json:"tcps_tbi_id"`
//     TcpsSidewall      string `json:"tcps_sidewall"`
//     TcpsTbName        string `json:"tcps_tb_name"`
//     TcpsTbiName       string `json:"tcps_tbi_name"`
//     TcpsSidewallName  string `json:"tcps_sidewall_name"`
//     TcpsPriceR13      string `json:"tcps_price_r13"`
//     TcpsPriceR14      string `json:"tcps_price_r14"`
//     TcpsPriceR15      string `json:"tcps_price_r15"`
//     TcpsPriceR16      string `json:"tcps_price_r16"`
//     TcpsPriceR17      string `json:"tcps_price_r17"`
//     TcpsPriceR18      string `json:"tcps_price_r18"`
//     TcpsPriceR19      string `json:"tcps_price_r19"`
//     TcpsPriceR20      string `json:"tcps_price_r20"`
//     TcpsPriceR21      string `json:"tcps_price_r21"`
//     TcpsPriceR22      string `json:"tcps_price_r22"`
//     TcpsPriceTradeIn  string `json:"tcps_price_trade_in"`
//     UpdatedAt         string `json:"updated_at"`
// }

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
	TcpsID         string  `json:"tcps_id"`
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
        TcpsID:         jsonTire.TcpsID,
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
	// url := fmt.Sprintf("http://192.168.1.249/hongwei/api/webapp_customer/check_listcode_price?tcps_ub_id=%s", tcpsUbID)
	// resp, err := http.Get(url)
	// if err != nil {
	// 	return nil, err
	// }
	// defer resp.Body.Close()
	// body, _ := ioutil.ReadAll(resp.Body)

	// var tires []TireAPI
	// if err := json.Unmarshal(body, &tires); err != nil {
	// 	return nil, err
	// }
	// return tires, nil


	// var results []Result

	// err := database.DB.Model(&models.Company{}).
	// 	Select("data_id, updated_at").
	// 	Where("tcps_ub_id = ?", tcpsUbID).
	// 	Find(&results).Error

	// if err != nil {
	// 	return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	// }

		





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
// fmt.Println("Raw server response:", string(body))
	

	// พิมพ์ข้อมูลที่ server ตอบกลับมา
	
	var updated []TireAPI
	// if err := json.Unmarshal(body, &updated); err != nil {
	// 	return nil, err
	// }


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


	if len(respData.DataList) > 0{

		var tiresJSON []TireAPIJSON
		json.Unmarshal(body, &tiresJSON)

		var tires []TireAPI
		for _, t := range tiresJSON {
			tires = append(tires, convertTire(t))
		}



		updated = tires;
	}


	

	

	

	// fmt.Println("Parsed response:", updated)
	return updated, nil
	// return respData.DataList, nil
	
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
