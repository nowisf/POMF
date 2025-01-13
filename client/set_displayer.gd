extends VBoxContainer

@export var setActual: Set
@export var ficha_scene: PackedScene 


func setSet(nuevoSet:Set):
	setActual = nuevoSet
	clear_children()

	var ficha_nodo_heroe: FichaClickeableDisplay = ficha_scene.instantiate()  
	ficha_nodo_heroe.cambiarFichaBluePrint(setActual.fichaHeroe) 
	ficha_nodo_heroe.hacerHeroe()
	add_child(ficha_nodo_heroe)

	for ficha in setActual.get_fichas():  
		var ficha_nodo: FichaClickeableDisplay = ficha_scene.instantiate()  
		ficha_nodo.cambiarFichaBluePrint(ficha) 
		add_child(ficha_nodo)


func clear_children():
	for child in get_children():
		child.queue_free()


func _ready() -> void:
	setSet(preload("res://data/set (test)/testSet.tres"))
