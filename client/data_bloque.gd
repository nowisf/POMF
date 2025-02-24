class_name DataBloque
extends HBoxContainer

func setData(stat, valor):
	%nombreStatLabel.text = str(stat).to_upper()
	%valorStatLabel.text = str(valor)
