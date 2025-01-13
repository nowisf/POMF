import Database from "better-sqlite3";

export const db = new Database("mi_base_de_datos.db");
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
