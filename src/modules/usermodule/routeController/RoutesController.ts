import { Request, Response } from "express";
import BusinessUser from "../businessController/BusinessUser";
import BussinessRoles from "../businessController/BussinessRoles";
import BussinessClient from "../../clientsmodels/businessController/BussinessClients";
import sha1 from "sha1";
import jsonwebtoken from "jsonwebtoken";
import { ISimpleUser, IUser } from "../models/Users";
import isEmpty from "is-empty";
import path from "path";
import validator from "validator";
import { validacion } from "../validation";
import { IRoles } from "../models/Roles";

interface Icredentials {
  email: string;
  password: string;
  username: string;
}
class RoutesController {
  constructor() {}
  public async login(request: Request, response: Response) {
    var credentials: Icredentials = request.body;
    if (credentials.email == undefined && credentials.username == undefined) {
      response.status(300).json({
        serverResponse:
          "Es necesario el parámetro de email o nombre de usuario",
      });
      return;
    }
    if (credentials.password == undefined) {
      response
        .status(300)
        .json({ serverResponse: "Es necesario el parámetro de password" });
      return;
    }
    credentials.password = sha1(credentials.password);
    const user: BusinessUser = new BusinessUser();
    let result: Array<IUser> = await user.readUsers(credentials, 0, 1);
    if (result.length == 1) {
      var loginUser: IUser = result[0];
      var token: string = jsonwebtoken.sign(
        { id: loginUser._id, email: loginUser.email },
        "secret",
        {
          expiresIn: 60 * 60 * 24, // expires in 24 hours
        }
      );
      var refreshtoken: string = jsonwebtoken.sign(
        { id: loginUser._id, email: loginUser.email },
        "secret123",
        {
          expiresIn: 60 * 60 * 24, // expires in 24 hours
        }
      );
      response.status(200).json({
        serverResponse: {
          tipo: loginUser.tipo,
          username: loginUser.username,
          token,
          refreshtoken,
        },
      });
      return;
    }
    response.status(200).json({ serverResponse: "Credenciales incorrectas" });
  }

  //----- refrescacion de token
  public async refreshToken(request: Request, response: Response) {
    const refreshToken = request.headers.refresh as string;

    if (!refreshToken) {
      response
        .status(400)
        .json({ serverResponse: "Error no hay refreshtoken" });
    }
    var user: BusinessUser = new BusinessUser();
    var userData: IUser;
    try {
      const verifyResult = jsonwebtoken.verify(refreshToken, "secret123");
      userData = verifyResult as IUser;
      let result = await user.readUsers(userData.id);
    } catch (err) {
      response.status(400).json({ serverResponse: err });
    }
    var token: string = jsonwebtoken.sign(
      { id: userData._id, email: userData.email },
      "secret",
      {
        expiresIn: 60 * 60 * 24, // expires in 24 hours
      }
    );
    response.json({ serverResponse: "Todo Ok", token });
  }

  public async createUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    var userData = request.body;
    var USerD: IUser = userData;

