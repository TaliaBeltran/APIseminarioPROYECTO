import { Request, Response } from "express";
import BussinessClient from "../businessController/BussinessClients";
import BussinessReunion from "../businessController/BussinessReunion";
import { IClients } from "../models/Clients";
import { IReunion } from "../models/Agenda";
import { validacionfecha, validacionprob, validaciónhora } from "../validacion";
import isEmpty from "is-empty";
import path from "path";
import sha1 from "sha1";
import BussinessPedidos from "../../pedidosmodule/businessController/BussinessPedidos";

class RoutesController {
  // -------------- Crear Cliente -------------------
  public async createClient(req: Request, res: Response) {
    var client: BussinessClient = new BussinessClient();
    var clientData = req.body;
    var ClientD: IClients = clientData;
    ClientD["registerdate"] = new Date();
    let result = await client.addClient(ClientD);
    res.status(201).json({ serverResponse: result });
  }
  // -------------- Mostrar Cliente -------------------
  public async getClient(req: Request, res: Response) {
    let client: BussinessClient = new BussinessClient();
    try {
      let clientData: Array<IClients> = await client.readClients();
      res.status(200).json({ serverResponse: clientData });
    } catch (err) {
      return res.status(300).json({ serverResponse: err });
    }
  }

  // ------------ Mostrar cliente regular o potencial------------------------

  public async getClientRorP(request: Request, response: Response) {
    let client: BussinessClient = new BussinessClient();
    let tipo: string = request.params.tipo;
    let name: string = request.params.name;
    console.log(tipo);
    console.log(name);
    console.log("es cliente regular");
    try {
      if (tipo && (tipo == "Potencial" || tipo == "Regular")) {
        let clientData: Array<IClients> | IClients = await client.getClientRorP(
          name,
          tipo
        );
        response.status(200).json({ serverResponse: clientData });
      } else {
        return response
          .status(404)
          .json({ serverResponse: "Coloque tipo de cliente valido" });
      }
    } catch (err) {
      return response.status(300).json({ serverResponse: err });
    }
  }

  // -------------- Actualizar  Cliente -------------------
  public async updateClient(req: Request, res: Response) {
    var user: BussinessClient = new BussinessClient();
    let id: string = req.params.id;
    var params = req.body;
    try {
      var result = await user.updateClient(id, params);
      res.status(200).json({ serverResponse: result });
      return;
    } catch (err) {
      return res.status(300).json({ serverResponse: err });
    }
  }

  // -------------- Eliminar Cliente -------------------
  public async removeClients(req: Request, res: Response) {
    var user: BussinessClient = new BussinessClient();
    let id: string = req.params.id;
    try {
      let result = await user.deleteClients(id);
      res.status(200).json({ serverResponse: result });
    } catch (err) {
      res.status(404).json({ serverResponse: err });
    }
  }

