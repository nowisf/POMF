// types.ts
import WebSocket from "ws";

export interface ExtendedWebSocket extends WebSocket {
  nombreUsuario: string;
  combateActual: DatosCombate | null;
  id: number;
  lastSet: number | undefined;
}

export interface DatosCombate {
  id: string;
  nombresJugadores: string[];
  wsJugadores: ExtendedWebSocket[];
  setsJugadores: number[];
  turnoActual: number;
  ronda: number;
  fichasInvocadas: Map<number, EstadoFicha>[];
  puestosRevelados: boolean[];
  eleccionActual: number | null[];
}

export type MessageData = LoginData | RegisterData | { type: string };

export interface EstadoFicha {
  id: number;
  nombre: string;
  vidaActual: number;
  vidaMaxima: number;
  ataque: number;
  defensa: number;
  enfriamientoActual: number;
  enfriamientoBase: number;
  carga: number;
  efectos: Efecto[];
}

export interface Efecto {
  tipo: string;
  duracion: number;
  valor: number;
}

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
