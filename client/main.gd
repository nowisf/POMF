extends Node

@onready var login_scene : LoginInterface = $Login
@onready var cargando_scene : Node = $Cargando

@onready var registrar_scene : RegistroInterface = $InterfaceRegistro
@onready var builder_scene : BuilderInterface = $Builder


var fichasObtenidas = null 
	# Al loguear solicitar fichas que se tienen
	# El servidor puede enviar las fichas denuevo si se actualizaron
	# En caso de adquerir fichas, primero se envia&recive que se compro con exito y luego se cierra el menu de comrpa
	

var actual_scene : Node

var logueado : bool = false

func _ready() -> void:

	cambiar_escena_actual(cargando_scene)


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
	match mensaje.type:
		"register_respuesta":
			if !mensaje.mailFree:
				registrar_scene.set_mail_error()
			if !mensaje.userFree:
				registrar_scene.set_user_error()
			if mensaje.userFree and mensaje.mailFree:
				cambiar_escena_actual(login_scene)
				login_scene.set_mensaje("Cuenta Creada ::)")
		"login_respuesta":
			if mensaje.exito:
				login_scene.set_mensaje("Entrando. . .")
				print("entrar")
				cambiar_escena_actual(cargando_scene)
				
			else:
				login_scene.set_mensaje("Datos invalidos")
		"secion_data":
			cambiar_escena_actual(builder_scene)
	print(mensaje)

	
