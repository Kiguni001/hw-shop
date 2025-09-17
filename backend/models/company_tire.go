package models

type CompanyTire struct {
	ID       uint `gorm:"primaryKey"` // ตรงกับ ID ของบริษัท
	CompanyID uint
	Brand    string
	Pattern  string
	Sidewall string
	Size13   int
	Size14   int
	Size15   int
	Size16   int
	Size17   int
	Size18   int
	Size19   int
	Size20   int
	Size21   int
	Size22   int
}

func (CompanyTire) TableName() string {
	return "company_tires"
}
