import { response } from "express";
import PedidoModel, { IPedidos } from "../models/pedidos";
import ProductsModel, { IProducts, ISimpleProducts } from "../models/Products";
import ClientsModel from "../../clientsmodels/models/Clients";
import UserModel from "../../usermodule/models/Users";
import { validarEliminacionPedido } from "../validation";

class BussinessPedidos {
  constructor() {
    
  }
//----------------Leer Pedido -------------------------
  public async readPedido(): Promise<Array<IPedidos>>;
  public async readPedido(id: string): Promise<IPedidos>;
  public async readPedido( query: any, skip: number, limit: number): Promise<Array<IPedidos>>;
  public async readPedido( params1?: string | any, params2?: number, params3?: number): Promise<Array<IPedidos> | IPedidos> {
    if (params1 && typeof params1 == "string") {
      var result: IPedidos = await PedidoModel.findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2 ? params2 : 0;
      let limit = params3 ? params3 : 1;
      let listUser: Array<IPedidos> = await PedidoModel.find(params1).skip(skip).limit(limit);
      return listUser;
    } else {
      let listUser: Array<IPedidos> = await PedidoModel.find();
      return listUser;
    }
  }

  //---------------- Agregar Pedido -------------------------
  public async addPedidos(pedidos: IPedidos) {
    try {
      let pedidoDb = new PedidoModel(pedidos);
      let result = await pedidoDb.save();
      return result;
    } catch (err) {
      return err;
    }
  }
//----------------Actualizar Pedido -------------------------
  public async updatePedido(id: string, user: any) {
    let result = await PedidoModel.update({ _id: id }, { $set: user });
    return result;
  }
  //----------------Eliminar Pedido -------------------------
  public async deletePedido(idP: string) {
    try {
      var pedido: IPedidos = await PedidoModel.findOne({ _id: idP });
      if (pedido != null) {
        if (validarEliminacionPedido(pedido.registerdate)) {
          console.log(validarEliminacionPedido(pedido.registerdate));
          let result = await PedidoModel.remove({ _id: idP});
          return result;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (err) {
      return response.status(300).json({ serverResponse: err });
    }
  }

  //----------------Agregar Producto -------------------------
  public async addProduct(idPed: string, IdPro: string, Cant: number) {
    let pedido = await PedidoModel.findOne({ _id: idPed });
    if (pedido != null) {
      var pro = await ProductsModel.findOne({ _id: IdPro });
      if (pro != null && !isNaN(Cant)) {
        try {
          var cant = Cant;
          if (cant <= pro.stock) {
            var SimpleProducts: ISimpleProducts = {
              id: pro._id,
              name: pro.name,
              cantidad: cant,
              priceUnitary: pro.price,
              priceTotal: cant * pro.price,
              registerdate: new Date(),
            };
            pedido.products.push(SimpleProducts);
            return await pedido.save(); 
          } else {
            return response.status(300).json({ serverResponse: "Cantidad Limitada" });
          }
        } catch (err) {
          return response.status(300).json({ serverResponse: "Error  producto a;adido" });
        }
      }
      return null;
    }
    return null;
  }

  //----------------Actualizar el Producto Pedido -------------------------
  public async updateProductPedido(idPed: string, idProd: string,cant: number
  ) {
    let pedido = await PedidoModel.findOne({ _id: idPed });

    if (pedido != null && cant != null && !isNaN(cant)) {
      let newproducts: Array<ISimpleProducts> = pedido.products.filter(
        (item: ISimpleProducts) => {
          if (item.id.toString() == idProd.toString()) {
            return true;
          }

          return false;
        }
      );
      if (newproducts.length == 1) {
        newproducts[0].cantidad = cant;
        newproducts[0].registerdate = new Date();
        console.log(newproducts[0]);
        let oldproducts: Array<ISimpleProducts> = pedido.products.filter(
          (item: ISimpleProducts) => {
            if (item.id.toString() == idProd.toString()) {
              return false;
            }
            return true;
          }
        );
        console.log(oldproducts[0]);
        pedido.products = oldproducts;
        try {
          await pedido.save();
          pedido.products.push(newproducts[0]);
          return await pedido.save();
        } catch (err) {
          return err;
        }
      } else {
        return null;
      }
    }
    return null;
  }
//----------------Remover Productos -------------------------
  public async removeProducts(idPed: string, idProd: string) {
    let pedido = await PedidoModel.findOne({ _id: idPed });
    var product = await ProductsModel.findOne({ _id: idProd });
    if (pedido != null && product != null) {
      let newproducts: Array<ISimpleProducts> = pedido.products.filter(
        (item: ISimpleProducts) => {
          if (item.name == product.name) {
            return false;
          }
          return true;
        }
      );
      pedido.products = newproducts;
      try {
        return await pedido.save();
      } catch (err) {
        return err;
      }
    }
    return null;
  }
//---------------- Agregar Recibo -------------------------
  public async addRecibo(idUs: string, idCli: string, idPed: string) {
    let pedido = await PedidoModel.findOne({ _id: idPed });
    let cliente = await ClientsModel.findOne({ _id: idCli });
    let vendedor = await UserModel.findOne({ _id: idUs });
    if (pedido != null && cliente != null && vendedor != null) {
      var tot: number = 0;
      for (var i = 0; i < pedido.products.length; i++) {
        tot += pedido.products[i].priceTotal;
      }
      var newrecibo: any = {
        nameclient: cliente.firtsname + " " + cliente.lastname,
        namevendedor: vendedor.username,
        total: tot,
        registerdateRecibo: new Date(),
      };
      pedido.Recibo = newrecibo;
      try {
        return await pedido.save();
      } catch (err) {
        return err;
      }
    } else {
      return null;
    }
  }
}

export default BussinessPedidos;
