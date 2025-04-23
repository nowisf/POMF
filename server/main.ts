import WebSocket from "ws";

import dataFichas from "./fichas.json";
import fichasBienvenidaJSON from "./fichasBienvenida.json";
import versionFichas from "./version.json";

import {
  inicializarBD,
  obtenerUsuarioPorID,
  obtenerUsuarioPorUsername,
  obtenerUsuarioPorCorreo,
  crearUsuario,
} from "./userModel";

import {
  inicializarTablas,
  crearSet,
  agregarFichaAUsuario,
  obtenerFichaPorNombre,
  obtenerFichasDeUsuario,
  usuarioTieneFicha,
  setTieneFicha,
  agregarSlot,
  establecerFichaSlot,
  obtenerSetPorID,
  getSlots,
  obtenerSlotPorFichaYSet,
  obtenerFichaPorID,
  fichaIsHero,
} from "./setModel";

import { db } from "./db";

const authenticatedClients = new Map<WebSocket, string>();

const port: number = 8080;

const wss: WebSocket.Server = new WebSocket.Server({ port });

console.log(`running on ws://127.0.0.1:${port}`);

inicializarBD();
inicializarTablas();

interface LoginData {
  type: "login";
  usuario: string;
  clave: string;
}

interface RegisterData {
  type: "register";
  usuario: string;
  clave: string;
  mail: string;
}

interface DatosCombate {
  nombresJugadores: string[];
  wsJugadores: WebSocket[];
  setsJugadores: any[]; // Puedes definir un tipo más específico según tus necesidades
  puestosRevelados: boolean[];
  fichasInvocadas: any[]; // Puedes definir un tipo más específico según tus necesidades
}

interface ExtendedWebSocket extends WebSocket {
  nombreUsuario: string;
}

export const entregarFicha = (userName: string, fichaName: string) => {
  const userId: number | undefined = obtenerUsuarioPorUsername(userName)?.id;

  if (!userId) {
    console.log("Usuario no encontrado. entregarFicha");
    return false;
  }

  const fichaId = obtenerFichaPorNombre(fichaName)?.id;
  if (!fichaId) {
    console.log("Ficha no registrada: " + fichaName);

    return false;
  }

  // Llamar a la función que agrega la ficha al usuario
  return agregarFichaAUsuario(userId, fichaId);
};

type MessageData = LoginData | RegisterData | { type: string }; // Agrega otros tipos si necesitas.

wss.on("connection", (ws: ExtendedWebSocket) => {
  console.log("Conexion establecida ");

  ws.on("message", (message: WebSocket.RawData) => {
    const data = JSON.parse(message.toString());

    if (data.type === "login") {
      const { usuario, clave } = data;
      console.log(
        `Credenciales recibidas - Usuario: ${usuario}, Clave: ${clave}`
      );

      const usuarioData = obtenerUsuarioPorUsername(usuario);
      if (usuarioData) {
        if (usuarioData.password === clave) {
          ws.send(JSON.stringify({ type: "login_respuesta", exito: true }));
          ws.nombreUsuario = usuario;
          authenticatedClients.set(ws, usuario);
          var idLastSetUsuario = obtenerUsuarioPorUsername(usuario)?.lastSet;
          if (idLastSetUsuario) {
            console.log(getSlots(idLastSetUsuario));
            console.log(getSlots[0]);
            getSlots(idLastSetUsuario).forEach((casillaSlot) => {
              var mensajeCambioSlot = {
                type: "slot_actualizar",
                ficha: casillaSlot.name,
                slot: casillaSlot.puesto,
              };

              console.log(casillaSlot.name);
              console.log(mensajeCambioSlot.ficha);
              ws.send(JSON.stringify(mensajeCambioSlot));
            });
          }
        } else {
          ws.send(JSON.stringify({ type: "login_respuesta", exito: false }));
        }
      } else {
        ws.send(JSON.stringify({ type: "login_respuesta", exito: false }));
      }
    } else if (data.type == "register") {
      var mensaje = {
        type: "register_respuesta",
        mailFree: true,
        userFree: true,
      };
      if (obtenerUsuarioPorCorreo(data.mail) != undefined) {
        mensaje.mailFree = false;
      }
      if (obtenerUsuarioPorUsername(data.usuario) != undefined) {
        mensaje.userFree = false;
      }
      if (mensaje.userFree && mensaje.mailFree) {
        var ultimaId = crearUsuario(
          data.usuario,
          data.clave,
          data.mail
        )?.lastInsertRowid;
        if (typeof ultimaId != "number") {
          console.log("error main crear usuario");
          return;
        }

        for (let clave in fichasBienvenidaJSON.fichasBienvenida) {
          entregarFicha(
            data.usuario,
            fichasBienvenidaJSON.fichasBienvenida[clave]
          );
        }
        console.log("Usuario " + data.usuario + " creado!");
      }
      ws.send(JSON.stringify(mensaje));
    } else if (data.type == "enviar_version") {
      if (versionFichas.version == data.version) {
        console.log("misma version. devolver ok");
        var mensajeVersionOk = {
          type: "data_actualizar",
          state: "ok",
        };
        ws.send(JSON.stringify(mensajeVersionOk));
      } else {
        var mensajeVersion = {
          type: "data_actualizar",
          fichas: dataFichas,
          version: versionFichas.version,
          state: "actualizar",
        };
        ws.send(JSON.stringify(mensajeVersion));
      }
      //verificar match de versiones, si no enviar data
    } else if (data.type == "solicitar_cambio_slot") {
      const usuario = obtenerUsuarioPorUsername(authenticatedClients.get(ws));

      const userId = usuario?.id;
      const fichaId = obtenerFichaPorNombre(data.ficha)?.id;

      const setId = usuario?.lastSet;

      if (userId && fichaId && typeof setId === "number") {
        if (usuarioTieneFicha(userId, fichaId)) {
          console.log("es heroe: " + fichaIsHero(fichaId));

          //si es heroe y el slot es 0 o no es heroe y el slot no es 0
          if (
            (fichaIsHero(fichaId) && data.slot == 0) ||
            (!fichaIsHero(fichaId) && data.slot != 0)
          ) {
            if (setTieneFicha(setId, fichaId)) {
              //reemplazar
              const puestoAReemplazar = obtenerSlotPorFichaYSet(
                setId,
                fichaId
              )?.puesto;
              if (typeof puestoAReemplazar == "number") {
                console.log("puesto a reemplazar: " + puestoAReemplazar);
                cambiarSlot(setId, puestoAReemplazar, ws, null);
              }
            }
            cambiarSlot(setId, data.slot, ws, fichaId);
          }
        }
      } else {
        console.log("error al asignar ficha a set");
      }
    } else if (data.type == "solicitar_combate") {
      //agregar usuario al matchmaking
      console.log("solicitar combate");

      // match making guarda el ws y el id del usuario
      matchMakingNoRanking(ws);

      //
    } else if (data.type == "solicitar_cancelar_busqueda_combate") {
      //sacar usuario del matchmaking
      console.log("solicitar combate cancelar");
      quitarUsuarioDeMatchMaking(ws);
      var mensajeCombateCancelado = {
        type: "combate_cancelado",
      };
      ws.send(JSON.stringify(mensajeCombateCancelado));
    } else {
      console.log("Mensaje desconocido:", data);
    }
  });

  ws.on("close", () => {
    console.log("Cliente desconectado.");
    authenticatedClients.delete(ws);
  });
});

