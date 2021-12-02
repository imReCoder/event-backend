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
exports.FormModel = void 0;
const form_schema_1 = require("./form.schema");
// import { sendMessage } from "./../../lib/services/textlocal";
const httpErrors_1 = require("../../lib/utils/httpErrors");
const result_model_1 = __importDefault(require("../result/result.model"));
class FormModel {
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield form_schema_1.Form.find();
            return data;
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield form_schema_1.Form.findById(id);
            return data;
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield form_schema_1.Form.findByIdAndUpdate(id, body, {
                runValidators: true,
                new: true
            });
            return data;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield form_schema_1.Form.deleteOne({ _id: id });
        });
    }
    add(body, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(body);
                body.eventId = eventId;
                const q = new form_schema_1.Form(body);
                // console.log("hiii", q);
                yield result_model_1.default.createResultBody(q);
                const data = yield q.addNewForm();
                console.log(data);
                return { data, alreadyExisted: false };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    ;
    fetchByEventId(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(eventId);
                const data = yield form_schema_1.Form.findOne({ eventId: eventId });
                console.log(data);
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
}
exports.FormModel = FormModel;
exports.default = new FormModel();
//# sourceMappingURL=form.model.js.map