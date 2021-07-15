"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const init_1 = __importDefault(require("./modules/usermodule/init"));
const init_2 = __importDefault(require("./modules/clientsmodels/init"));
const init_3 = __importDefault(require("./modules/pedidosmodule/init"));
const init_4 = __importDefault(require("./modules/reportsmodule/init"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
class App {
    constructor() {
        this.app = express_1.default();
        this.configuration();
        this.connectDatabase();
        this.initApp();
    }
    connectDatabase() {
        let host = "mongodb://172.27.0.3:27017";
        let database = process.env.DATABASE || "seminario";
        let connectionString = `${host}/${database}`;
        mongoose_1.default.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        //Eventos
        mongoose_1.default.connection.on("error", (err) => {
            console.log("Connection FAIL");
            console.log(err);
        });
        mongoose_1.default.connection.on("open", () => {
            console.log("* ------- DATABASE CONNECTION SUCCESS !!! ----------------*");
        });
        this.mongooseClient = mongoose_1.default;
    }
    configuration() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express_fileupload_1.default({ limits: { fileSize: 50 * 1024 * 1024 } }));
    }
    initApp() {
        console.log("LOAD MODULES");
        const userModule = new init_1.default("/api", this.app);
        const clientModule = new init_2.default("/client", this.app);
        const pedidoModule = new init_3.default("/pedido", this.app);
        const reportModule = new init_4.default("/report", this.app);
    }
}
exports.default = new App();
//# sourceMappingURL=app.js.map