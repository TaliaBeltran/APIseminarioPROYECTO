import { Request, Response } from "express";
import BussinessPedidos from "../businessController/BussinessPedidos";

class RoutesControllerR {
  public async addReciboPedido(request: Request, response: Response) {
    let pedido: BussinessPedidos = new BussinessPedidos();
    let idUs: string = request.params.idUs;
    let idCli: string = request.params.idCli;
    let idPed: string = request.params.idPed;
    try {
      var result = await pedido.addRecibo(idUs, idCli, idPed);
      return response.status(201).json({ serverResponse: result });
    } catch (err) {
      return response.status(300).json({ serverResponse: "Error" });
    }
  }
}

export default RoutesControllerR;
