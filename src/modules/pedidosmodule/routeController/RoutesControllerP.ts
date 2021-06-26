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
  //------------- Crear Producto --------------
  
  public async createProduct(req: Request, res: Response) {
    var product: BussinessProducts = new BussinessProducts();
    let ProductD: string = req.params.ProductD;
    try {
      
        let result = await product.readProduct(ProductD); // MODIFICADO___ quitamos createProduc xk salia  rror
        res.status(201).json({ serverResponse: result });
       
    } catch (err) {
      return res.status(300).json({ serverResponse: "Error" });
    }
  }
// ----------------------- Obtener Producto ------------------
  public async getProduct(req: Request, res: Response) {
    var products: BussinessProducts = new BussinessProducts();
    const result: Array<IProducts> = await products.readProduct();
    res.status(200).json({ serverResponse: result });
  }
//----------------- Actualizar Producto ------------------------
  public async updateProduct(req: Request, res: Response) {
    var pro: BussinessProducts = new BussinessProducts();
    let id: string = req.params.id;
    var params = req.body;
    try {
      if (params.name) {
        if (!validacion(params.name)) {
          return res.status(300).json({ serverResponse: "Error en validacion nombre" });
        }
      }
      if (params.stock) {
        if (!validacion(params.stock)) {
          return res.status(300).json({ serverResponse: "Error en validacion stock" });
        }
      }
      if (params.price) {
        if (!validacion(params.price)) {
          return res.status(300).json({ serverResponse: "Error en validacion precio" });
        }
      }
      if (params.ofert) {
        if (!validacion(params.ofert)) {
          return res.status(300).json({ serverResponse: "Error en validacion oferta" });
        }
      }
      var result = await pro.updateProduct(id, params);
      return res.status(201).json({ serverResponse: result });
    } catch (err) {
      return res.status(300).json({ serverResponse: "Error" });
    }
  }
//--------------- Eliminar Producto -----------------------
  public async deleteProduct(req: Request, res: Response) {
    var pro: BussinessProducts = new BussinessProducts();
    try {
      let id: string = req.params.id;
      let result = await pro.deleteProducts(id);
      res.status(200).json({ serverResponse: result });
      return;
    } catch (err) {
      return res.status(200).json({ serverResponse: "Error" });
    }
  }
//--------------------------Actualizar Imagen ------------------
  public async uploadimage(req: Request, res: Response) {
    var id: string = req.params.id;
    try {
      if (!id) {
        res.status(300).json({ serverResponse: "El id es necesario para subir foto" });
        return;
      }
      var product: BussinessProducts = new BussinessProducts();
      var productToUpdate: IProducts = await product.readProduct(id);
      if (!productToUpdate) {
        res.status(300).json({ serverResponse: "El producto no existe" });
        return;
      }
    } catch (err) {
      return res
        .status(300)
        .json({ serverResponse: "Hubo algun error intente de nuevo" });
    }
    if (isEmpty(req.files)) {
      res.status(300) .json({ serverResponse: "No existe archivo adjunto" });
      return;
    }
    var dir = `${__dirname}/../../../../avatarproductfiles`;
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
      return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined; 
    }
    for (var i = 0; i < key.length; i++) {
      var file: any = files[key[i]];
      if (
        getFileExtension(file.name) === "jpg" || getFileExtension(file.name) === "png" ||
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
          return res.status(300).json({ serverResponse: err });
        }
        subidas += 1;
      } else {
        nosubidas += 1;
      }
    }
    return res.status(200).json({ serverResponse:
        "Imagen subida: " + subidas + ", imagen no subida: " + nosubidas});
  }
//---------------- Obtener el Imagen de Producto ------------------------
  public async getimageProduct(req: Request, res: Response) {
    var id: string = req.params.id;
    try {
      if (!id) {
        res.status(300).json({ serverResponse: "Identificador no encontrado" });
        return;
      }

      var product: BussinessProducts = new BussinessProducts();
      var productData: IProducts = await product.readProduct(id);

      if (!productData) {
        res.status(300) .json({ serverResponse: "Error del producto no existe" });
        return;
      }
    } catch (err) {
      return res.status(300).json({ serverResponse: "Error" });
    }
    if (productData.pathavathar == null) {
      res.status(300).json({ serverResponse: "No existe portrait " });
      return;
    }
    res.sendFile(productData.pathavathar);
  }
}

export default RoutesControllerP;
