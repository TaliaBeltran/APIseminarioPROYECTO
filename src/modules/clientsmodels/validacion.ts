import BusinessClient from "./businessController/BussinessClients";
import { IClients } from "./models/Clients";

//------------ VALIDACION DE LA FECHA -------------Ejemplos:31.12.3013_01/01/2013_5-3-2013_5.03.2013

export const validacionfecha = (value: string) => {
  const regexp = /^(?:3[01]|[12][0-9]|0?[1-9])([\-/.])(0?[1-9]|1[1-2])\1\d{4}$/;
  return regexp.test(value);
};

// --------------Validacion de la hora -------- Ejemplos:1:34 //  01:34 //12:27 //15:09 //0:05

export const validaciónhora = (value: string) => {
  const regexp = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regexp.test(value);
};
//-------Validacion de la probabilidad -------  es de 1-100

export const validacionprob = (value: number) => {
  if (value > -1 && value < 101) {
    return true;
  }
  return false;
};
