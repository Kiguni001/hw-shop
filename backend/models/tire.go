package models

import "gorm.io/gorm"

type Tire struct {
    gorm.Model
    Brand    string `json:"brand"`
    Pattern  string `json:"pattern"`
    Sidewall string `json:"sidewall"`

    Size13 int `json:"size_13"`
    Size14 int `json:"size_14"`
    Size15 int `json:"size_15"`
    Size16 int `json:"size_16"`
    Size17 int `json:"size_17"`
    Size18 int `json:"size_18"`
    Size19 int `json:"size_19"`
    Size20 int `json:"size_20"`
    Size21 int `json:"size_21"`
    Size22 int `json:"size_22"`
}