    if (
      validator.isEmail(request.body.email) &&
      validacion(request.body.username)
    ) {
      userData["registerdate"] = new Date();
      userData["password"] = sha1(userData["password"]);

      let result = await user.addUsers(userData);
      response.status(201).json({ serverResponse: result });
      return;
    } else {
      return response.status(201).json({
        serverResponse:
          /*result*/ "Intruduzca email y nombre de usuario correcto",
      });
    }
  }
  public async getUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    const result: Array<IUser> = await user.readUsers();
    response.status(200).json({ serverResponse: result });
  }
  public async updateUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    let id: string = request.params.id;
    var params = request.body;
    if (params.email) {
      if (!validator.isEmail(request.body.email)) {
        return response.status(201).json({
          serverResponse:
            /*result*/ "Intruduzca email y nombre de usuario correcto",
        });
      }
    }
    if (params.username) {
      if (!validacion(request.body.username)) {
        return response.status(201).json({
          serverResponse:
            /*result*/ "Intruduzca email y nombre de usuario correcto",
        });
      }
    }
    if (params.password) {
      params.password = sha1(params.password);
    }
    if (params.tipo) {
      return response
        .status(300)
        .json({ serverResponse: "No se puede modificar el tipo de usuario" });
    }

    var result = await user.updateUsers(id, params);
    response.status(200).json({ serverResponse: result });
    return;
  }
  public async removeUsers(request: Request, response: Response) {
    var user: BusinessUser = new BusinessUser();
    let id: string = request.params.id;
    let result = await user.deleteUsers(id);
    response.status(200).json({ serverResponse: result });
  }
  public async addRol(request: Request, response: Response) {
    let idUs: string = request.params.id;
    let idRol = request.body.idRol;
    if (idUs == null && idRol == null) {
      response.status(300).json({
        serverResponse: "No se definio id de usuario ni el id del rol",
      });
      return;
    }
    var user: BusinessUser = new BusinessUser();
    var result = await user.addRol(idUs, idRol);
    if (result == null) {
      response
        .status(300)
        .json({ serverResponse: "El rol o usuario no existen" });
      return;
    }
    response.status(200).json({ serverResponse: result });
  }
  public async createRol(request: Request, response: Response) {
    let roles: BussinessRoles = new BussinessRoles();
    var rolesData: any = request.body;
    let result = await roles.createRol(rolesData);
    if (result == null) {
      response
        .status(300)
        .json({ serverResponse: "El rol tiene parametros no validos" });
      return;
    }
    response.status(201).json({ serverResponse: result });
  }
  public async getRol(request: Request, response: Response) {
    let roles: BussinessRoles = new BussinessRoles();
    let rolesData: Array<IRoles> = await roles.readRoles();
    response.status(200).json({ serverResponse: rolesData });
  }

  public async removeRol(request: Request, response: Response) {
    let roles: BussinessRoles = new BussinessRoles();
    let idRol: string = request.params.id;
    let result = await roles.deleteRol(idRol);
    response.status(201).json({ serverResponse: result });
  }
  public async removeUserRol(request: Request, response: Response) {
    let roles: BusinessUser = new BusinessUser();
    let idUs: string = request.params.id;
    let idRol: string = request.body.idRol;
    let result = await roles.removeRol(idUs, idRol);
    response.status(200).json({ serverResponse: result });
  }

  public async uploadPortrait(request: Request, response: Response) {
    var id: string = request.params.id;
    try {
      if (!id) {
        response
          .status(300)
          .json({ serverResponse: "El id es necesario para subir una foto" });
        return;
      }
      var user: BusinessUser = new BusinessUser();
      var userToUpdate: IUser = await user.readUsers(id);
      if (!userToUpdate) {
        response.status(300).json({ serverResponse: "El usuario no existe!" });
        return;
      }
    } catch (err) {
      return response
        .status(300)
        .json({ serverResponse: "Hubo algun error intente de nuevo" });
    }
    if (isEmpty(request.files)) {
      response
        .status(300)
        .json({ serverResponse: "No existe un archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../avatarfiles`;
    var absolutepath = path.resolve(dir);
    var files: any = request.files;
    /*var file: any = files.portrait;
    if (!file) {
      response.status(300).json({
        serverResponse:
          "error el archivo debe ser subido con el parametro portrait!",
      });
      return;
    }*/
    var key: Array<string> = Object.keys(files);
    /**/
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
        getFileExtension(file.name) === "gif" ||
        getFileExtension(file.name) === "jpeg"
      ) {
        var filehash: string = sha1(new Date().toString()).substr(0, 7);
        var newname: string = `${filehash}_${file.name}`;
        var totalpath = `${absolutepath}/${newname}`;
        await copyDirectory(totalpath, file);

        userToUpdate.uriavatar = "/api/getportrait/" + id;
        userToUpdate.pathavatar = totalpath;
        try {
          var userResult: IUser = await userToUpdate.save();
        } catch (err) {
          return response.status(300).json({ serverResponse: err });
        }
        var simpleUser: ISimpleUser = {
          username: userResult.username,
          uriavatar: userResult.uriavatar,
          pathavatar: userResult.pathavatar,
        };
        response.status(300).json({ serverResponse: simpleUser });
        subidas += 1;
      } else {
        nosubidas += 1;
      }

      /*file.mv(totalpath, async (err: any, success: any) => {
      if (err) {
        response
          .status(300)
          .json({ serverResponse: "No se pudo almacenar el archivo" });
        return;
      }

      userToUpdate.uriavatar = "/api/getportrait/" + id;
      userToUpdate.pathavatar = totalpath;
      var userResult: IUser = await userToUpdate.save();
      var simpleUser: ISimpleUser = {
        username: userResult.username,
        uriavatar: userResult.uriavatar,
        pathavatar: userResult.pathavatar,
      };
      response.status(300).json({ serverResponse: simpleUser });
    });*/
    }
  }

  public async getPortrait(request: Request, response: Response) {
    var id: string = request.params.id;
    try {
      if (!id) {
        response
          .status(300)
          .json({ serverResponse: "Identificador no encontrado" });
        return;
      }
      var user: BusinessUser = new BusinessUser();
      var userData: IUser = await user.readUsers(id);
      if (!userData) {
        response.status(300).json({ serverResponse: "Error " });
        return;
      }
    } catch (err) {
      return response.status(300).json({ serverResponse: "Hubo algun error" });
    }
    if (userData.pathavatar == null) {
      response.status(300).json({ serverResponse: "No existe portrait " });
      return;
    }
    response.sendFile(userData.pathavatar);
  }

  public async addClient(request: Request, response: Response) {
    let idUs: string = request.params.id;
    let idCli = request.body.idCli;
    if (idUs == null && idCli == null) {
      response.status(300).json({
        serverResponse: "No se definio id de usuario ni el id del cliente",
      });
      return;
    }
    try {
      var user: BusinessUser = new BusinessUser();
      var result = await user.addClient(idUs, idCli);

      if (result == null) {
        response
          .status(300)
          .json({ serverResponse: "El cliente o usuario no existen" });
        return;
      } else {
        return response.status(200).json({ serverResponse: result });
      }
    } catch (err) {
      return response.status(200).json({ serverResponse: err });
    }
  }

  public async removeClient(request: Request, response: Response) {
    let user: BusinessUser = new BusinessUser();
    let client: BussinessClient = new BussinessClient();
    let idUs: string = request.params.id;
    let idCli: string = request.body.idCli;
    try {
      let result = await user.removeClient(idUs, idCli);
      let result1 = await client.deleteClients(idCli); //ojo preguntar si esta bien, esto hace que si borramos un cliente desde el usuario el cliente totalmente se borra
      return response.status(200).json({ serverResponse: result, result1 });
    } catch (err) {
      return response.status(300).json({ serverResponse: err });
    }
  }
}
export default RoutesController;
