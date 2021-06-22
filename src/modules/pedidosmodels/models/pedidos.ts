import mongoose, { Schema, Document } from "mongoose";
//import { ISimpleProducts } from "./Products";
//import { IRecibo } from "./Recibo";

export interface IPedidos extends Document {
  state: string;
  // products: Array<ISimpleProducts>;
  registerdate: Date;
  ordenarP: string;
  methodpago: string;
  cuentaBancaria?: string;
  valortotal: number;
}
const pedidoSchema: Schema = new Schema({
  state: {
    type: String,
    required: true,
  },
  //products: { type: Array },
  registerdate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  ordenarP: {
    type: String,
    required: true,
  },
  methodpago: {
    type: String,
    required: true,
  },
  cuentaBancaria: { type: String },
  valortotal: { type: Number, default: 0 },
  //Recibo: { type: Array },
});
export default mongoose.model<IPedidos>("Pedido", pedidoSchema);