function cambiarSlot(setId, slotTarget, ws, fichaId) {
  var ficha = obtenerFichaPorID(fichaId);
  let nombreFicha: string | null = null;

  if (ficha) {
    nombreFicha = ficha.name;
  }
  console.log(nombreFicha);
  var mensajeCambioSlot = {
    type: "slot_actualizar",
    ficha: nombreFicha,
    slot: slotTarget,
  };
  establecerFichaSlot(setId, slotTarget, fichaId);
  ws.send(JSON.stringify(mensajeCambioSlot));
}

// Definir el array con su tipo
var usuariosBuscandoCombateSinRanking: ExtendedWebSocket[] = [];

function matchMakingNoRanking(ws: ExtendedWebSocket): void {
  // si no hay usuarios en usuariosBuscandoCombateSinRanking, añadir el usuario
  if (usuariosBuscandoCombateSinRanking.length === 0) {
    usuariosBuscandoCombateSinRanking.push(ws);
  } else {
    //si hay usuarios, crear un combate
    crearCombate(usuariosBuscandoCombateSinRanking[0], ws);
    //quitar al usuario de usuariosBuscandoCombateSinRanking
    quitarUsuarioDeMatchMaking(usuariosBuscandoCombateSinRanking[0].idUsuario);
  }
}

function quitarUsuarioDeMatchMaking(ws: ExtendedWebSocket): void {
  //quitar al usuario de usuariosBuscandoCombateSinRanking
  usuariosBuscandoCombateSinRanking = usuariosBuscandoCombateSinRanking.filter(
    (usuario) => usuario !== ws
  );
}

var combates: DatosCombate[] = [];

function crearCombate(
  usuario1: ExtendedWebSocket,
  usuario2: ExtendedWebSocket
) {
  //dataCombate.ALGUNA_DATA[0/1] dependiendo el jugador
  var dataCombate: DatosCombate = {
    nombresJugadores: [usuario1.nombreUsuario, usuario2.nombreUsuario],
    wsJugadores: [usuario1, usuario2],
    setsJugadores: [],
    puestosRevelados: [],
    fichasInvocadas: [],
  };
  combates.push(dataCombate);
}

function procesarTurnoCombate() {}

function dañar() {}

/*
Pasos del combate
Inicia el turno
Se reducen los cds de las habilidades 
Si una habilidad llega a 0
Se escogeran los involucrados en el ataque (comunmente usando exposicion o heroe focus)
  ~Deberian enmarcarse o destacarse, como minimo hacer visibles los participantes de una habilidad

        
*/
