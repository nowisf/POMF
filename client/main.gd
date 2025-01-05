extends Node

@onready var login_scene : LoginInterface = $Login
@onready var conectando_scene : Node = $Conectando
@onready var registrar_scene : RegistroInterface = $InterfaceRegistro

var actual_scene : Node

var logueado : bool = false

func _ready() -> void:

	cambiar_escena_actual(conectando_scene)


func cambiar_escena_actual(nueva_escena_actual):
	if actual_scene:
		actual_scene.hide()
	nueva_escena_actual.show()		

	actual_scene = nueva_escena_actual


func _on_online_coneccion_exitosa() -> void:
	cambiar_escena_actual(login_scene) 


func _on_login_credenciales_establecidas(username: Variant, password: Variant) -> void:
	$Online.enviar_credenciales(username,password)


func _on_login_boton_registrar_presionado() -> void:
	cambiar_escena_actual(registrar_scene)


func _on_interface_registro_datos_registro_establecidos(name: Variant, password: Variant, mail: Variant) -> void:
	$Online.intentar_registro(name, password, mail)


func _on_interface_registro_back_button_pressed() -> void:
	cambiar_escena_actual(login_scene)


func _on_online_mensaje_recibido(mensaje: Variant) -> void:
	print("Mensaje recibido:")
	if(mensaje.type == "register_respuesta"):
		if !mensaje.mailFree:
			registrar_scene.set_mail_error()
		if !mensaje.userFree:
			registrar_scene.set_user_error()
		print(mensaje)
		
	
