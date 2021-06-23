import { Express } from "express";
import Routes from "./routes";
class ClientModule {
  private routes: Routes;
  constructor(root: string, app: Express) {
    console.log("Init client module");
    this.routes = new Routes(root, app);
  }
}
export default ClientModule;
