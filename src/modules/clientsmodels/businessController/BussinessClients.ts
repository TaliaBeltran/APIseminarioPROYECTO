import ClientsModel, { IClients } from "../models/Clients";
import PedidosModel, { IPedidos } from "../../pedidosmodule/models/pedidos";
class BusinessClient {
  constructor() {}

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

  public async readClients(): Promise<Array<IClients>>;
  public async readClients(id: string): Promise<IClients>;
  public async readClients(
    query: any,
    skip: number,
    limit: number
  ): Promise<Array<IClients>>;

  public async readClients(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IClients> | IClients> {
    if (params1 && typeof params1 == "string") {
      var result: IClients = await ClientsModel.findOne({
        _id: params1,
      });

      return result;
    } else if (params1) {
      let skip = params2 ? params2 : 0;
      let limit = params3 ? params3 : 1;
      let listUser: Array<IClients> = await ClientsModel.find(params1)
        .skip(skip)
        .limit(limit);
      return listUser;
    } else {
      let listUser: Array<IClients> = await ClientsModel.find();
      return listUser;
    }
  }

  public async getTypeClient(tipo: string) {
    let client = await ClientsModel.find({ tipo: tipo });
    console.log(client);
    if (client != null) {
      return client;
    }
    return null;
  }

  public async getNamesClientR(name: string, tipo: string) {
    let regularexpresion: RegExp = new RegExp(name.toLowerCase(), "g");
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

  public async updateClient(id: string, user: any) {
    let result = await ClientsModel.update({ _id: id }, { $set: user });
    return result;
  }

  public async deleteClients(id: string) {
    let result = await ClientsModel.remove({ _id: id });
    return result;
  }

  public async addPed(idUs: string, idPed: string) {
    let client = await ClientsModel.findOne({ _id: idUs });
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

  public async removePed(idCl: string, idPed: string) {
    let client = await ClientsModel.findOne({ _id: idCl });
    var Pedido = await PedidosModel.findOne({ _id: idPed });

    if (client != null && Pedido != null) {
      let newpedidos: Array<IPedidos> = client.pedidos.filter(
        (item: IPedidos) => {
          if (item._id.toString() == Pedido._id.toString()) {
            //si no utilizo el toString() no funciona...esta raro
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
