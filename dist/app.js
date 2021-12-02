"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
/* Custom imports */
const utils_1 = require("./lib/utils");
const index_1 = __importDefault(require("./lib/middleware/index"));
const routes_1 = __importDefault(require("./routes"));
const errorHandlers_middleware_1 = __importDefault(require("./lib/middleware/errorHandlers.middleware"));
const dbConnection_1 = __importDefault(require("./lib/helpers/dbConnection"));
/* Importing defaults */
// import "./lib/services/cache";
// Uncomment this when you are ready to use cache.
/* Error Handlers */
// These error handlers will caught any unhandled exceptions or rejections
// and do not stop the process with zero.
process.on("uncaughtException", e => {
    console.log(e);
    console.log(e.message, "uncaught");
    process.exit(1);
});
process.on("unhandledRejection", e => {
    console.log(e, "unhandled");
    process.exit(1);
});
// Initialize express app
const app = (0, express_1.default)();
exports.app = app;
// Initialize middleware
(0, utils_1.applyMiddleware)(index_1.default, app);
// open  mongoose connection
dbConnection_1.default.mongoConnection();
/*---------------------------------------
| API VERSIONS CONFIGURATION [START]
|---------------------------------------*/
// Different router required to initialize different apis call.
const r1 = express_1.default.Router();
// for recurrent jobs
// schedule('* * * * *', async () => {
//   console.log("Running job......");
//   await quizModel.updateQuiz();
// });
// schedule('* * * * *', async () => {
//   console.log("Running job 2......");
//   await quizModel.distributePriceMoney();
// });
app.use("/", (0, utils_1.applyRoutes)(routes_1.default, r1)); // default api
/*---------------------------------------
| API VERSIONS CONFIGURATION [END]
|---------------------------------------*/
(0, utils_1.applyMiddleware)(errorHandlers_middleware_1.default, app);
//# sourceMappingURL=app.js.map