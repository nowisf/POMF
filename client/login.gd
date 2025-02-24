class_name LoginInterface
extends Control


signal credenciales_establecidas(username,password)
signal boton_registrar_presionado()


func _on_login_button_pressed() -> void:
	credenciales_establecidas.emit($Panel/VBoxContainer/UsernameInput.text,$Panel/VBoxContainer/PasswordInput.text)


func _on_sign_up_button_pressed() -> void:
	boton_registrar_presionado.emit()


func set_mensaje(mensaje):
	$Panel/VBoxContainer/Panel/Mensaje.text = mensaje


func _on_hidden() -> void:
	$Panel/VBoxContainer/Panel/Mensaje.text = ""

func limpiarPassword():
	$Panel/VBoxContainer/PasswordInput.text = ""
