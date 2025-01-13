class_name Set
extends Resource

@export var setName: String = "Nuevo Set"

@export var fichaHeroe: FichaBluePrintResource  # Ficha especial
@export var fichas: Array[FichaBluePrintResource] = []  # Arreglo fijo de fichas

const MAX_FICHAS = 8  # Total de fichas, incluyendo al héroe
@export var ficha_vacia: FichaBluePrintResource  = preload("res://data/fichasBluePrints/vacio.tres")

func replace_ficha(index: int, nueva_ficha: FichaBluePrintResource) -> bool:
	if index < 0 or index >= fichas.size():
		print("Error: Índice fuera de rango.")
		return false
	fichas[index] = nueva_ficha
	return true

func get_fichas() -> Array[FichaBluePrintResource]:
	return fichas

func is_valid_set() -> bool:
	# Verifica si el set tiene exactamente 8 fichas
	return fichaHeroe != null and fichas.size() == MAX_FICHAS - 1
