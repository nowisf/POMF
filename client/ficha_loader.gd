class_name FichaLoader
extends Node

const FICHAS_PATH = "res://data/fichasBluePrintActualizacion/"  # Ruta donde guardas los archivos .tres
@export var vacio: FichaBluePrintResource


func obtener_carta(nombre ) -> FichaBluePrintResource:
	if (nombre is String):
		var ruta = FICHAS_PATH + nombre + ".tres"
		
		if ResourceLoader.exists(ruta):
			print("exito")
			print(ResourceLoader.load(ruta))
			return ResourceLoader.load(ruta)
		else:
			print("La carta '%s' no existe." % nombre)
			return vacio
	else:
		return vacio
