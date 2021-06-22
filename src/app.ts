import express, { Express } from "express";
import * as bodyParser from "body-parser";
import UserModules from "./modules/usermodule/init";
<<<<<<< HEAD
import ClientModule from "./modules/clientsmodels/init";
import PedidoModule from "./modules/pedidosmodule/init";
=======
import ClientModule from "./modules/clientesmodels/init";
//import PedidoModule from "./modules/pedidosmodule/init";
>>>>>>> c0265398a82db6928a686fe05e1d56ee3faf283d
import mongoose, { Mongoose } from "mongoose";
import FileUpload from "express-fileupload";
class App {
  public app: Express = express();
  public mongooseClient: Mongoose;
  constructor() {
    this.configuration();
    this.connectDatabase();
    this.initApp();
  }
  public connectDatabase() {
<<<<<<< HEAD
    let host: string = "mongodb://172.26.0.2:27017";
=======
    let host: string = "mongodb://172.19.0.2:27017";
>>>>>>> c0265398a82db6928a686fe05e1d56ee3faf283d
    let database: string = process.env.DATABASE || "seminario";
    let connectionString: string = `${host}/${database}`;
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //Eventos
    mongoose.connection.on("error", (err) => {
      console.log("Connection Fail");
      console.log(err);
    });
    mongoose.connection.on("open", () => {
      console.log("-----------------database connection success!");
    });
    this.mongooseClient = mongoose;
  }
  public configuration() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(FileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
  }
  public initApp() {
    console.log("LOAD MODULES");
    const userModule = new UserModules("/api", this.app);
    const clientModule = new ClientModule("/client", this.app);
<<<<<<< HEAD
    const pedidoModule = new PedidoModule("/pedido", this.app);
=======
    //const pedidoModule = new PedidoModule("/pedido", this.app);
>>>>>>> c0265398a82db6928a686fe05e1d56ee3faf283d
  }
}
export default new App();
