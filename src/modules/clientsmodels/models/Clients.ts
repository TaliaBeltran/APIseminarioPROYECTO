import mongoose, { Schema, Document } from "mongoose";
import { IReunion } from "./Agenda";
import { IPedidos } from "../../pedidosmodule/models/pedidos";
export interface IClients extends Document {
  firtsname: string;
  lastname: string;
  email: string;
  telephone: string;
  descriptionphone?: string;
  uriphoto?: string; //aqui entrara la uri donde nos llevara a la imagen
  pathphoto?: string;
  state: string;
  probability: number;
  zona: string;
  street: string;
  tipo: string; //Regular o Potencial
  registerdate: Date;
  pedidos?: Array<IPedidos>;
  reunion?: Array<IReunion>;
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
  descriptionphone: { type: String },
  uriphoto: { type: String /*, required: true */ },
  pathphoto: { type: String /*, required: true*/ },
  state: { type: String /*, required: true */ },
  probability: { type: Number, required: true },
  registerdate: { type: Date, required: true, default: Date.now },
  zona: { type: String, required: true },
  street: { type: String, required: true },
  tipo: { type: String, default: "Potencial" },
  pedidos: { type: Array },
  reunion: { type: Array },
});
export default mongoose.model<IClients>("Client", clientsSchema);
