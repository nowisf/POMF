import { db } from "./db.ts";
import dataFichas from "./data/fichas.json"; // Importa el archivo JSON directamente

// Define la estructura de tu JSON
interface FichaData {
  nombre: string;
  descripcion: string;
  texture: string;
  hero: boolean;
}

// Función para insertar los datos de fichas en la base de datos
const insertarFichaEnBD = (
  nombre: string,
  descripcion: string,
  texture: string,
  hero: boolean
) => {
  const stmt = db.prepare(
    "INSERT INTO fichas (name, data, description) VALUES (?, ?, ?)"
  );
  const data = JSON.stringify({ texture, hero }); // Guardamos 'texture' y 'hero' como un objeto JSON
  stmt.run(nombre, data, descripcion);
};

// Función principal para cargar el JSON y agregarlo a la base de datos
const agregarFichasDesdeJSON = () => {
  // Itera sobre cada clave del JSON y agrega cada ficha
  for (const key in dataFichas) {
    if (dataFichas.hasOwnProperty(key)) {
      const ficha = dataFichas[key];

      // Inserta la ficha en la base de datos
      insertarFichaEnBD(
        ficha.nombre,
        ficha.descripcion,
        ficha.texture,
        ficha.hero
      );
    }
  }

  console.log("Fichas agregadas correctamente.");
};

// Llama a la función para agregar las fichas
agregarFichasDesdeJSON();
