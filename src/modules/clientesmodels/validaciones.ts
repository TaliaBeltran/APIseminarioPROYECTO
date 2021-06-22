import BussinesClientes from "./bussinessController/BussinesClientes";
import { IClientes } from "./modelos/Clientes";

// -------------- Validacion para la fecha -----------31.12.3013, 01/01/2013, 5-3-2013, 15.03.2013 ------
export const validacionfecha = (value: string) => {
  const regexp = /^(?:3[01]|[12][0-9]|0?[1-9])([\-/.])(0?[1-9]|1[1-2])\1\d{4}$/;
  return regexp.test(value);
};

// ---------------Validacion de la hora -----------------------------------------------------------
export const validaciónhora = (value: string) => {
  const regexp = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regexp.test(value);
};

// ----------------Validacion de letras ---------------------------
export var validacion = (value: string) => {
  const regexp = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

  return regexp.test(value);
};
// -------------------Validacion de  numero de telefono-----------------------
export const validacionphone = (value: string) => {
  const regexp = /^\(?(\d{3})\)?[-]?(\d{3})[-]?(\d{4})$/;
  return regexp.test(value);
};
// ---------------validacion de la probabilidad -----------------------------
export const validacionprob = (value: number) => {
  if (value > -1 && value < 101) {
    return true;
  }
  return false;
};
