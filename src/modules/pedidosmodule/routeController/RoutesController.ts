import { Request, Response } from "express";
import BussinessPedidos from "../businessController/BussinessPedidos";
import BussinessClient from "../../clientsmodels/businessController/BussinessClients";
import isEmpty from "is-empty";
import path from "path";
import { IPedidos } from "../models/pedidos";
import sha1 from "sha1";

class RoutesController {
  //----------------- CReacion del Pedido ---------------------
  public async createPedido(req: Request, res: Response) {
    var pedidos: BussinessPedidos = new BussinessPedidos();

    var pedidoData = req.body;
    var PedidoD: IPedidos = pedidoData;

    let result = await pedidos.addPedidos(pedidoData);
    res.status(201).json({ serverResponse: result });
  }

  // -----------ver  Pedido creado ----------------------
  public async getPedido(req: Request, res: Response) {
    var pedido: BussinessPedidos = new BussinessPedidos();
    const result: Array<IPedidos> = await pedido.readPedido();
    res.status(200).json({ serverResponse: result });
  }
  // VER PEDIDO DE CLIENTE
  public async getPedidoClient(request: Request, response: Response) {
    var pedido: BussinessPedidos = new BussinessPedidos();
    var idC: string = request.params.idC;
    try {
      let result: Array<IPedidos> = await pedido.getPedidoClient(idC);
      return response.status(200).json({ serverResponse: result });
    } catch (err) {
      return response
        .status(300)
        .json({
          serverResponse:
            "Ocurrio un error o este pedido no tiene cliente asignado ",
        });
    }
  }

  //--------------- Actualizar Pedido -------------------------
  public async updatePedido(req: Request, res: Response) {
    var ped: BussinessPedidos = new BussinessPedidos();
    let id: string = req.params.id;
    var params = req.body;

    var result = await ped.updatePedido(id, params);
    res.status(201).json({ serverResponse: result });
    return;
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
        return res.status(300).json({
          serverResponse: "No se puede eliminar despues del limite de tiempo",
        });
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
      res.status(300).json({
        serverResponse:
          "No se definieron los id del pedido , producto, cantidad",
      });
      return;
    }
    try {
      var pedido: BussinessPedidos = new BussinessPedidos();
      var result = await pedido.addProduct(idPedido, idPro, parseInt(Cant));
      if (result == null) {
        res.status(300).json({
          serverResponse: " el pedido o producto o la cantidad esta incorrecta",
        });
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
