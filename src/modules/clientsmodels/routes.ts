import RoutesController from "./routeController/RoutesController";
import { Express } from "express";
class Routes {
  private routesController: RoutesController;
  private routeparent: string;
  constructor(routeparent: string, app: Express) {
    this.routesController = new RoutesController();
    this.routeparent = routeparent;
    this.configureRoutes(app);
  }

  private configureRoutes(app: Express) {
    app
      .route(`${this.routeparent}/client`)
      .post(this.routesController.createClient);

    app
      .route(`${this.routeparent}/client`)
      .get(this.routesController.getClient);

    app
      .route(`${this.routeparent}/client/tipo/:date`) //buscar tipo de cliente regular o potencial
      .get(this.routesController.getTypeClient);

    app
      .route(`${this.routeparent}/client/:tipo/:name`) //buscar por nombre de cliente regular
      .get(this.routesController.getNameClientR);

    app
      .route(`${this.routeparent}/client/:id`)
      .put(this.routesController.updateClient);
    app
      .route(`${this.routeparent}/client/:id`)
      .delete(this.routesController.removeClients);

    app
      .route(`${this.routeparent}/clientSendPhoto/:id`)
      .post(this.routesController.uploadPortrait);
    app
      .route(`${this.routeparent}/clientgetportrait/:id`)
      .get(this.routesController.clientgetportrait);

    //-------AGENDAR REUNION -----------------
    app
      .route(`${this.routeparent}/agendar`)
      .post(this.routesController.createreunion);

    app
      .route(`${this.routeparent}/agendar`)
      .get(this.routesController.getreunion);

    app
      .route(`${this.routeparent}/agendar/pendientes`)
      .get(this.routesController.getreunionPendientes);

    app
      .route(`${this.routeparent}/agendar/:id`)
      .put(this.routesController.updateReunion);

    app
      .route(`${this.routeparent}/agendar/:id`)
      .delete(this.routesController.deleteReunion);

    app
      .route(`${this.routeparent}/addreunion/:id`)
      .put(this.routesController.addReunion);

    app
      .route(`${this.routeparent}/removereunion/:id`)
      .delete(this.routesController.removeReunion);

    //--pedidos--
    app
      .route(`${this.routeparent}/addPedido/:id`)
      .put(this.routesController.addPedidoClients);

    app
      .route(`${this.routeparent}/removePedido/:id`)
      .put(this.routesController.removePedidoClients);
  }
}

export default Routes;
