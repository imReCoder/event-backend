"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const result_model_1 = __importDefault(require("./result.model"));
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
class ResultController {
    constructor() {
        this.getMCQData = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield result_model_1.default.getMCQData(req.params.formId, req.query.questionId);
                responseHandler.reqRes(req, res).onFetch("MCQ Question Data Fetched", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.getNumberData = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield result_model_1.default.getNumberData(req.params.formId, req.query.questionId);
                responseHandler.reqRes(req, res).onFetch("Number Question Data Fetched", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.default = new ResultController();
//# sourceMappingURL=result.controller.js.map