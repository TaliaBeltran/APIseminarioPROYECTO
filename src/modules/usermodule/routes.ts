import RoutesController from "./routeController/RoutesController";
import jsonwebtokenSecurity from "./middleware";
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
    //**--USER ROUTES--------------------------------------------------------------------------------------- */

    app.route(`${this.routeparent}/login`).post(this.routesController.login);

    app
      .route(`${this.routeparent}/users`)
      .post(this.routesController.createUsers); // crear usuario

    app.route(`${this.routeparent}/users`).get(this.routesController.getUsers); // muestra a todos los
    // usuarios
    app
      .route(`${this.routeparent}/users/:id`) //idUs
      .get(this.routesController.getOnlyUsers); // muestra a un solo usuario seleccionado

    app
      .route(`${this.routeparent}/users/:id`)
      .put(this.routesController.updateUsers); // actualiza usuario
    app
      .route(`${this.routeparent}/users/:id`)
      .delete(this.routesController.removeUsers); // elimina usuario
    app
      .route(`${this.routeparent}/uploadportrait/:id`)
      .post(this.routesController.uploadPortrait); // sube foto a un usuario
    app
      .route(`${this.routeparent}/getportrait/:id`)
      .get(this.routesController.getPortrait); // muestra foto de usuario

    app
      .route(`${this.routeparent}/addrol/:id`) // id_ de usuario al que hay que añadie el rol
      .put(this.routesController.addRol); // agrega rol a un usuario
    app
      .route(`${this.routeparent}/removerol/:id`)
      .put(this.routesController.removeUserRol); // elimina rol de un usuario

    //**--ROLES ROUTES--------------------------------------------------------------------------------------- */
    app
      .route(`${this.routeparent}/roles`)
      .post(this.routesController.createRol); // crea rol
    app.route(`${this.routeparent}/roles`).get(this.routesController.getRol); // muestra todos los roles
    app
      .route(`${this.routeparent}/roles/:id`)
      .delete(this.routesController.removeRol); // elimina rol

    //--------AÑADIR O ELIMINAR CLIENTES A USUARIOS -----------
    app
      .route(`${this.routeparent}/addclient/:id`) // idUs
      .put(this.routesController.addClient); // añade un cliente a un usuario mediante id

    app
      .route(`${this.routeparent}/removeclient/:id`) //idUs
      .put(this.routesController.removeClient); // elimina el cliente de un usuario
  }
}
export default Routes;
