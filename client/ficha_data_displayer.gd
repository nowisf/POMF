extends VBoxContainer

func establecerData(data: FichaBluePrintResource):
	pass
	$HBoxContainer2/TextureRect9.texture = data.texture
	$HBoxContainer2/PanelContainer/Label.text = data.nombre
	$PanelContainer/Label.text = data.descripcion
