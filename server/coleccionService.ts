import { obtenerUsuarioPorUsername } from "./models/userModel";
import { obtenerFichaPorNombre, agregarFichaAUsuario } from "./setModel";

export const entregarFicha = (userName: string, fichaName: string) => {
  const userId: number | undefined = obtenerUsuarioPorUsername(userName)?.id;

  if (!userId) {
    console.log("Usuario no encontrado. entregarFicha");
    return false;
  }

  const fichaId = obtenerFichaPorNombre(fichaName)?.id;
  if (!fichaId) {
    console.log("Ficha no registrada: " + fichaName);
    return false;
  }

  return agregarFichaAUsuario(userId, fichaId);
};
