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
} from "./setModel";

import { db } from "./db";

console.log("yes");

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
export const entregarFicha = (userName: string, fichaName: string) => {
  const userId: number | undefined = obtenerUsuarioPorUsername(userName)?.id;

  if (!userId) {
    console.log("Usuario no encontrado. entregarFicha");
    return false;
  }

  const fichaId = obtenerFichaPorNombre(fichaName)?.id;
  if (!fichaId) {
    console.log("Ficha no registrada: " + fichaName);
    console.log(fichaId);
    return false;
  }

  // Llamar a la función que agrega la ficha al usuario
  return agregarFichaAUsuario(userId, fichaId);
};

type MessageData = LoginData | RegisterData | { type: string }; // Agrega otros tipos si necesitas.

wss.on("connection", (ws: WebSocket) => {
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
          authenticatedClients.set(ws, usuario);
          var idLastSetUsuario = obtenerUsuarioPorUsername(usuario)?.lastSet;
          if (idLastSetUsuario) {
            obtenerSetPorID(idLastSetUsuario);
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
        if (
          usuarioTieneFicha(userId, fichaId) &&
          !setTieneFicha(setId, fichaId)
        ) {
          var mensajeCambioSlot = {
            type: "slot_actualizar",
            ficha: data.ficha,
            slot: data.slot,
          };
          console.log("fichaId: " + fichaId);
          establecerFichaSlot(setId, data.slot, fichaId);
          ws.send(JSON.stringify(mensajeCambioSlot));
        }
      } else {
        console.log("error al asignar ficha a set");
      }
    } else {
      console.log("Mensaje desconocido:", data);
    }
  });

  ws.on("close", () => {
    console.log("Cliente desconectado.");
    authenticatedClients.delete(ws);
  });
});
