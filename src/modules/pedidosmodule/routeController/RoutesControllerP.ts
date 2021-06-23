import { Request, Response } from "express";
import BussinessPedidos from "../businessController/BussinessPedidos";
import BussinessProducts from "../businessController/BussinessProducts";
import path from "path";
import { validacion, isValueOk } from "../validation";
import { IPedidos } from "../models/pedidos";
import { IProducts } from "../models/Products";
import isEmpty from "is-empty";
import sha1 from "sha1";
class RoutesControllerP {
  public async createProduct(request: Request, response: Response) {
    var product: BussinessProducts = new BussinessProducts();
    try {
      var productData = request.body;
      var ProductD: IProducts = productData;
      if (
        validacion(ProductD.name) &&
        isValueOk(ProductD.stock) &&
        isValueOk(ProductD.price)
      ) {
        if (ProductD.ofert != null) {
          if (!isValueOk(ProductD.ofert)) {
            return response.status(300).json({
              serverResponse: "Oferta invalida",
            });
          }
        }
        let result = await product.addProduct(ProductD);
        response.status(201).json({ serverResponse: result });
        return;
      } else {
        return response.status(300).json({
          serverResponse: "Verifique los valores",
        });
      }
    } catch (err) {
      return response.status(300).json({
        serverResponse: "Error",
      });
    }
  }

  public async getProduct(request: Request, response: Response) {
    var products: BussinessProducts = new BussinessProducts();
    const result: Array<IProducts> = await products.readProduct();
    response.status(200).json({ serverResponse: result });
  }

  public async updateProduct(request: Request, response: Response) {
    var pro: BussinessProducts = new BussinessProducts();
    let id: string = request.params.id;
    var params = request.body;
    try {
      if (params.name) {
        if (!validacion(params.name)) {
          return response
            .status(300)
            .json({ serverResponse: "Error en validacion name" });
        }
      }
      if (params.stock) {
        if (!validacion(params.stock)) {
          return response
            .status(300)
            .json({ serverResponse: "Error en validacion stock" });
        }
      }
      if (params.price) {
        if (!validacion(params.price)) {
          return response
            .status(300)
            .json({ serverResponse: "Error en validacion price" });
        }
      }
      if (params.ofert) {
        if (!validacion(params.ofert)) {
          return response
            .status(300)
            .json({ serverResponse: "Error en validacion ofert" });
        }
      }
      var result = await pro.updateProduct(id, params);
      return response.status(201).json({ serverResponse: result });
    } catch (err) {
      return response.status(300).json({ serverResponse: "Error" });
    }
  }

  public async deleteProduct(request: Request, response: Response) {
    var pro: BussinessProducts = new BussinessProducts();
    try {
      let id: string = request.params.id;
      let result = await pro.deleteProducts(id);
      response.status(200).json({ serverResponse: result });
      return;
    } catch (err) {
      return response.status(200).json({ serverResponse: "Error" });
    }
  }

  public async uploadimage(request: Request, response: Response) {
    var id: string = request.params.id;
    try {
      if (!id) {
        response
          .status(300)
          .json({ serverResponse: "El id es necesario para subir una foto" });
        return;
      }
      var product: BussinessProducts = new BussinessProducts();
      var productToUpdate: IProducts = await product.readProduct(id);
      if (!productToUpdate) {
        response.status(300).json({ serverResponse: "El producto no existe!" });
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
    var dir = `${__dirname}/../../../../avatarproductfiles`;
    var absolutepath = path.resolve(dir);
    var files: any = request.files;

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

        productToUpdate.uriimage = "/pedido/getimageProduct/" + id;
        productToUpdate.pathavathar = totalpath;
        try {
          var userResult: IProducts = await productToUpdate.save();
        } catch (err) {
          return response.status(300).json({ serverResponse: err });
        }

        subidas += 1;
      } else {
        nosubidas += 1;
      }
    }
    return response.status(200).json({
      serverResponse:
        "Imagenes subidas: " + subidas + ", imagenes no subidas: " + nosubidas,
    });
  }

  public async getimageProduct(request: Request, response: Response) {
    var id: string = request.params.id;
    try {
      if (!id) {
        response
          .status(300)
          .json({ serverResponse: "Identificador no encontrado" });
        return;
      }

      var product: BussinessProducts = new BussinessProducts();
      var productData: IProducts = await product.readProduct(id);

      if (!productData) {
        response
          .status(300)
          .json({ serverResponse: "Error no existe el producto" });
        return;
      }
    } catch (err) {
      return response.status(300).json({ serverResponse: "Hubo algun error" });
    }
    if (productData.pathavathar == null) {
      response.status(300).json({ serverResponse: "No existe portrait " });
      return;
    }
    response.sendFile(productData.pathavathar);
  }
}

export default RoutesControllerP;
