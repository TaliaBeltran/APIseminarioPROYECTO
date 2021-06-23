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
  public async createPedido(request: Request, response: Response) {
    var pedidos: BussinessPedidos = new BussinessPedidos();
    try {
      var pedidoData = request.body;
      var PedidoD: IPedidos = pedidoData;

      if (validacionOrdenarP(PedidoD.ordenarP)) {
        if (PedidoD.methodpay.toLowerCase() === "cuenta bancaria") {
          if (PedidoD.cuentaBancaria) {
            pedidoData["cuentaBancaria"] = sha1(pedidoData["cuentaBancaria"]);
            let result = await pedidos.addPedidos(pedidoData);
            response.status(201).json({ serverResponse: result });
            return;
          } else {
            return response
              .status(300)
              .json({ serverResponse: "Es necesario el numero de cuenta" });
          }
        } else if (PedidoD.methodpay.toLowerCase() === "efectivo") {
          let result = await pedidos.addPedidos(pedidoData);
          response.status(201).json({ serverResponse: result });
          return;
        } else {
          return response.status(300).json({
            serverResponse:
              "Introduzca valores correctos en el parametro methodpay",
          });
        }
      } else {
        return response.status(201).json({
          serverResponse:
            /*result */ "Introduzca valores correctos en el parametro ordenarP",
        });
      }
    } catch (err) {
      return response.status(300).json({
        serverResponse: "Error",
      });
    }
  }

  public async getPedido(request: Request, response: Response) {
    var pedido: BussinessPedidos = new BussinessPedidos();
    const result: Array<IPedidos> = await pedido.readPedido();
    response.status(200).json({ serverResponse: result });
  }

  public async updatePedido(request: Request, response: Response) {
    var ped: BussinessPedidos = new BussinessPedidos();
    let id: string = request.params.id;
    var params = request.body;

    try {
      if (params.ordenarP) {
        if (validacionOrdenarP(params.ordenarP)) {
          if (params.methodpay) {
            if (params.methodpay.toLowerCase() == "cuenta bancaria") {
              if (params.cuentaBancaria) {
                params.cuentaBancaria = sha1(params.cuentaBancaria);
                var result = await ped.updatePedido(id, params);
                return response.status(201).json({ serverResponse: result });
              } else {
                return response
                  .status(200)
                  .json({ serverResponse: "Es necesario cuenta bancaria" });
              }
            } else if (params.methodpay.toLowerCase() === "efectivo") {
              var result = await ped.updatePedido(id, params);
              response.status(200).json({ serverResponse: result });
              return;
            } else {
              return response.status(200).json({
                serverResponse:
                  "Introduzca valores correctos en el parametro methodpay",
              });
            }
          } else {
            var result = await ped.updatePedido(id, params);
            return response.status(201).json({ serverResponse: result });
          }
        } else {
          return response.status(300).json({
            serverResponse:
              "Introduzca valores correctos en el parametro ordenarP",
          });
        }
      } else {
        if (params.methodpay) {
          if (params.methodpay.toLowerCase() == "cuenta bancaria") {
            if (params.cuentaBancaria) {
              params.cuentaBancaria = sha1(params.cuentaBancaria);
              var result = await ped.updatePedido(id, params);
              response.status(201).json({ serverResponse: result });
              return;
            } else {
              return response
                .status(200)
                .json({ serverResponse: "Es necesario cuenta bancaria" });
            }
          } else if (params.methodpay.toLowerCase() === "efectivo") {
            var result = await ped.updatePedido(id, params);
            response.status(200).json({ serverResponse: result });
            return;
          } else {
            return response.status(200).json({
              serverResponse:
                "Introduzca valores correctos en el parametro methodpay",
            });
          }
        } else {
          var result = await ped.updatePedido(id, params);
          return response.status(201).json({ serverResponse: result });
        }
      }
    } catch (err) {
      return response.status(300).json({ serverResponse: err });
    }
  }

  public async deletePedido(request: Request, response: Response) {
    var pedido: BussinessPedidos = new BussinessPedidos();
    try {
      let id: string = request.params.id;
      let result = await pedido.deletePedido(id);
      if (result != null) {
        response.status(200).json({ serverResponse: result });
        return;
      } else {
        return response.status(300).json({
          serverResponse:
            "No se puede eliminar porque paso el limite de tiempo",
        });
      }
    } catch (err) {
      return response.status(200).json({ serverResponse: err });
    }
  }

  public async addProduct(request: Request, response: Response) {
    let idPedido: string = request.params.id;
    let Cant = request.params.cant;
    let idPro = request.body.idPro;

    if (idPedido == null && idPro == null && Cant == null) {
      response.status(300).json({
        serverResponse:
          "No se definio id de pedido ni el id del producto, ni la cantidad",
      });
      return;
    }
    try {
      var pedido: BussinessPedidos = new BussinessPedidos();
      var result = await pedido.addProduct(idPedido, idPro, parseInt(Cant));
      if (result == null) {
        response.status(300).json({
          serverResponse:
            "El pedido o producto no existen o la cantidad definida no es correcta",
        });
        return;
      }
      return response.status(200).json({ serverResponse: result });
    } catch (err) {
      return response.status(200).json({ serverResponse: err });
    }
  }

  public async updateProductPedido(request: Request, response: Response) {
    let pedido: BussinessPedidos = new BussinessPedidos();
    try {
      let idPe: string = request.params.id;
      let idPro: string = request.body.idPro;
      let Can: string = request.body.Cantidad;
      //console.log("aquii" + idPe + " " + idPro + " " + Can);
      let result = await pedido.updateProductPedido(idPe, idPro, parseInt(Can));
      return response.status(200).json({ serverResponse: result });
    } catch (err) {
      return response.status(200).json({ serverResponse: err });
    }
  }

  public async removeProduct(request: Request, response: Response) {
    let pedido: BussinessPedidos = new BussinessPedidos();
    try {
      let idPe: string = request.params.id;
      let idPro: string = request.body.idPro;
      let result = await pedido.removeProducts(idPe, idPro);
      return response.status(200).json({ serverResponse: result });
    } catch (err) {
      return response.status(200).json({ serverResponse: err });
    }
  }
}

export default RoutesController;
