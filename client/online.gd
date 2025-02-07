class_name Online
extends Node

signal coneccion_exitosa()
signal mensaje_recibido(mensaje)
signal desconectado()

var url = "ws://127.0.0.1:8080" 

var socket = WebSocketPeer.new()

var conectado : bool = false

var ultimo_estado 
	

func _ready():
	print("iniciado modulo Online")
	socket.connect_to_url(url)

func _process(delta):
	socket.poll()
	var state = socket.get_ready_state()
	if state == WebSocketPeer.STATE_OPEN:
		
		if ultimo_estado != WebSocketPeer.STATE_OPEN:
			conectado = true
			coneccion_exitosa.emit()
			ultimo_estado = WebSocketPeer.STATE_OPEN
		
		while socket.get_available_packet_count():
			_on_data(socket.get_packet())
	elif state == WebSocketPeer.STATE_CLOSING:
		# Keep polling to achieve proper close.
		pass
	elif state == WebSocketPeer.STATE_CLOSED:
		conectado = false
		if ultimo_estado != WebSocketPeer.STATE_CLOSED:
			var code = socket.get_close_code()
			var reason = socket.get_close_reason()
			print("WebSocket closed with code: %d, reason %s. Clean: %s" % [code, reason, code != -1])
			ultimo_estado = WebSocketPeer.STATE_CLOSED
			desconectado.emit()
		else:
			#quiza deba condicionarlo con la razon en caso de que sea intencionado
			socket.connect_to_url(url)


func enviar_credenciales(usuario: String, clave: String):
	var mensaje = {
		"type": "login",
		"usuario": usuario,
		"clave": clave,
	}
	var json_mensaje = JSON.stringify(mensaje)
	socket.send_text(json_mensaje)


func intentar_registro(name, password, mail):
	var mensaje = {
		"type": "register",
		"usuario": name,
		"clave": password,
		"mail": mail
	}
	var json_mensaje = JSON.stringify(mensaje)
	socket.send_text(json_mensaje)
	

func solicitar_cambio_slot(slot: int, ficha: FichaBluePrintResource):
	var mensaje = {
		"type": "solicitar_cambio_slot",
		"slot": slot,
		"ficha": ficha.nombre
	}
	var json_mensaje = JSON.stringify(mensaje)
	socket.send_text(json_mensaje)

func _on_data(packet):
	var test_json_conv = JSON.new()
	var error = test_json_conv.parse(packet.get_string_from_utf8())
	if error == OK:
		var payload = test_json_conv.get_data()
		#hacer con switch case
		mensaje_recibido.emit(payload)
			
	else:
		print("JSON Parse Error: ", error)


func enviarVersion(version: String):
	var mensaje = {
		"type": "enviar_version",
		"version": version
	}
	var json_mensaje = JSON.stringify(mensaje)
	socket.send_text(json_mensaje)
