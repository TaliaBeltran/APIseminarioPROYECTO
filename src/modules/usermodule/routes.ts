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
      .route(`${this.routeparent}/refreshToken`)
      .post(this.routesController.refreshToken);
    app
      .route(`${this.routeparent}/users`)
      .post(this.routesController.createUsers);

    app
      .route(`${this.routeparent}/users`)
      .get(this.routesController.getUsers);

    app
      .route(`${this.routeparent}/users/:id`)
      .put(this.routesController.updateUsers);
    app
      .route(`${this.routeparent}/users/:id`)
      .delete(this.routesController.removeUsers);
    app
      .route(`${this.routeparent}/uploadportrait/:id`)
      .post(this.routesController.uploadPortrait);
    app
      .route(`${this.routeparent}/getportrait/:id`)
      .get(this.routesController.getPortrait);

    app
      .route(`${this.routeparent}/addrol/:id`)
      .put(this.routesController.addRol);
    app
      .route(`${this.routeparent}/removerol/:id`)
      .put(this.routesController.removeUserRol);

    //**--ROLES ROUTES--------------------------------------------------------------------------------------- */
    app
      .route(`${this.routeparent}/roles`)
      .post( this.routesController.createRol);
    app
      .route(`${this.routeparent}/roles`)
      .get(this.routesController.getRol);
    app
      .route(`${this.routeparent}/roles/:id`)
      .delete( this.routesController.removeRol);

    //--------AÑADIR O ELIMINAR CLIENTES A USUARIOS -----------
    app
      .route(`${this.routeparent}/addclient/:id`)
      .put(this.routesController.addClient);

    app
      .route(`${this.routeparent}/removeclient/:id`)
      .put(this.routesController.removeClient);
  }
}
export default Routes;
