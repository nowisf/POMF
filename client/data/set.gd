class_name Set
extends Resource

@export var setName: String = "Nuevo Set"

@export var fichaHeroe: FichaBluePrintResource  # Ficha especial
@export var fichas: Array[FichaBluePrintResource] = []  # Arreglo fijo de fichas

@export var ficha_vacia: FichaBluePrintResource  = preload("res://data/fichasBluePrints/vacio.tres")

func get_fichas() -> Array[FichaBluePrintResource]:
	return fichas
