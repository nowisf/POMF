import WebSocket from "ws";
import { ExtendedWebSocket } from "../types";
import {
  obtenerUsuarioPorUsername,
  obtenerUsuarioPorCorreo,
  crearUsuario,
} from "../models/userModel";
import { getSlots } from "../models/setModel";
import { entregarFicha } from "../coleccionService";
import fichasBienvenidaJSON from "../data/fichasBienvenida.json";

// Manejadores de mensajes
export const manejadoresMensajesAuth = {
  login: (ws: ExtendedWebSocket, data: any) => {
    {
      const { usuario, clave } = data;
      console.log(`Credenciales recibidas - Usuario: ${usuario}`);

      const usuarioData = obtenerUsuarioPorUsername(usuario);
      if (usuarioData) {
        if (usuarioData.password === clave) {
          ws.send(JSON.stringify({ type: "login_respuesta", exito: true }));
          ws.nombreUsuario = usuario;
          ws.id = usuarioData.id;
          ws.lastSet = usuarioData.lastSet;
          var idLastSetUsuario = obtenerUsuarioPorUsername(usuario)?.lastSet;
          if (idLastSetUsuario) {
            getSlots(idLastSetUsuario).forEach((casillaSlot) => {
              var mensajeCambioSlot = {
                type: "slot_actualizar",
                ficha: casillaSlot.name,
                slot: casillaSlot.puesto,
              };

              ws.send(JSON.stringify(mensajeCambioSlot));
            });
          }
        } else {
          ws.send(JSON.stringify({ type: "login_respuesta", exito: false }));
        }
      } else {
        ws.send(JSON.stringify({ type: "login_respuesta", exito: false }));
      }
    }
  },
  register: (ws: ExtendedWebSocket, data: any) => {
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
  },
};
