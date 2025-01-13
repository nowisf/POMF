import { db } from "./db.ts";

const setTable =
  "CREATE TABLE IF NOT EXISTS sets (" +
  "'id' INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "'userId' INTEGER NOT NULL, " +
  "'name' VARCHAR NOT NULL, " +
  "'description' TEXT, " +
  "FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE" +
  ");";

export const inicializarSetTable = () => {
  db.exec(setTable);
  console.log("Tabla 'sets' inicializada.");
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
