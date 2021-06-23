import mongoose, { Schema, Document } from "mongoose";

export interface IReunion extends Document {
  fecha: string;
  hora: string;
  resultado: string;
}

const renionSchema: Schema = new Schema({
  fecha: { type: String, require: true },
  hora: { type: String, require: true },
  resultado: { type: String, default: "Sin definir" },
});
export default mongoose.model<IReunion>("Reunion", renionSchema);
