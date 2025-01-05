class_name LoginInterface
extends Control


signal credenciales_establecidas(username,password)
signal boton_registrar_presionado()


func _on_login_button_pressed() -> void:
	print("buenas tardes")
	credenciales_establecidas.emit($Panel/VBoxContainer/UsernameInput.text,$Panel/VBoxContainer/PasswordInput.text)


func _on_sign_up_button_pressed() -> void:
	boton_registrar_presionado.emit()
