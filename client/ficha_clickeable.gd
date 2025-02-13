class_name FichaClickeableDisplay
extends NinePatchRect

signal precionado(FichaClickeable)

@export var seleccionado : bool
@export var fichaBPActual: FichaBluePrintResource

@export var fdp: PackedScene

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




func _on_button_mouse_entered() -> void:
	
	
	var new_fdp: FichaDataDisplayer = fdp.instantiate()
	new_fdp.position = global_position
	$FDPDisplayer.add_child(new_fdp)
	new_fdp.establecerData(fichaBPActual)


	if(new_fdp.position.x +new_fdp.size.x + self.size.x > get_viewport_rect().size.x):
		new_fdp.position.x -= new_fdp.size.x
	else:
		new_fdp.position.x += size.x
		
	if( new_fdp.position.y +new_fdp.size.y > get_viewport_rect().size.y):
		new_fdp.position.y -= new_fdp.position.y +new_fdp.size.y - get_viewport_rect().size.y
	$AudioStreamPlayer.play()
func _on_button_mouse_exited() -> void:
	for hijo in $FDPDisplayer.get_children():
		hijo.queue_free() 
