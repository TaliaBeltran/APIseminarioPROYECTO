import RoutesController from "./routeController/RoutesController";
import jsonwebtokenSecurity from "../usermodule/middleware";
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
    //----------------ROUTES  CLIENT--------------------------------------
    app
      .route(`${this.routeparent}/client`)
      .post(this.routesController.createClient); // Crear Cliente

    app
      .route(`${this.routeparent}/client`)
      .get(this.routesController.getClient); // Mostrar Clientes

    app
      .route(`${this.routeparent}/client/:tipo/:name`) //:tipo=regular/potencial.....name=nombre decliente regular
      .get(this.routesController.getClientRorP); // muestra nombre d ecliente regular/potencial

    app
      .route(`${this.routeparent}/client/:id`)
      .put(this.routesController.updateClient); // Actualoizar Cliente
    app
      .route(`${this.routeparent}/client/:id`)
      .delete(this.routesController.removeClients); // Eliminar Cliente

    app
      .route(`${this.routeparent}/clientSendPhoto/:id`)
      .post(this.routesController.uploadPortrait); // Subir Foto del Cliente
    app
      .route(`${this.routeparent}/clientgetportrait/:id`)
      .get(this.routesController.clientgetportrait); // Mostrar Foto de Cliente

    //----------------------RUTAS AGENDA----------------
    app
      .route(`${this.routeparent}/agendar`)
      .post(this.routesController.createreunion); // Crear Reunion

    app
      .route(`${this.routeparent}/agendar`)
      .get(this.routesController.getreunion); // Mostrar Reunion
    app
      .route(`${this.routeparent}/agendar/:idReu`) // muestra un asolo reunion
      .get(this.routesController.getOnyReunion);

    app
      .route(`${this.routeparent}/agendar/:id`)
      .put(this.routesController.updateReunion); // Actuaizar Reunion

    app
      .route(`${this.routeparent}/agendar/:id`)
      .delete(this.routesController.deleteReunion); //  Eliminar Reunion

    app
      .route(`${this.routeparent}/addreunion/:id`) //  idCl_ al que se le quiere agregar la reunion
      .put(this.routesController.addReunion); // Agregar Reunion a un cliente

    app
      .route(`${this.routeparent}/removereunion/:id`) //idCl_ al que se le quiere eliminar la reunion
      .put(this.routesController.removeReunion); //  Remover Reunion

    //--------------ROUTES PEDIDOS DE CLIENTS----
    app
      .route(`${this.routeparent}/addPedido/:id`) //  idCl_ alque deseamos agregarle un pedido
      .put(this.routesController.addPedidoClients); //Agregar Pedido de Cliente

    app
      .route(`${this.routeparent}/removePedido/:id`) //idCl_ _alque deseamos eliminarle un pedido
      .put(this.routesController.removePedidoClients); // REmover Pedido de Cliente
  }
}

export default Routes;
