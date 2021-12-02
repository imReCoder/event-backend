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
exports.ResponseModel = void 0;
const response_schema_1 = require("./response.schema");
// import { sendMessage } from "./../../lib/services/textlocal";
const httpErrors_1 = require("../../lib/utils/httpErrors");
const result_model_1 = __importDefault(require("../result/result.model"));
class ResponseModel {
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield response_schema_1.Response.find();
            return data;
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield response_schema_1.Response.findById(id);
            return data;
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield response_schema_1.Response.findByIdAndUpdate(id, body, {
                runValidators: true,
                new: true
            });
            return data;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield response_schema_1.Response.deleteOne({ _id: id });
        });
    }
    add(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(body);
                body.userId = userId;
                const q = new response_schema_1.Response(body);
                console.log("hiii", q);
                const data = yield q.addNewResponse();
                yield this.submitAnswer(data);
                console.log(data);
                return { data, alreadyExisted: false };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    ;
    submitAnswer(responseBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formId = responseBody.formId;
                for (let i = 0; i < responseBody.answers.length; i++) {
                    const answer = responseBody.answers[i];
                    const questionType = answer.questionType;
                    const questionId = answer.questionId;
                    console.log(formId, questionId, questionType);
                    if (questionType == "mcq") {
                        const optionId = answer.answerId;
                        yield result_model_1.default.increaseCount(formId, questionId, optionId);
                    }
                    else if (questionType == "number") {
                        console.log(answer);
                        console.log(answer.answerText);
                        const answerText = Number(answer.answerText);
                        console.log(answerText);
                        yield result_model_1.default.increaseNumber(formId, questionId, answerText);
                    }
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
}
exports.ResponseModel = ResponseModel;
exports.default = new ResponseModel();
//# sourceMappingURL=response.model.js.map