class_name BuilderInterface
extends Control

@onready var set_displayer : SetDisplayer = %SetDisplayer
@onready var fichas_displayer: FichasScrolleables = %Fichas

signal slot_de_set_seleccionada(slot, ficha	)

func _on_fichas_ficha_seleccionada(ficha_escena: FichaClickeableDisplay) -> void:
	$PanelContainer3/FichaDataDisplayer.establecerData(ficha_escena.fichaBPActual)
	print(ficha_escena.fichaBPActual.hero)


func _on_set_displayer_ficha_seleccionada(slot) -> void:
	var ficha_seleccionada: FichaClickeableDisplay = $PanelContainer2/Fichas.seleccionado
	if ($PanelContainer2/Fichas.seleccionado):
		slot_de_set_seleccionada.emit(slot, ficha_seleccionada.fichaBPActual)


func cambiar_slot(slot:int, ficha:FichaBluePrintResource):
	set_displayer.cambiarSlot(slot,ficha)


func actualizar_fichas():
	fichas_displayer.mostrarFichas()
