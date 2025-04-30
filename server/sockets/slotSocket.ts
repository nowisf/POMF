import { ExtendedWebSocket } from "../types";
import {
  obtenerFichaPorID,
  establecerFichaSlot,
  obtenerFichaPorNombre,
  fichaIsHero,
  obtenerSlotPorFichaYSet,
  setTieneFicha,
  usuarioTieneFicha,
} from "../models/setModel";

export const cambiarSlot = (
  setId: number,
  slotTarget: number,
  ws: ExtendedWebSocket,
  fichaId: number | null
): void => {
  const ficha = obtenerFichaPorID(fichaId);

  let nombreFicha: string | null = null;

  if (ficha) {
    nombreFicha = ficha.name;
  }

  const mensajeCambioSlot = {
    type: "slot_actualizar",
    ficha: nombreFicha,
    slot: slotTarget,
  };

  establecerFichaSlot(setId, slotTarget, fichaId);
  ws.send(JSON.stringify(mensajeCambioSlot));
};

export const manejadoresMensajesSlot = {
  solicitar_cambio_slot: (ws: ExtendedWebSocket, data: any) => {
    const userId = ws.id;
    const fichaId = obtenerFichaPorNombre(data.ficha)?.id;
    const setId = ws.lastSet;

    if (userId && fichaId && typeof setId === "number") {
      if (usuarioTieneFicha(userId, fichaId)) {
        if (
          (fichaIsHero(fichaId) && data.slot == 0) ||
          (!fichaIsHero(fichaId) && data.slot != 0)
        ) {
          if (setTieneFicha(setId, fichaId)) {
            const puestoAReemplazar = obtenerSlotPorFichaYSet(
              setId,
              fichaId
            )?.puesto;
            if (typeof puestoAReemplazar == "number") {
              cambiarSlot(setId, puestoAReemplazar, ws, null);
            }
          }
          cambiarSlot(setId, data.slot, ws, fichaId);
        }
      }
    } else {
      console.log("error al asignar ficha a set");
    }
  },
};
