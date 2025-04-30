import dataFichas from "../data/fichas.json";
import versionFichas from "../version.json";
import { ExtendedWebSocket } from "../types";

export const manejadoresMensajesVersion = {
  enviar_version: (ws: ExtendedWebSocket, data: any) => {
    if (versionFichas.version == data.version) {
      console.log("misma version. devolver ok");
      const mensajeVersionOk = {
        type: "data_actualizar",
        state: "ok",
      };
      ws.send(JSON.stringify(mensajeVersionOk));
    } else {
      const mensajeVersion = {
        type: "data_actualizar",
        fichas: dataFichas,
        version: versionFichas.version,
        state: "actualizar",
      };
      ws.send(JSON.stringify(mensajeVersion));
    }
  },
};
