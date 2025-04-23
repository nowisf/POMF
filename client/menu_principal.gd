class_name MenuPrincipal
extends Control

signal boton_sets_pressed()
signal boton_batallar_pressed()

func _on_boton_sets_pressed() -> void:
	boton_sets_pressed.emit()


func _on_boton_batallar_pressed() -> void:
	boton_batallar_pressed.emit()
