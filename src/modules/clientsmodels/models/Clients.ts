import mongoose, { Schema, Document } from "mongoose";
import { IReunion } from "./Agenda";
import { IPedidos } from "../../pedidosmodule/models/pedidos";

export interface IClients extends Document {
  firtsname: string;
  lastname: string;
  email: string;
  telephone: string;
  uriphoto?: string; // foto de tienda de cliente
  pathphoto?: string;
  state: string; //estado del cliente
  probability: number; // probabilidad de negociacion
  zona: string;
  street: string; // calle y numero
  tipo: string; //TipoCLiente: mayorista, supermercado , off
  registerdate: Date;
  pedidos?: Array<IPedidos>;
  reunion?: Array<IReunion>;
  idUser: string;
}

const clientsSchema: Schema = new Schema({
  firtsname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  telephone: {
    type: String,
    require: true,
    unique: true,
  },
  uriphoto: {
    type: String,
  },
  pathphoto: {
    type: String,
  },
  state: {
    type: String,
  },
  probability: {
    type: Number,
    required: true,
  },
  registerdate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  zona: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },

  pedidos: { type: Array },
  reunion: { type: Array },
  idUser: { type: String, required: true },
});
export default mongoose.model<IClients>("Client", clientsSchema);
