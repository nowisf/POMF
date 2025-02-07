class_name FichaClickeableDisplay
extends NinePatchRect

signal precionado(FichaClickeable)


@export var seleccionado : bool
@export var fichaBPActual: FichaBluePrintResource

func volverSeleccionado():
	material = preload("res://materialRainbow.tres")
func volverNoSeleccionado():
	material = null
func hacerHeroe():
	texture = preload("res://margenHeroe.png")
func hacerNoHeroe():
	texture = preload("res://margenFicha.png")

func cambiarFichaBluePrint(nuevaFBP : FichaBluePrintResource):
	fichaBPActual = nuevaFBP

	if(fichaBPActual):
		if(fichaBPActual.hero == true):
			hacerHeroe()
		else:
			hacerNoHeroe()
		$MarginContainer/TextureRect.texture = fichaBPActual.texture


func _on_button_pressed() -> void:
	precionado.emit(self)

	
