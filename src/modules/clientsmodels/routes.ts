import RoutesController from "./routeController/RoutesController";
import { Express, Request, Response } from "express";
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
      .post(this.routesController.createClient); // Crear Cliente

    app
      .route(`${this.routeparent}/client`)
      .get(this.routesController.getClient);// Mostrar Clientes

    app
      .route(`${this.routeparent}/client/tipo/:date`) 
      .get(this.routesController.getTypeClient);//Mostrar el tipo de cliente 
/*
    app
      .route(`${this.routeparent}/client/:tipo/:name`) //buscar por nombre de cliente regular
      .get(this.routesController.getNameClientR);*/

    app
      .route(`${this.routeparent}/client/:id`)
      .put(this.routesController.updateClient);// Actualoizar Cliente
    app
      .route(`${this.routeparent}/client/:id`)
      .delete(this.routesController.removeClients); // Eliminar Cliente

    app
      .route(`${this.routeparent}/clientSendPhoto/:id`)
      .post(this.routesController.uploadPortrait); // Subir Foto del Cliente
    app
      .route(`${this.routeparent}/clientgetportrait/:id`)
      .get(this.routesController.clientgetportrait); // Mostrar Foto de Cliente

    //-------Agregar Reunion -----------------
    app
      .route(`${this.routeparent}/agendar`)
      .post(this.routesController.createreunion); // Crear Reunion

    app
      .route(`${this.routeparent}/agendar`)
      .get(this.routesController.getreunion); // Mostrar Reunion

    app
      .route(`${this.routeparent}/agendar/pendientes`)
      .get(this.routesController.getreunionPendientes);// Mostrar Reuniones Pendientes

    app
      .route(`${this.routeparent}/agendar/:id`)
      .put(this.routesController.updateReunion); // Actuaizar Reunion

    app
      .route(`${this.routeparent}/agendar/:id`)
      .delete(this.routesController.deleteReunion); //  Eliminar Reunion

    app
      .route(`${this.routeparent}/addreunion/:id`)
      .put(this.routesController.addReunion); // Agregar Reunion

    app
      .route(`${this.routeparent}/removereunion/:id`)
      .delete(this.routesController.removeReunion);//  Remover Reunion

    //--------------- Pedidos--
    app
      .route(`${this.routeparent}/addPedido/:id`)
      .put(this.routesController.addPedidoClients); //Agregar Pedido de Cliente

    app
      .route(`${this.routeparent}/removePedido/:id`)
      .put(this.routesController.removePedidoClients); // REmover Pedido de Cliente
  }
}

export default Routes;
