class_name BuscandoCombate
extends Control

signal busqueda_cancelada

func _on_button_pressed() -> void:
	busqueda_cancelada.emit()
