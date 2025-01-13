import { db } from "./db.ts";

const cardTable =
  "CREATE TABLE IF NOT EXISTS cards (" +
  "'id' INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "'setId' INTEGER NOT NULL, " +
  "'name' VARCHAR NOT NULL, " +
  "'type' VARCHAR, " +
  "'rarity' VARCHAR, " +
  "'description' TEXT, " +
  "FOREIGN KEY (setId) REFERENCES sets(id) ON DELETE CASCADE" +
  ");";

db.exec(cardTable);

export const crearCard = (
  setId: number,
  name: string,
  type?: string,
  rarity?: string,
  description?: string
) => {
  const stmt = db.prepare(
    "INSERT INTO cards (setId, name, type, rarity, description) VALUES (?, ?, ?, ?, ?)"
  );
  const resultado = stmt.run(setId, name, type, rarity, description);
  return resultado;
};

export const obtenerCardPorID = (id: number) => {
  const stmt = db.prepare("SELECT * FROM cards WHERE id = ?");
  const card = stmt.get(id);
  return card;
};

export const obtenerCardsPorSet = (setId: number) => {
  const stmt = db.prepare("SELECT * FROM cards WHERE setId = ?");
  const cards = stmt.all(setId);
  return cards;
};

export const actualizarCard = (
  id: number,
  name: string,
  type?: string,
  rarity?: string,
  description?: string
) => {
  const stmt = db.prepare(
    "UPDATE cards SET name = ?, type = ?, rarity = ?, description = ? WHERE id = ?"
  );
  const resultado = stmt.run(name, type, rarity, description, id);
  return resultado.changes > 0;
};

export const eliminarCard = (id: number) => {
  const stmt = db.prepare("DELETE FROM cards WHERE id = ?");
  const resultado = stmt.run(id);
  return resultado.changes > 0;
};
