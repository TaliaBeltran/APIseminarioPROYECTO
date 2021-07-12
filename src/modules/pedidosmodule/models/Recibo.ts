import mongoose, { Schema, Document } from "mongoose";

export interface IRecibo extends Document {
  nameclient: string;
  namevendedor: string;
  total: number;
  registerdateRecibo: Date;
}

const reciboSchema: Schema = new Schema({
  nameclient: { type: String, required: true },
  namevendedor: { type: String, required: true },
  products: { type: Array },
  total: { type: Number, default: 0 },
});
export default mongoose.model<IRecibo>("Recibo", reciboSchema);
