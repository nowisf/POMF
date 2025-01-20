extends ScrollContainer

@export var fichas: TodasLasFichas
@export var ficha_scene: PackedScene 

signal fichaSeleccionada(ficha:FichaClickeableDisplay)

func mostrarFichas():
	for ficha in fichas.get_fichas():
		var ficha_nodo: FichaClickeableDisplay = ficha_scene.instantiate()  
		ficha_nodo.precionado.connect(_on_ficha_presionada)
		ficha_nodo.cambiarFichaBluePrint(ficha) 
		ficha_nodo.custom_minimum_size.y = 500
		$VBoxContainer.add_child(ficha_nodo)

func _ready() -> void:
	mostrarFichas()
	print("fichas mostradas")
	
func _on_ficha_presionada(ficha):
	print(ficha)
	print("a")
	fichaSeleccionada.emit(ficha)
