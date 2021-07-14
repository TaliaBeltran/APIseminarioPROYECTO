import { response } from "express";
import ProductsModel, { IProducts } from "../models/Products";

class BussinessProducts {
  constructor() {}
  //------------- Agrgar Producto -------------------
  public async addProduct(pedidos: IProducts) {
    try {
      let productDB = new ProductsModel(pedidos);
      let result = await productDB.save();
      return result;
    } catch (err) {
      return err;
    }
  }
  //---------------- Leer Productos ------------
  public async readProduct(): Promise<Array<IProducts>>;
  public async readProduct(id: string): Promise<IProducts>;
  public async readProduct(
    query: any,
    skip: number,
    limit: number
  ): Promise<Array<IProducts>>;
  public async readProduct(
    params1?: string | any,
    params2?: number,
    params3?: number
  ): Promise<Array<IProducts> | IProducts> {
    if (params1 && typeof params1 == "string") {
      var result: IProducts = await ProductsModel.findOne({ _id: params1 });
      return result;
    } else if (params1) {
      let skip = params2 ? params2 : 0;
      let limit = params3 ? params3 : 1;
      let listproducts: Array<IProducts> = await ProductsModel.find(params1)
        .skip(skip)
        .limit(limit);
      return listproducts;
    } else {
      let listproducts: Array<IProducts> = await ProductsModel.find();
      return listproducts;
    }
  }
  // --------------- Actualizar Producto
  public async updateProduct(id: string, pro: any) {
    try {
      let result = await ProductsModel.update({ _id: id }, { $set: pro });
      return result;
    } catch (err) {
      return response
        .status(300)
        .json({ serverResponse: "Error al actualizar el Producto" });
    }
  }
  //--------------- Eliminar Producto ------------------
  public async deleteProducts(id: string) {
    try {
      let result = await ProductsModel.remove({ _id: id });
      return result;
    } catch (err) {
      return response
        .status(300)
        .json({ serverResponse: "Error al eliminar Producto" });
    }
  }
}

export default BussinessProducts;
