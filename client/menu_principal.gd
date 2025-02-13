class_name MenuPrincipal
extends Control

signal boton_sets_pressed()

func _on_boton_sets_pressed() -> void:
	boton_sets_pressed.emit()
