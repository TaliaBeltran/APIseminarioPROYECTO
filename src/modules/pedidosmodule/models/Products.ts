import mongoose, { Schema, Document } from "mongoose";

export interface ISimpleProducts {
  id: string;
  name: string;
  cantidad: number;
  priceUnitary: number;
  priceTotal: number;
  registerdate: Date;
}

export interface IProducts extends Document {
  name: string;
  uriimage: string;
  pathavathar: string;
  stock: number;
  price: number;
  ofert: number;
  registerdate: Date;
}

const productsSchema: Schema = new Schema({
  name: { type: String, required: true },
  uriimage: { type: String },
  pathavathar: { type: String },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  ofert: { type: Number, required: true, default: 0 },
  registerdate: { type: Date, required: true, default: Date.now },
});
export default mongoose.model<IProducts>("Producto", productsSchema);
