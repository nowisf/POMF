class_name FichaDataDisplayer

extends PanelContainer

@export var data_bloque_scene: PackedScene 
var stats_a_ignorar = ["nombre", "texture", "descripcion", "hero"]

func establecerData(data: FichaBluePrintResource):
	%ImagenFicha.texture = data.texture
	%LabelNombre.text = data.nombre
	%LabelDescripcion.text = data.descripcion
	reset_size()
	show_stats(data.data)
	print(data.data)
	
func show_stats(stats: Dictionary):
	var hbc_para_par_de_stats: HBoxContainer = HBoxContainer.new()
	var contador = 0
	
	for key in stats.keys():
		if key in stats_a_ignorar:
			continue
			
		var dataBloque: DataBloque = data_bloque_scene.instantiate()
		dataBloque.setData(key, stats[key])  
		hbc_para_par_de_stats.add_child(dataBloque)
		contador += 1
		
		if contador == 1:
			dataBloque.set_h_size_flags( SizeFlags.SIZE_SHRINK_BEGIN) 

		
		if contador == 2:
			#dataBloque.set_h_size_flags( SizeFlags.SIZE_SHRINK_CENTER) 
			%VBoxContainer.add_child(hbc_para_par_de_stats)
			hbc_para_par_de_stats = HBoxContainer.new()
			contador = 0
	if contador > 0:
		%VBoxContainer.add_child(hbc_para_par_de_stats)
