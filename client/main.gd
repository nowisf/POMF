extends Node


@onready var login_scene : LoginInterface = $Login
@onready var cargando_scene : Node = $Cargando

@onready var registrar_scene : RegistroInterface = $InterfaceRegistro
@onready var builder_scene : BuilderInterface = $Builder

@onready var online : Online = $Online
@onready var actualizarInterface : InterfaceActualizar = $Actualizar_interface

@onready var version : DatoVersion = load("res://data/version/version.tres")

@onready var ficha_loader: FichaLoader = $FichaLoader

@onready var menu_principal: MenuPrincipal = $"MenuPrincipal"



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
	cambiar_escena_actual(actualizarInterface) 
	online.enviarVersion(version.version)


func _on_login_credenciales_establecidas(username: Variant, password: Variant) -> void:
	online.enviar_credenciales(username,password)


func _on_login_boton_registrar_presionado() -> void:
	cambiar_escena_actual(registrar_scene)


func _on_interface_registro_datos_registro_establecidos(nombre: Variant, password: Variant, mail: Variant) -> void:
	online.intentar_registro(nombre, password, mail)


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
				builder_scene.actualizar_fichas()
				cambiar_escena_actual(menu_principal)
				
			else:
				login_scene.set_mensaje("Datos invalidos")
		
		"slot_actualizar":
			builder_scene.cambiar_slot(mensaje.slot, ficha_loader.obtener_carta(mensaje.ficha))
			
		"data_actualizar":
			print("test1 main")
			if mensaje.state == "actualizar":
				print("a")
				vaciar_carpeta("res://data/fichasBluePrintActualizacion/") 
				print("a")
				print(mensaje.fichas)
				for fichaVersion in mensaje.fichas:
					var fichabp =  FichaBluePrintResource.new()
					var nueva_fichaVersion = mensaje.fichas[fichaVersion]
					print(nueva_fichaVersion)
					fichabp.hero = nueva_fichaVersion.hero	
					fichabp.nombre = nueva_fichaVersion.nombre
					fichabp.descripcion = nueva_fichaVersion.descripcion
					fichabp.texture = load( "res://ilustracionesFichas/" + nueva_fichaVersion.texture)
					
					var ruta_fichas_nuevas = "res://data/fichasBluePrintActualizacion/" + fichabp.nombre + ".tres"
					
					ResourceSaver.save(fichabp, ruta_fichas_nuevas)
					
				version.cambiarVersion(var_to_str( mensaje.version))
				get_tree().reload_current_scene()

			cambiar_escena_actual(login_scene)



func _on_builder_slot_de_set_seleccionada(slot: int, ficha: FichaBluePrintResource) -> void:
	online.solicitar_cambio_slot(slot, ficha)


func _on_online_desconectado() -> void:
	cambiar_escena_actual(cargando_scene)

func vaciar_carpeta(ruta: String) -> void:
	var dir = DirAccess.open(ruta)
	
	if dir:
		# Obtener y eliminar archivo
		print("BUEEENAAAS")
		for archivo in dir.get_files():
			var archivo_ruta = ruta + "/" + archivo
			dir.remove(archivo_ruta)
			print("Archivo eliminado:", archivo_ruta)


func _on_menu_principal_boton_sets_pressed() -> void:
	cambiar_escena_actual(builder_scene)


func _on_builder_volver_button_pressed() -> void:
	cambiar_escena_actual(menu_principal)
