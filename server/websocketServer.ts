import WebSocket from "ws";
import { ExtendedWebSocket } from "./types";
import { handleMessage } from "./messageHandlers";

export function setupWebSocketServer(port: number): void {
  const wss: WebSocket.Server = new WebSocket.Server({ port });

  wss.on("connection", (ws: ExtendedWebSocket) => {
    console.log("Conexion establecida ");

    ws.on("message", (message: WebSocket.RawData) => {
      handleMessage(ws, message);
    });

    ws.on("close", () => {
      console.log("Cliente desconectado.");
    });
  });
}
