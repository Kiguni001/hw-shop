package models

import "gorm.io/gorm"

type UserTireRecord struct {
    gorm.Model
    TcpsUbID         string  `gorm:"column:tcps_ub_id"`
    TcpsTBName       string  `gorm:"column:tcps_tb_name"`
    TcpsTBIName      string  `gorm:"column:tcps_tbi_name"`
    TcpsSidewallName string  `gorm:"column:tcps_sidewall_name"`
    TcpsPriceR13     float64 `gorm:"column:tcps_price_r13"`
    TcpsPriceR14     float64 `gorm:"column:tcps_price_r14"`
    TcpsPriceR15     float64 `gorm:"column:tcps_price_r15"`
    TcpsPriceR16     float64 `gorm:"column:tcps_price_r16"`
    TcpsPriceR17     float64 `gorm:"column:tcps_price_r17"`
    TcpsPriceR18     float64 `gorm:"column:tcps_price_r18"`
    TcpsPriceR19     float64 `gorm:"column:tcps_price_r19"`
    TcpsPriceR20     float64 `gorm:"column:tcps_price_r20"`
    TcpsPriceR21     float64 `gorm:"column:tcps_price_r21"`
    TcpsPriceR22     float64 `gorm:"column:tcps_price_r22"`
    TcpsPriceTradeIn float64 `gorm:"column:tcps_price_trade_in"`
}
