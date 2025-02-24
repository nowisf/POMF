class_name SetDisplayer
extends VBoxContainer

@export var setActual: Set
@export var ficha_scene: PackedScene 
@export var set_default: Set 

var fichas: Array[FichaClickeableDisplay] = [] 

signal fichaSeleccionada(ficha:FichaClickeableDisplay)

func cambiarSlot(slot: int, nuevaFicha: FichaBluePrintResource):
	if slot >= 0 and slot < fichas.size():
		print(fichas[slot])
		fichas[slot].cambiarFichaBluePrint(nuevaFicha)
	else:
		print("error")
func setSet(nuevoSet:Set):	
	setActual = nuevoSet
	print("test")
	print(setActual)
	print(setActual.fichaHeroe)
	clear_children()
	fichas.clear() 	
	
	var ficha_nodo_heroe: FichaClickeableDisplay = incorporarFBP()
	ficha_nodo_heroe.cambiarFichaBluePrint(setActual.fichaHeroe) 
	ficha_nodo_heroe.hacerHeroe()
	
	for ficha : FichaBluePrintResource in setActual.get_fichas():  
		var ficha_nodo = incorporarFBP()
		print(ficha.nombre)
		ficha_nodo.cambiarFichaBluePrint(ficha) 


func incorporarFBP():
	var ficha_nodo: FichaClickeableDisplay = ficha_scene.instantiate()
	ficha_nodo.precionado.connect(_on_ficha_presionada)
	add_child(ficha_nodo)
	fichas.append(ficha_nodo)
	
	return ficha_nodo


func clear_children():
	for child in get_children():
		child.queue_free()


func _ready() -> void:
	setSet(set_default)

func _on_ficha_presionada(fichaClickeable:FichaClickeableDisplay):
	fichaSeleccionada.emit(fichas.find(fichaClickeable))
