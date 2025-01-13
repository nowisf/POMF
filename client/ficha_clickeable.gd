class_name FichaClickeableDisplay
extends NinePatchRect

signal precionado(FichaClickeable)

@export var seleccionado : bool
@export var fichaBPActual: FichaBluePrintResource


func hacerHeroe():
	texture = preload("res://margenHeroe.png")


func cambiarFichaBluePrint(nuevaFBP : FichaBluePrintResource):
	fichaBPActual = nuevaFBP
	$MarginContainer/TextureRect.texture = fichaBPActual.texture


func _on_button_pressed() -> void:
	precionado.emit(self)
	
