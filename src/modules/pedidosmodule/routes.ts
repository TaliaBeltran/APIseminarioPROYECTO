import RoutesController from "./routeController/RoutesController";
import RoutesControllerP from "./routeController/RoutesControllerP";
import RoutesControllerR from "./routeController/RoutesControllerR";
import { Express } from "express";

class Routes {
  private routesController: RoutesController;
  private routesControllerP: RoutesControllerP;
  private routesControllerR: RoutesControllerR;
  private routeparent: string;
  constructor(routeparent: string, app: Express) {
    this.routesController = new RoutesController();
    this.routesControllerP = new RoutesControllerP();
    this.routesControllerR = new RoutesControllerR();
    this.routeparent = routeparent;
    this.configureRoutes(app);
  }
  private configureRoutes(app: Express) {
    //-------------RUtas del Pedido -----------------------
    app
      .route(`${this.routeparent}/pedidos`)
      .post(this.routesController.createPedido); // Crear Pedido

    app
      .route(`${this.routeparent}/pedidos`)
      .get(this.routesController.getPedido); // Obtener Pedido

    app
      .route(`${this.routeparent}/pedidos/:idC`)
      .get(this.routesController.getPedidoClient);

    app
      .route(`${this.routeparent}/pedidos/:id`)
      .put(this.routesController.updatePedido); //  Actualizar Pedido

    app
      .route(`${this.routeparent}/pedidos/:id`)
      .delete(this.routesController.deletePedido); // Eliminar Pedido

    app
      .route(`${this.routeparent}/addProduct/:id/:cant`)
      .put(this.routesController.addProduct); // Agregar Producto

    app
      .route(`${this.routeparent}/updateProductPedido/:id`)
      .put(this.routesController.updateProductPedido); // Actualizar el Pedido de Producto

    app
      .route(`${this.routeparent}/removeProduct/:id`)
      .put(this.routesController.removeProduct); // Elimar Producto

    //-----------Rutas del Productos ------------------------

    app
      .route(`${this.routeparent}/producto`)
      .post(this.routesControllerP.createProduct); // Crear Producto

    app
      .route(`${this.routeparent}/producto`)
      .get(this.routesControllerP.getProduct); // Obtener Producto

    app
      .route(`${this.routeparent}/producto/:id`)
      .put(this.routesControllerP.updateProduct); // Actualizar Producto

    app
      .route(`${this.routeparent}/producto/:id`)
      .delete(this.routesControllerP.deleteProduct); // Eliminar Producto

    app
      .route(`${this.routeparent}/imageProduct/:id`)
      .post(this.routesControllerP.uploadimage); // Subir Imagen
    app
      .route(`${this.routeparent}/getimageProduct/:id`)
      .get(this.routesControllerP.getimageProduct); // Obtener Imagen del Producto

    ///-------------Ruta de Recibo  -------------------
    app
      .route(`${this.routeparent}/pedidos/:idUs/:idCli/:idPed`)
      .put(this.routesControllerR.addReciboPedido); // Agregar Recibo del Pedido
  }
}

export default Routes;
