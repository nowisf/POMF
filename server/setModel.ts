import { db } from "./db.ts";
interface Ficha {
  id: number;
  name: string;
  data: string;
  description: string;
}

const slotsTable =
  "CREATE TABLE IF NOT EXISTS slots (" +
  "'id' INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "'setId' INTEGER NOT NULL, " +
  "'fichaId' INTEGER, " +
  "'puesto' INTEGER NOT NULL, " +
  "FOREIGN KEY (setId) REFERENCES sets(id) ON DELETE CASCADE, " +
  "FOREIGN KEY (fichaId) REFERENCES fichas(id) ON DELETE CASCADE" +
  ");";

const setTable =
  "CREATE TABLE IF NOT EXISTS sets (" +
  "'id' INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "'userId' INTEGER NOT NULL, " +
  "'name' VARCHAR NOT NULL, " +
  "'description' TEXT, " +
  "FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE" +
  ");";

const fichaTable =
  "CREATE TABLE IF NOT EXISTS fichas (" +
  "'id' INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "'name' VARCHAR NOT NULL, " +
  "'data' TEXT, " +
  "'description' TEXT" +
  ");";

const caracteristicaTable =
  "CREATE TABLE IF NOT EXISTS caracteristicas (" +
  "'id' INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "'fichaId' INTEGER NOT NULL, " +
  "'tipo' VARCHAR NOT NULL, " +
  "'valor' TEXT NOT NULL, " +
  "FOREIGN KEY (fichaId) REFERENCES fichas(id) ON DELETE CASCADE" +
  ");";

const usuarioFichaTable =
  "CREATE TABLE IF NOT EXISTS usuario_fichas (" +
  "'id' INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "'userId' INTEGER NOT NULL, " +
  "'fichaId' INTEGER NOT NULL, " +
  "'cantidad' INTEGER NOT NULL DEFAULT 1, " +
  "FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE, " +
  "FOREIGN KEY (fichaId) REFERENCES fichas(id) ON DELETE CASCADE" +
  ");";

export const inicializarTablas = () => {
  db.exec(setTable);
  db.exec(fichaTable);
  db.exec(caracteristicaTable);
  db.exec(usuarioFichaTable);
  db.exec(slotsTable);
  console.log(
    "Tablas 'sets', 'fichas', 'caracteristicas' y 'usuario_fichas' inicializadas."
  );
};

export const agregarFichaAUsuario = (userId: number, fichaId: number) => {
  const existeStmt = db.prepare(
    "SELECT * FROM usuario_fichas WHERE userId = ? AND fichaId = ?"
  );
  const fichaExistente = existeStmt.get(userId, fichaId);

  if (fichaExistente) {
    const updateStmt = db.prepare(
      "UPDATE usuario_fichas SET cantidad = cantidad + 1 WHERE userId = ? AND fichaId = ?"
    );
    updateStmt.run(userId, fichaId);
  } else {
    // Si la ficha no existe, insertarla
    const insertStmt = db.prepare(
      "INSERT INTO usuario_fichas (userId, fichaId, cantidad) VALUES (?, ?, ?)"
    );
    insertStmt.run(userId, fichaId, 1);
  }

  return true;
};

export const obtenerFichasDeUsuario = (userId: number) => {
  const stmt = db.prepare("SELECT * FROM usuario_fichas WHERE userId = ?");
  return stmt.all(userId);
};

export const actualizarCantidadFicha = (
  userId: number,
  fichaId: number,
  cantidad: number
) => {
  const stmt = db.prepare(
    "UPDATE usuario_fichas SET cantidad = ? WHERE userId = ? AND fichaId = ?"
  );
  const resultado = stmt.run(cantidad, userId, fichaId);
  return resultado.changes > 0;
};

export const eliminarFichaDeUsuario = (userId: number, fichaId: number) => {
  const stmt = db.prepare(
    "DELETE FROM usuario_fichas WHERE userId = ? AND fichaId = ?"
  );
  const resultado = stmt.run(userId, fichaId);
  return resultado.changes > 0;
};

export const crearSet = (
  userId: number,
  name: string,
  description?: string
) => {
  const stmt = db.prepare(
    "INSERT INTO sets (userId, name, description) VALUES (?, ?, ?)"
  );
  const resultado = stmt.run(userId, name, description);

  //insertar
  if (resultado.changes > 0) {
    const setId = resultado.lastInsertRowid;
    if (typeof setId === "number") {
      for (let i = 0; i < 9; i++) {
        agregarSlot(setId, i);
      }
    }
  }

  return resultado;
};

export const obtenerSetPorID = (id: number) => {
  const stmt = db.prepare("SELECT * FROM sets WHERE id = ?");
  const set = stmt.get(id);
  return set;
};

