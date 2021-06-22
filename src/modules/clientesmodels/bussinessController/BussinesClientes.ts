import ClientsModel, { IClientes } from "../modelos/Clientes";
//import PedidosModel, { IPedidos } from "../../pedidosmodule/models/pedidos";

class BussinesClientes {
  constructor() {}
  //------------Agregar Clientes-----------------------...

  public async addClient(client: IClientes) {
    try {
      let clientDb = new ClientsModel(client);
      let result = await clientDb.save();
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  //-------------- Leer Clientes --------------------------------------

  public async readClientes(): Promise<Array<IClientes>>;
  public async readClientes(id: string): Promise<IClientes>;
  public async readClientes(
    query: any,
    skip: number,
    limit: number
  ): Promise<Array<IClientes>>;

  public async readClientes(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IClientes> | IClientes> {
    if (params1 && typeof params1 == "string") {
      var result: IClientes = await ClientsModel.findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2 ? params2 : 0;
      let limit = params3 ? params3 : 1;
      let listUser: Array<IClientes> = await ClientsModel.find(params1)
        .skip(skip)
        .limit(limit);
      return listUser;
    } else {
      let listUser: Array<IClientes> = await ClientsModel.find();
      return listUser;
    }
  }

  //-------------------Obtener  tipo de Clientes-----------------------------------

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
      var client: Array<IClientes> = await ClientsModel.find();
      var result: Array<IClientes> = client.filter((item: IClientes) => {
        if (
          item.tipoCliente.toLowerCase() == tipo.toLowerCase() &&
          (item.firtsname.toLowerCase().match(regularexpresion) ||
            item.lastname.toLowerCase().match(regularexpresion))
        ) {
          return true;
        }
        console.log(item.tipoCliente + "   ---" + tipo);
        return false;
      });
      return result;
    } catch (err) {
      return err;
    }
  }

  //-----------------Actualizar cliente------id-----------------

  public async updateClient(id: string, user: any) {
    let result = await ClientsModel.update({ _id: id }, { $set: user });
    return result;
  }

  //-----------------Eliminar Cliente --------id--------------

  public async deleteClients(id: string) {
    let result = await ClientsModel.remove({ _id: id });
    return result;
  }

  /*

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
  }*/
}

export default BussinesClientes;