  // -------------- Subir Foto-------------------
  public async uploadPortrait(req: Request, res: Response) {
    var id: string = req.params.id;
    try {
      if (!id) {
        res.status(300).json({ serverResponse: "Subir FOTO  mediante id" });
        return;
      }
      var client: BussinessClient = new BussinessClient();
      var clientToUpdate: IClients = await client.readClients(id);
      if (!clientToUpdate) {
        res
          .status(300)
          .json({ serverResponse: "El cliente no ha sido encontrado" });
        return;
      }
    } catch (err) {
      return res.status(300).json({ serverResponse: "Error" });
    }
    if (isEmpty(req.files)) {
      res.status(300).json({ serverResponse: "No existe imagen" });
      return;
    }
    var dir = `${__dirname}/../../../../avatarclientsfiles`;
    var absolutepath = path.resolve(dir);
    var files: any = req.files;
    var key: Array<string> = Object.keys(files);
    var copyDirectory = (totalpath: string, file: any) => {
      return new Promise((resolve, reject) => {
        file.mv(totalpath, (err: any, success: any) => {
          if (err) {
            resolve(false);
            return;
          }
          resolve(true);
          return;
        });
      });
    };
    var subidas: number = 0;
    var nosubidas: number = 0;
    function getFileExtension(filename: string) {
      return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined; //verificamos su extensión
    }
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      if (
        getFileExtension(file.name) === "jpg" ||
        getFileExtension(file.name) === "png" ||
        getFileExtension(file.name) === "jpeg"
      ) {
        var filehash: string = sha1(new Date().toString()).substr(0, 7);
        var newname: string = `${filehash}_${file.name}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);
        clientToUpdate.uriphoto = "/client/clientgetportrait/" + id;
        clientToUpdate.pathphoto = totalpath;
        try {
          var userResult: IClients = await clientToUpdate.save();
          res.status(201).json({ serverResponse: "Imagen subida" });
          subidas += 1;
        } catch (err) {
          return res.status(300).json({ serverResponse: err });
        }
      } else {
        nosubidas += 1;
      }
    }
    return res.status(200).json({
      serverResponse:
        "Petición finalizada, se subido " +
        subidas +
        " imagenes y " +
        nosubidas +
        " no se pudo subir porque no eran formato imagen",
    });
  }

  // -------------- Foto de los Cliente -------------------
  public async clientgetportrait(req: Request, res: Response) {
    var id: string = req.params.id;
    try {
      if (!id) {
        res
          .status(300)
          .json({ serverResponse: "No se puedo encontrar el identificador" });
        return;
      }

      var client: BussinessClient = new BussinessClient();
      var clientData: IClients = await client.readClients(id);
      if (!clientData) {
        res.status(300).json({ serverResponse: "Error no existe el cliente" });
        return;
      }
    } catch (err) {
      return res.status(300).json({ serverResponse: "Error" });
    }
    if (clientData.pathphoto == null) {
      res.status(300).json({ serverResponse: "No existe foto " });
      return;
    }
    res.sendFile(clientData.pathphoto);
  }

  //-----------------------Agendar Reunion ------------------------------
  public async createreunion(req: Request, res: Response) {
    try {
      var horario = req.body;
      var date: IReunion = horario;
      if (
        date.fecha != undefined ||
        date.hora != undefined ||
        date.fecha != null ||
        date.hora != null
      ) {
        if (validacionfecha(date.fecha) && validaciónhora(date.hora)) {
          var reunion: BussinessReunion = new BussinessReunion();
          var dates: any = { fecha: date.fecha, hora: date.hora };
          let result = await reunion.createReunion(dates);
          res.status(201).json({ serverResponse: result });
          return;
        } else {
          return res.status(300).json({ serverResponse: " Error de fecha " });
        }
      } else {
        return res.status(300).json({
          serverResponse: " La 0Fecha y hora son necesarios",
        });
      }
    } catch (err) {
      return res.status(300).json({ serverResponse: "Error" });
    }
  }

  // -------------- Mostrar Reuniones -------------------
  public async getreunion(req: Request, res: Response) {
    let reunion: BussinessReunion = new BussinessReunion();
    try {
      let reunionData: Array<IReunion> = await reunion.readReunion();
      res.status(200).json({ serverResponse: reunionData });
    } catch (err) {
      return res.status(300).json({ serverResponse: err });
    }
  }
  // ---------- muestra una sola reunion ---------

  public async getOnyReunion(request: Request, response: Response) {
    let reunion: BussinessReunion = new BussinessReunion();
    let idReu: string = request.params.idReu;
    let result = await reunion.readOnyReu(idReu);
    response.status(200).json({ serverResponse: result });
  }

  // -------------- Actualizar Reunion -------------------
  public async updateReunion(req: Request, res: Response) {
    var reunion: BussinessReunion = new BussinessReunion();
    let id: string = req.params.id;
    var params = req.body;

    try {
      var result = await reunion.updateReunion(id, params);
      res.status(200).json({ serverResponse: result });
      return;
    } catch (err) {
      return res.status(300).json({ serverResponse: err });
    }
  }

  // -------------- Eliminar Reunion -------------------
  public async deleteReunion(req: Request, res: Response) {
    var reunion: BussinessReunion = new BussinessReunion();
    let id: string = req.params.id;
    try {
      let result = await reunion.deleteReunion(id);
      res.status(200).json({ serverResponse: result });
    } catch (err) {
      res.status(404).json({ serverResponse: err });
    }
  }

  // -------------- Agregar una Reunion a un cliente -------------------
  public async addReunion(request: Request, response: Response) {
    let idCl: string = request.params.id;
    let idReu = request.body.idReu;
    if (idCl == null && idReu == null) {
      response.status(300).json({
        serverResponse: "No se definio id del cliente ni el id de la reunion",
      });
      return;
    }
    try {
      var reunion: BussinessReunion = new BussinessReunion();
      var result = await reunion.addReu(idCl, idReu);
      if (result == null) {
        response
          .status(300)
          .json({ serverResponse: "La reunion o cliente no existen" });
        return;
      } else {
        return response.status(200).json({ serverResponse: result });
      }
    } catch (err) {
      return response.status(300).json({ serverResponse: err });
    }
  }

  //------------ Eliminar una Reunion  a un cliente ---------
  public async removeReunion(req: Request, res: Response) {
    let reunion: BussinessReunion = new BussinessReunion();
    let idCl: string = req.params.id;
    let idReu: string = req.body.idReu;
    try {
      let result = await reunion.removeReu(idCl, idReu);
      let result1 = await reunion.deleteReunion(idReu);
      return res.status(200).json({ serverResponse: result, result1 });
    } catch (err) {
      return res.status(200).json({ serverResponse: err });
    }
  }

  //------------ Agregar Pedido a Cliente ---------
  public async addPedidoClients(req: Request, res: Response) {
    let idCl: string = req.params.id;
    let idPed = req.body.idPed;
    if (idCl == null && idPed == null) {
      res.status(300).json({
        serverResponse: "Id del cliente,  id del Pedido no fueron ingresados",
      });
      return;
    }
    try {
      var pedidoclient: BussinessClient = new BussinessClient();
      var result = await pedidoclient.addPed(idCl, idPed);
      if (result == null) {
        res
          .status(300)
          .json({ serverResponse: "El pedido o cliente no existen" });
        return;
      } else {
        return res.status(200).json({ serverResponse: result });
      }
    } catch (err) {
      return res.status(300).json({ serverResponse: err });
    }
  }
  //------------- Remove Pedido de Cliente ----------------------
  public async removePedidoClients(req: Request, res: Response) {
    let client: BussinessClient = new BussinessClient();
    let idCl: string = req.params.id;
    let idPed: string = req.body.idPed;
    try {
      let result = await client.removePed(idCl, idPed);

      return res.status(200).json({ serverResponse: result });
    } catch (err) {
      return res.status(200).json({ serverResponse: err });
    }
  }
}
export default RoutesController;
