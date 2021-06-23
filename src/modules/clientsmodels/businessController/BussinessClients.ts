import ClientsModel, { IClients } from "../models/Clients";
import PedidosModel, { IPedidos } from "../../pedidosmodule/models/pedidos";
class BusinessClient {
  constructor() {

  }
// ----------------- Agregar cliente -------------
  public async addClient(client: IClients) {
    try {
      let clientDb = new ClientsModel(client);
      let result = await clientDb.save();
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

//------------Leer CLientes -------------
  public async readClients(): Promise<Array<IClients>>;
  public async readClients(id: string): Promise<IClients>;
  public async readClients( query: any,  skip: number,  limit: number ): Promise<Array<IClients>>;

  public async readClients( params1?: string | any, params2?: number, params3?: number ): Promise<Array<IClients> | IClients> {
    if (params1 && typeof params1 == "string") {
      var result: IClients = await ClientsModel.findOne({ _id: params1, });
      return result;
    } else if (params1) {
      let skip = params2 ? params2 : 0;
      let limit = params3 ? params3 : 1;
      let listClient: Array<IClients> = await ClientsModel.find(params1) .skip(skip) .limit(limit);
      return listClient;
    } else {
      let listClient: Array<IClients> = await ClientsModel.find();
      return listClient;
    }
  }

// ------Obtener el Tipo de Cliente -------------
  public async getTypeClient(tipo: string) {
    let client = await ClientsModel.find({ tipo: tipo });
    console.log(client);
    if (client != null) {
      return client;
    }
    return null;
  }
/*/----- Obtener Nombres de  Clientes Regulares -------------
  public async getNamesClientR(name: string, tipo: string) {
    let regularexpresion: RegExp = new RegExp(name.toLowerCase(), "regular");
    try {
      var client: Array<IClients> = await ClientsModel.find();
      var result: Array<IClients> = client.filter((item: IClients) => {
        if (
          item.tipo.toLowerCase() == tipo.toLowerCase() &&
          (item.firtsname.toLowerCase().match(regularexpresion) ||
            item.lastname.toLowerCase().match(regularexpresion))
        ) {
          return true;
        }
        console.log(item.tipo + "   ---" + tipo);
        return false;
      });
      return result;
    } catch (err) {
      return err;
    }
  }
*/
// --------------- Actualizar Cliente -------------------
  public async updateClient(id: string, client: any) {
    let result = await ClientsModel.update({ _id: id }, { $set: client});
    return result;
  }
// --------------- ELiminar Cliente -------------------
  public async deleteClients(id: string) {
    let result = await ClientsModel.remove({ _id: id });
    return result;
  }

  // --------------- Agragar Pedido-------------------
  public async addPed(idCl: string, idPed: string) {
    let client = await ClientsModel.findOne({ _id: idCl});
    if (client != null) {
      var pedido = await PedidosModel.findOne({ _id: idPed });
      if (pedido != null) {
        client.pedidos.push(pedido);
        return await client.save();
      }
      return null;
    }
    return null;
  }

  // --------------- Eliminar Pedido -------------------
  public async removePed(idCl: string, idPed: string) {
    let client = await ClientsModel.findOne({ _id: idCl });
    var Pedido = await PedidosModel.findOne({ _id: idPed });
    if (client != null && Pedido != null) {
      let newpedidos: Array<IPedidos> = client.pedidos.filter(
        (item: IPedidos) => {
          if (item._id.toString() == Pedido._id.toString()) {
            return false;
          }
          return true;
        }
      );
      client.pedidos = newpedidos;
      try {
        return await client.save();
      } catch (err) {
        return err;
      }
    }
    return null;
  }
}
export default BusinessClient;
