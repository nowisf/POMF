import WebSocket from "ws";

import {
  inicializarBD,
  obtenerUsuarioPorID,
  obtenerUsuarioPorUsername,
  obtenerUsuarioPorCorreo,
  crearUsuario,
} from "./userModel";

console.log("yes");

const authenticatedClients = new Map<WebSocket, string>();

const port: number = 8080;

const wss: WebSocket.Server = new WebSocket.Server({ port });

console.log(`running on ws://127.0.0.1:${port}`);

inicializarBD();

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

type MessageData = LoginData | RegisterData | { type: string }; // Agrega otros tipos si necesitas.

wss.on("connection", (ws: WebSocket) => {
  console.log("buenas");
  ws.on("message", (message: WebSocket.RawData) => {
    const data = JSON.parse(message.toString());
    console.log("Received data:", data);

    if (data.type === "login") {
      const { usuario, clave } = data;
      console.log(
        `Credenciales recibidas - Usuario: ${usuario}, Clave: ${clave}`
      );

      const usuarioData = obtenerUsuarioPorUsername(usuario);
      if (usuarioData) {
        if (usuarioData.password === clave) {
          ws.send(JSON.stringify({ type: "login_respuesta", exito: true }));
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
        crearUsuario(data.usuario, data.clave, data.mail);
        console.log("Usuario " + data.usuario + " creado!");
      }
      ws.send(JSON.stringify(mensaje));
    } else {
      console.log("Mensaje desconocido:", data);
    }
  });

  ws.on("close", () => {
    console.log("Cliente desconectado.");
  });
});
