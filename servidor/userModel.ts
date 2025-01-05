const Database = require("better-sqlite3");
const db = new Database("mi_base_de_datos.db");

const userTable =
  "CREATE TABLE IF NOT EXISTS users (" +
  "'id' INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "'username' VARCHAR NOT NULL UNIQUE, " +
  "'password' VARCHAR NOT NULL," +
  "'mail' VARCHAR NOT NULL UNIQUE" +
  ");";

export function inicializarBD() {
  db.exec(userTable);

  console.log("BD inicializadaxxx ;;)");
}

export function crearUsuario(username, password, mail) {
  const stmt = db.prepare(
    "INSERT INTO users (username, password, mail) VALUES (?, ?, ?)"
  );
  const resultado = stmt.run(username, password, mail);
  return resultado;
}

export function obtenerUsuarioPorID(id) {
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  const usuario = stmt.get(id);
  return usuario;
}

export function obtenerUsuarioPorUsername(username) {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
  const usuario = stmt.get(username);
  return usuario;
}

export function obtenerUsuarioPorCorreo(mail) {
  const stmt = db.prepare("SELECT * FROM users WHERE mail = ?");
  const usuario = stmt.get(mail); // `get` devuelve el primer resultado encontrado
  return usuario;
}
