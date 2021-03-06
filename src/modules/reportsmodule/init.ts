import { Express } from "express";
import Routes from "./routes";

class ReportModule {
  private routes: Routes;
  constructor(root: string, app: Express) {
    console.log("Init report module");
    this.routes = new Routes(root, app);
  }
}
export default ReportModule;
