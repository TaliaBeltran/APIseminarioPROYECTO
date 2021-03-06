import mongoose, { Schema, Document } from "mongoose";
import { ISimpleProducts } from "./Products";
import { IRecibo } from "./Recibo";

export interface IPedidos extends Document {
  state: string;
  products: Array<ISimpleProducts>;
  ordenarP: string;
  registerdate: Date;
  methodpay: string;
  cuentaBancaria?: string;
  total: number;
  Recibo?: Array<IRecibo>;
  idClient?: string;
  FechaEntrega: String;
  horaEntrega: String;
}
const pedidosSchema: Schema = new Schema({
  state: {
    type: String,
    required: true,
    default: "Pedido Sin Entregar",
  },
  products: {
    type: Array,
  },
  registerdate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  ordenarP: {
    type: String,
    required: true,
    default: "off",
  },
  methodpay: {
    type: String,
    required: true,
  },
  cuentaBancaria: {
    type: String,
  },
  total: {
    type: Number,
    default: 0,
  },
  Recibo: {
    type: Array,
  },
  idClient: { type: String },
  FechaEntrega: { type: String },
  horaEntrega: { type: String },
});
export default mongoose.model<IPedidos>("Pedido", pedidosSchema);
