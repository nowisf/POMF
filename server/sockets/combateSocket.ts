// combateSocket.ts
import WebSocket from "ws";
import { ExtendedWebSocket, DatosCombate } from "../types";
import { obtenerUsuarioPorUsername } from "../models/userModel";
import { getSlots, obtenerFichaPorID } from "../setModel";

// Tipos de mensajes relacionados con el combate
export interface MensajeCombate {
  type:
    | "solicitar_combate"
    | "combate_iniciado"
    | "turno_iniciado"
    | "realizar_accion"
    | "accion_realizada"
    | "combate_finalizado"
    | "error_combate";
  datos: any;
}

// Manejadores de mensajes
export const manejadoresMensajesCombate = {
  solicitar_combate: (ws: ExtendedWebSocket, datos: any) => {
    console.log("Solicitud de combate recibida");
    matchMakingNoRanking(ws);
  },

  realizar_accion: (ws: ExtendedWebSocket, datos: any) => {
    const { tipo, fichaOrigen, fichaObjetivo } = datos;
    const combate = obtenerCombateActivo(ws);

    if (!combate) {
      enviarError(ws, "No se encontró un combate activo");
      return;
    }

    if (!esTurnoJugador(ws, combate)) {
      enviarError(ws, "No es tu turno");
      return;
    }

    procesarAccion(combate, tipo, fichaOrigen, fichaObjetivo);
  },

  rendirse: (ws: ExtendedWebSocket) => {
    const combate = obtenerCombateActivo(ws);
    if (combate) {
      finalizarCombate(combate, obtenerOponente(ws, combate));
    }
  },
};

// Funciones de envío de mensajes
export const notificacionesCombate = {
  enviarInicioCombate: (combate: DatosCombate) => {
    const mensaje = {
      type: "combate_iniciado",
      datos: {
        jugadores: combate.nombresJugadores,
        turnoInicial: combate.turnoActual,
        fichasIniciales: obtenerEstadoFichasInicial(combate),
      },
    };

    broadcastCombate(combate, mensaje);
  },

  enviarActualizacionEstado: (combate: DatosCombate) => {
    const mensaje = {
      type: "estado_actualizado",
      datos: {
        turnoActual: combate.turnoActual,
        fichas: obtenerEstadoFichasActual(combate),
        efectosActivos: obtenerEfectosActivos(combate),
      },
    };

    broadcastCombate(combate, mensaje);
  },

  enviarResultadoAccion: (combate: DatosCombate, resultado: any) => {
    const mensaje = {
      type: "accion_realizada",
      datos: resultado,
    };

    broadcastCombate(combate, mensaje);
  },

  enviarFinCombate: (combate: DatosCombate, ganador: string) => {
    const mensaje = {
      type: "combate_finalizado",
      datos: {
        ganador,
        estadisticasFinales: obtenerEstadisticasFinales(combate),
      },
    };

    broadcastCombate(combate, mensaje);
  },
};

// Funciones auxiliares
function broadcastCombate(combate: DatosCombate, mensaje: any) {
  combate.wsJugadores.forEach((ws) => {
    ws.send(JSON.stringify(mensaje));
  });
}

function enviarError(ws: WebSocket, mensaje: string) {
  ws.send(
    JSON.stringify({
      type: "error_combate",
      mensaje,
    })
  );
}

function obtenerCombateActivo(ws: ExtendedWebSocket): DatosCombate | null {
  return (ws as any).combateActual || null;
}

function esTurnoJugador(ws: ExtendedWebSocket, combate: DatosCombate): boolean {
  return combate.wsJugadores[combate.turnoActual] === ws;
}

function obtenerOponente(
  ws: ExtendedWebSocket,
  combate: DatosCombate
): ExtendedWebSocket {
  return combate.wsJugadores[0] === ws
    ? combate.wsJugadores[1]
    : combate.wsJugadores[0];
}
