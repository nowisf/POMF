class_name BuilderInterface
extends Control

signal slot_de_set_seleccionada(slot, ficha	)

func _on_fichas_ficha_seleccionada(ficha_escena: FichaClickeableDisplay) -> void:
	print("maoma	")
	$PanelContainer3/FichaDataDisplayer.establecerData(ficha_escena.fichaBPActual)
