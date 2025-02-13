class_name BuilderInterface
extends Control

@onready var set_displayer : SetDisplayer = %SetDisplayer
@onready var fichas_displayer: FichasScrolleables = $PanelContainer2/Fichas

signal slot_de_set_seleccionada(slot, ficha	)


func _on_set_displayer_ficha_seleccionada(slot) -> void:
	var ficha_seleccionada: FichaClickeableDisplay = $PanelContainer2/Fichas.seleccionado
	if ($PanelContainer2/Fichas.seleccionado):
		slot_de_set_seleccionada.emit(slot, ficha_seleccionada.fichaBPActual)


func cambiar_slot(slot:int, ficha:FichaBluePrintResource):
	set_displayer.cambiarSlot(slot,ficha)
	$SonidoCambioSlot.play()


func actualizar_fichas():
	fichas_displayer.mostrarFichas()
