class_name FichasScrolleables
extends ScrollContainer

@export var ficha_scene: PackedScene 
var seleccionado: FichaClickeableDisplay

const  RUTA_FICHAS: String = "res://data/fichasBluePrintActualizacion/"

@export var tamaño_fichas: int = 500

signal fichaSeleccionada(ficha:FichaClickeableDisplay)

func obtener_fichas() -> Array:
	var fichas = []
	var dir = DirAccess.open(RUTA_FICHAS)
	if dir:
		dir.list_dir_begin()
		var file_name = dir.get_next()
		while file_name != "":
			if file_name.ends_with(".tres"):
				#cache mode ignore 
				var recurso = ResourceLoader.load(RUTA_FICHAS + file_name, "", ResourceLoader.CACHE_MODE_IGNORE)
				if recurso is FichaBluePrintResource:
					fichas.append(recurso)
			file_name = dir.get_next()
	else:
		print("Error: No se pudo acceder a la carpeta de cartas.")
	
	return fichas

func mostrarFichas():
	print("mostrando fichas")

	for child in $VBoxContainer.get_children():
		child.queue_free()

	var fichas = obtener_fichas()
	for ficha : FichaBluePrintResource in fichas:
		var ficha_nodo: FichaClickeableDisplay = ficha_scene.instantiate()  
		ficha_nodo.precionado.connect(_on_ficha_presionada)
		ficha_nodo.cambiarFichaBluePrint(ficha) 
		print("se cambia el minimo")
		ficha_nodo.custom_minimum_size.y = tamaño_fichas
		ficha_nodo.custom_minimum_size.x = tamaño_fichas
		$VBoxContainer.add_child(ficha_nodo)
		print(ficha)


func _on_ficha_presionada(fichaClickeable:FichaClickeableDisplay):
	if seleccionado:
		if is_instance_valid(seleccionado):
			seleccionado.volverNoSeleccionado()
	seleccionado = fichaClickeable
	seleccionado.volverSeleccionado()
	fichaSeleccionada.emit(fichaClickeable)
