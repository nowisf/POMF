import { db } from "./db.ts";

interface User {
  id: number;
  username: string;
  password: string;
  mail: string;
}

const userTable =
  "CREATE TABLE IF NOT EXISTS users (" +
  "'id' INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "'username' VARCHAR NOT NULL UNIQUE, " +
  "'password' VARCHAR NOT NULL," +
  "'mail' VARCHAR NOT NULL UNIQUE" +
  ");";

export const inicializarBD = () => {
  db.exec(userTable);
  console.log("BD inicializadaxxx ;;)");
};

export const crearUsuario = (username, password, mail) => {
  const stmt = db.prepare(
    "INSERT INTO users (username, password, mail) VALUES (?, ?, ?)"
  );
  const resultado = stmt.run(username, password, mail);
  return resultado;
};

export const obtenerUsuarioPorID = (id: number): User | undefined => {
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  const usuario = stmt.get(id);

  return usuario as User | undefined;
};

export const obtenerUsuarioPorUsername = (username): User | undefined => {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
  const usuario = stmt.get(username);
  return usuario as User | undefined;
};

export const obtenerUsuarioPorCorreo = (mail): User | undefined => {
  const stmt = db.prepare("SELECT * FROM users WHERE mail = ?");
  const usuario = stmt.get(mail); // `get` devuelve el primer resultado encontrado
  return usuario as User | undefined;
};
