import { Request, Response } from "express";
import BussinessPedidos from "../businessController/BussinessPedidos";
import BussinessClient from "../../clientsmodels/businessController/BussinessClients";
import isEmpty from "is-empty";
import path from "path";
import validator from "validator";
import { validacionOrdenarP } from "../validation";
import { IPedidos } from "../models/pedidos";
import sha1 from "sha1";

class RoutesController {
  //----------------- CReacion del Pedido ---------------------
  public async createPedido(req: Request, res: Response) {
    var pedidos: BussinessPedidos = new BussinessPedidos();
    try {
      var pedidoData = req.body;
      var PedidoD: IPedidos = pedidoData;

      if (validacionOrdenarP(PedidoD.ordenarP)) {
        if (PedidoD.methodpay.toLowerCase() === "cuenta bancaria") {
          if (PedidoD.cuentaBancaria) {
            pedidoData["cuentaBancaria"] = sha1(pedidoData["cuentaBancaria"]);
            let result = await pedidos.addPedidos(pedidoData);
            res.status(201).json({ serverResponse: result });
            return;
          } else {
            return res.status(300).json({ serverResponse: "Es necesario el Cuenta Bancaria" });
          }
        } else if (PedidoD.methodpay.toLowerCase() === "efectivo") {
          let result = await pedidos.addPedidos(pedidoData);
          res.status(201).json({ serverResponse: result });
          return;
        } else {
          return res.status(300).json({serverResponse:"Introduzca valores correctos"});
        }
      } else {
        return res.status(201).json({serverResponse: "Introduzca valores correctos al ordenar"});
      }
    } catch (err) {
      return res.status(300).json({
        serverResponse: "Error",
      });
    }
  }

  // -----------Agregar Pedido ----------------------
  public async getPedido(req: Request, res: Response) {
    var pedido: BussinessPedidos = new BussinessPedidos();
    const result: Array<IPedidos> = await pedido.readPedido();
    res.status(200).json({ serverResponse: result });
  }
//--------------- Actualizar Pedido -------------------------
  public async updatePedido(req: Request, res: Response) {
    var ped: BussinessPedidos = new BussinessPedidos();
    let id: string = req.params.id;
    var params = req.body;

    try {
      if (params.ordenarP) {
        if (validacionOrdenarP(params.ordenarP)) {
          if (params.methodpay) {
            if (params.methodpay.toLowerCase() == "cuenta bancaria") {
              if (params.cuentaBancaria) {
                params.cuentaBancaria = sha1(params.cuentaBancaria);
                var result = await ped.updatePedido(id, params);
                return res.status(201).json({ serverResponse: result });
              } else {
                return res
                  .status(200)
                  .json({ serverResponse: "Es necesario cuenta bancaria" });
              }
            } else if (params.methodpay.toLowerCase() === "efectivo") {
              var result = await ped.updatePedido(id, params);
              res.status(200).json({ serverResponse: result });
              return;
            } else {
              return res.status(200).json({serverResponse:"Introduzca valores correctos en el metodo de pago"});
            }
          } else {
            var result = await ped.updatePedido(id, params);
            return res.status(201).json({ serverResponse: result });
          }
        } else {
          return res.status(300).json({serverResponse:"Introduzca valores correctos al Ordenar"});
        }
      } else {
        if (params.methodpay) {
          if (params.methodpay.toLowerCase() == "cuenta bancaria") {
            if (params.cuentaBancaria) {
              params.cuentaBancaria = sha1(params.cuentaBancaria);
              var result = await ped.updatePedido(id, params);
              res.status(201).json({ serverResponse: result });
              return;
            } else {
              return res.status(200).json({ serverResponse: "Es necesario cuenta bancaria" });
            }
          } else if (params.methodpay.toLowerCase() === "efectivo") {
            var result = await ped.updatePedido(id, params);
            res.status(200).json({ serverResponse: result });
            return;
          } else {
            return res.status(200).json({serverResponse:"Introduzca valores correctos en el metodo de pago"});
          }
        } else {
          var result = await ped.updatePedido(id, params);
          return res.status(201).json({ serverResponse: result });
        }
      }
    } catch (err) {
      return res.status(300).json({ serverResponse: err });
    }
  }
// ----------------- Eliminar Pedido ---------------------
  public async deletePedido(req: Request, res: Response) {
    var pedido: BussinessPedidos = new BussinessPedidos();
    try {
      let id: string = req.params.id;
      let result = await pedido.deletePedido(id);
      if (result != null) {
        res.status(200).json({ serverResponse: result });
        return;
      } else {
        return res.status(300).json({serverResponse:
            "No se puede eliminar despues del limite de tiempo"});
      }
    } catch (err) {
      return res.status(200).json({ serverResponse: err });
    }
  }
//---------------- Agregar Producto ---------------
  public async addProduct(req: Request, res: Response) {
    let idPedido: string = req.params.id;
    let Cant = req.params.cant;
    let idPro = req.body.idPro;

    if (idPedido == null && idPro == null && Cant == null) {
      res.status(300).json({ serverResponse:"No se definieron los id del pedido , producto, cantidad"});
      return;
    }
    try {
      var pedido: BussinessPedidos = new BussinessPedidos();
      var result = await pedido.addProduct(idPedido, idPro, parseInt(Cant));
      if (result == null) {
        res.status(300).json({serverResponse:"El existe el pedido o producto o la cantidad esta incorrecta"});
        return;
      }
      return res.status(200).json({ serverResponse: result });
    } catch (err) {
      return res.status(200).json({ serverResponse: err });
    }
  }
// -------------- Actualizar el Producto del Pedido -----------------
  public async updateProductPedido(req: Request, res: Response) {
    let pedido: BussinessPedidos = new BussinessPedidos();
    try {
      let idPe: string = req.params.id;
      let idPro: string = req.body.idPro;
      let Can: string = req.body.Cantidad;
      let result = await pedido.updateProductPedido(idPe, idPro, parseInt(Can));
      return res.status(200).json({ serverResponse: result });
    } catch (err) {
      return res.status(200).json({ serverResponse: err });
    }
  }
//------------------- Remover Producto ----------------------
  public async removeProduct(req: Request, res: Response) {
    let pedido: BussinessPedidos = new BussinessPedidos();
    try {
      let idPe: string = req.params.id;
      let idPro: string = req.body.idPro;
      let result = await pedido.removeProducts(idPe, idPro);
      return res.status(200).json({ serverResponse: result });
    } catch (err) {
      return res.status(200).json({ serverResponse: err });
    }
  }
}

export default RoutesController;
