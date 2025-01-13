class_name RegistroInterface
extends Control

signal datos_registro_establecidos(name, password, mail)
signal back_button_pressed()

func _on_boton_registro_pressed() -> void:
	datos_registro_establecidos.emit(
		$Panel/VBoxContainer/InputUsername.text,
		$Panel/VBoxContainer/InputPassword.text,
		$Panel/VBoxContainer/InputMail.text
	)


func _on_back_button_pressed() -> void:
	back_button_pressed.emit()

func set_mail_error(text = " is Used"):
	print("akjasl")
	print($Panel/VBoxContainer/InputMail.text + text)
	$Panel/VBoxContainer/InputMail.placeholder_text = $Panel/VBoxContainer/InputMail.text + text
	$Panel/VBoxContainer/InputMail.text = ""


func set_user_error(text = " is Used"):
	$Panel/VBoxContainer/InputUsername.placeholder_text = $Panel/VBoxContainer/InputUsername.text + text
	$Panel/VBoxContainer/InputUsername.text = ""


func _on_hidden() -> void:
	print("!!")
	$Panel/VBoxContainer/InputMail.text = ""
	$Panel/VBoxContainer/InputUsername.text = ""
	$Panel/VBoxContainer/InputPassword.text = ""
	set_mail_error("")
	set_user_error("")
