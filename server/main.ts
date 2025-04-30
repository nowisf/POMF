import { setupWebSocketServer } from "./websocketServer";
import { inicializarBD, inicializarTablas } from "./initDatabase";

const port: number = 8080;

console.log(`running on ws://127.0.0.1:${port}`);

inicializarBD();
inicializarTablas();

setupWebSocketServer(port);

/*
Pasos del combate
Inicia el turno
Se reducen los cds de las habilidades 
Si una habilidad llega a 0
Se escogeran los involucrados en el ataque (comunmente usando exposicion o heroe focus)
  ~Deberian enmarcarse o destacarse, como minimo hacer visibles los participantes de una habilidad

        
*/