export const obtenerSetsPorUsuario = (userId: number) => {
  const stmt = db.prepare("SELECT * FROM sets WHERE userId = ?");
  const sets = stmt.all(userId);
  return sets;
};

export const actualizarSet = (
  id: number,
  name: string,
  description?: string
) => {
  const stmt = db.prepare(
    "UPDATE sets SET name = ?, description = ? WHERE id = ?"
  );
  const resultado = stmt.run(name, description, id);
  return resultado.changes > 0;
};

export const eliminarSet = (id: number) => {
  const stmt = db.prepare("DELETE FROM sets WHERE id = ?");
  const resultado = stmt.run(id);
  return resultado.changes > 0;
};

export const crearFicha = (
  setId: number,
  name: string,
  data: string,
  description?: string
) => {
  const stmt = db.prepare(
    "INSERT INTO fichas (setId, name, data, description) VALUES (?, ?, ?, ?)"
  );
  const resultado = stmt.run(setId, name, data, description);
  return resultado;
};

export const obtenerFichasPorSet = (setId: number) => {
  const stmt = db.prepare("SELECT * FROM fichas WHERE setId = ?");
  const fichas = stmt.all(setId);
  return fichas;
};

export const actualizarFicha = (
  id: number,
  name: string,
  data: string,
  description?: string
) => {
  const stmt = db.prepare(
    "UPDATE fichas SET name = ?, data = ?, description = ? WHERE id = ?"
  );
  const resultado = stmt.run(name, data, description, id);
  return resultado.changes > 0;
};

export const eliminarFicha = (id: number) => {
  const stmt = db.prepare("DELETE FROM fichas WHERE id = ?");
  const resultado = stmt.run(id);
  return resultado.changes > 0;
};

export const crearCaracteristica = (
  fichaId: number,
  tipo: string,
  valor: string
) => {
  const stmt = db.prepare(
    "INSERT INTO caracteristicas (fichaId, tipo, valor) VALUES (?, ?, ?)"
  );
  const resultado = stmt.run(fichaId, tipo, valor);
  return resultado;
};

export const obtenerCaracteristicasPorFicha = (fichaId: number) => {
  const stmt = db.prepare("SELECT * FROM caracteristicas WHERE fichaId = ?");
  const caracteristicas = stmt.all(fichaId);
  return caracteristicas;
};

export const actualizarCaracteristica = (
  id: number,
  tipo: string,
  valor: string
) => {
  const stmt = db.prepare(
    "UPDATE caracteristicas SET tipo = ?, valor = ? WHERE id = ?"
  );
  const resultado = stmt.run(tipo, valor, id);
  return resultado.changes > 0;
};

export const eliminarCaracteristica = (id: number) => {
  const stmt = db.prepare("DELETE FROM caracteristicas WHERE id = ?");
  const resultado = stmt.run(id);
  return resultado.changes > 0;
};

export const obtenerFichaPorID = (id: number) => {
  const stmt = db.prepare("SELECT * FROM fichas WHERE id = ?");
  return stmt.get(id);
};

export const obtenerFichaPorNombre = (name: string) => {
  const stmt = db.prepare("SELECT * FROM fichas WHERE name = ?");
  return stmt.get(name) as Ficha | undefined;
};

export const usuarioTieneFicha = (userId: number, fichaId: number): boolean => {
  const stmt = db.prepare(
    "SELECT * FROM usuario_fichas WHERE userId = ? AND fichaId = ?"
  );
  const resultado = stmt.get(userId, fichaId);
  if (!resultado) {
    return false;
  }
  return true;
};

export const setTieneFicha = (setId: number, fichaId: number): boolean => {
  const stmt = db.prepare(
    "SELECT * FROM slots WHERE setId = ? AND fichaId = ?"
  );
  const resultado = stmt.get(setId, fichaId);
  return !!resultado;
};

export const agregarSlot = (setId: number, puesto: number) => {
  // Verificar si el set tiene un slot con esa ficha

  // Si no existe, insertar el nuevo slot
  const insertStmt = db.prepare(
    "INSERT INTO slots (setId, puesto) VALUES (?, ?)"
  );
  const resultado = insertStmt.run(setId, puesto);
  return resultado.changes > 0; // Retorna true si la inserción fue exitosa
};

export const establecerFichaSlot = (
  setId: number,
  puesto: number,
  fichaId: number | null
) => {
  const updateStmt = db.prepare(
    "UPDATE slots SET fichaId = ? WHERE setId = ? AND puesto = ?"
  );
  console.log(fichaId);
  const resultado = updateStmt.run(fichaId, setId, puesto);
  return resultado.changes > 0;
};

export const getSlots = (idSet: number) => {
  const stmt = db.prepare(
    `SELECT slots.puesto, fichas.name 
     FROM slots
     LEFT JOIN fichas ON slots.fichaId = fichas.id
     WHERE slots.setId = ?`
  );
  return stmt.all(idSet);
};
