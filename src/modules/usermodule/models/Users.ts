import mongoose, { Schema, Document } from "mongoose";
import RolesModel, { IRoles } from "./Roles";
import validator from "validator"; //instalamos validator para validar correos y username
import { IClients } from "../../clientsmodels/models/Clients";

export interface ISimpleUser {
  username?: string;
  email?: string;
  registerdate?: Date;
  password?: string;
  tipo?: string;
  roles?: Array<IRoles>;
  uriavatar?: string;
  pathavatar?: string;
}
export interface IUser extends Document {
  username: string;
  email: string;
  registerdate: Date;
  password: string;
  tipo: string;
  roles: Array<IRoles>;
  uriavatar: string;
  pathavatar: string;
  clients: Array<IClients>;
}
const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  registerdate: { type: Date, required: true, default: Date.now },
  password: { type: String, required: true },
  tipo: { type: String, required: true },
  roles: { type: Array },
  uriavatar: { type: String },
  pathavatar: { type: String },
  clients: { type: Array },
});
export default mongoose.model<IUser>("User", userSchema);
