class_name TodasLasFichas
extends Resource

@export var fichas: Array[FichaBluePrintResource] = []  # Arreglo fijo de fichas


func get_fichas() -> Array[FichaBluePrintResource]:
	return fichas
