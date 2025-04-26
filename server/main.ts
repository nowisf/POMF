import WebSocket from "ws";

import dataFichas from "./data/fichas.json";
import versionFichas from "./version.json";

import { manejadoresMensajesCombate } from "./sockets/combateSocket";
import { entregarFicha } from "./coleccionService";

import { manejadoresMensajesAuth } from "./sockets/authSocket";

import { ExtendedWebSocket, DatosCombate } from "./types";
import {
  inicializarBD,
  obtenerUsuarioPorID,
  obtenerUsuarioPorUsername,
  obtenerUsuarioPorCorreo,
  crearUsuario,
} from "./models/userModel";

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
} from "./models/setModel";

import { db } from "./db";

const authenticatedClients = new Map<WebSocket, string>();

const port: number = 8080;

const wss: WebSocket.Server = new WebSocket.Server({ port });

console.log(`running on ws://127.0.0.1:${port}`);

inicializarBD();
inicializarTablas();

wss.on("connection", (ws: ExtendedWebSocket) => {
  console.log("Conexion establecida ");

  ws.on("message", (message: WebSocket.RawData) => {
    const data = JSON.parse(message.toString());

    if (manejadoresMensajesAuth[data.type]) {
      const manejador = manejadoresMensajesAuth[data.type];
      manejador(ws, data);
      return;
    }

    if (data.type == "enviar_version") {
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
      const userId = ws.id;
      const fichaId = obtenerFichaPorNombre(data.ficha)?.id;

      const setId = ws.lastSet;

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
  });
});

function cambiarSlot(setId, slotTarget, ws, fichaId) {
  var ficha = obtenerFichaPorID(fichaId);
  let nombreFicha: string | null = null;

  if (ficha) {
    nombreFicha = ficha.name;
  }
  var mensajeCambioSlot = {
    type: "slot_actualizar",
    ficha: nombreFicha,
    slot: slotTarget,
  };
  establecerFichaSlot(setId, slotTarget, fichaId);
  ws.send(JSON.stringify(mensajeCambioSlot));
}

var usuariosBuscandoCombateSinRanking: ExtendedWebSocket[] = [];

function matchMakingNoRanking(ws: ExtendedWebSocket): void {
  // si no hay usuarios en usuariosBuscandoCombateSinRanking, añadir el usuario
  if (usuariosBuscandoCombateSinRanking.length === 0) {
    usuariosBuscandoCombateSinRanking.push(ws);
  } else {
    //si hay usuarios, crear un combate
    crearCombate(usuariosBuscandoCombateSinRanking[0], ws);
    //quitar al usuario de usuariosBuscandoCombateSinRanking
    quitarUsuarioDeMatchMaking(ws);
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
  var dataCombate: DatosCombate = {
    nombresJugadores: [usuario1.nombreUsuario, usuario2.nombreUsuario],
    wsJugadores: [usuario1, usuario2],
    setsJugadores: [],
    puestosRevelados: [],
    fichasInvocadas: [],
    eleccionActual: [null, null],
  };
  combates.push(dataCombate);
  usuario1.combateActual = dataCombate;
  usuario2.combateActual = dataCombate;
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
