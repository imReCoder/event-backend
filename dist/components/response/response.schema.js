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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = exports.ResponseSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ResponseSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    formId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Form"
    },
    answers: [{
            questionId: String,
            questionText: String,
            answerId: String,
            answerText: String,
            questionType: String
        }],
}, {
    timestamps: true
});
exports.ResponseSchema.methods.addNewResponse = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Response = (0, mongoose_1.model)("Response", exports.ResponseSchema);
//# sourceMappingURL=response.schema.js.map