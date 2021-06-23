import { Express } from "express";
import Routes from "./routes";
class PedidoModule {
  private routes: Routes;
  constructor(root: string, app: Express) {
    console.log("Init pedido module");
    this.routes = new Routes(root, app);
  }
}
export default PedidoModule;
