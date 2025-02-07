class_name DatoVersion
extends Resource

@export var version: String = "0"

func cambiarVersion(nuevaVersion:String):
	version = nuevaVersion
	guardar()

func guardar():
	ResourceSaver.save(self, self.get_path())	
