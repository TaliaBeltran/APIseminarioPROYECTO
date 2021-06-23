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
    //-------------RUTAS DE PEDIDOS -----------------------
    app
      .route(`${this.routeparent}/pedidos`)
      .post(this.routesController.createPedido);

    app
      .route(`${this.routeparent}/pedidos`)
      .get(this.routesController.getPedido);

    app
      .route(`${this.routeparent}/pedidos/:id`)
      .put(this.routesController.updatePedido);
    app
      .route(`${this.routeparent}/pedidos/:id`)
      .delete(this.routesController.deletePedido);

    app
      .route(`${this.routeparent}/addProduct/:id/:cant`)
      .put(this.routesController.addProduct);

    app
      .route(`${this.routeparent}/updateProductPedido/:id`)
      .put(this.routesController.updateProductPedido);

    app
      .route(`${this.routeparent}/removeProduct/:id`)
      .put(this.routesController.removeProduct);
    //-----------RUTAS DE PRODUCTOS ------------------------
    app
      .route(`${this.routeparent}/producto/`)
      .post(this.routesControllerP.createProduct);

    app
      .route(`${this.routeparent}/producto/`)
      .get(this.routesControllerP.getProduct);

    app
      .route(`${this.routeparent}/producto/:id`)
      .put(this.routesControllerP.updateProduct);

    app
      .route(`${this.routeparent}/producto/:id`)
      .delete(this.routesControllerP.deleteProduct);

    app
      .route(`${this.routeparent}/imageProduct/:id`)
      .post(this.routesControllerP.uploadimage);
    app
      .route(`${this.routeparent}/getimageProduct/:id`)
      .get(this.routesControllerP.getimageProduct);

    ///-------------RUTA DE RECIBOS -------------------
    app
      .route(`${this.routeparent}/pedidos/:idUs/:idCli/:idPed`)
      .put(this.routesControllerR.addReciboPedido);
  }
}

export default Routes;
