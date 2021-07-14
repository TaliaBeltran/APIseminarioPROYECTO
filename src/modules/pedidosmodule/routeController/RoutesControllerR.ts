import { Request, Response } from "express";
import BussinessPedidos from "../businessController/BussinessPedidos";

class RoutesControllerR {
  // ------------- Agregar el Recibo del Pedido -----------------

  public async addReciboPedido(req: Request, res: Response) {
    let pedido: BussinessPedidos = new BussinessPedidos();
    let idUs: string = req.params.idUs;
    let idCli: string = req.params.idCli;
    let idPed: string = req.params.idPed;
    try {
      var result = await pedido.addRecibo(idUs, idCli, idPed);
      return res.status(201).json({ serverResponse: result });
    } catch (err) {
      return res.status(300).json({ serverResponse: "--- Error ---" });
    }
  }
}

export default RoutesControllerR;
