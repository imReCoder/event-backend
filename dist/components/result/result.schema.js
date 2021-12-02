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
exports.Result = exports.ResultSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ResultSchema = new mongoose_1.Schema({
    formId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Form"
    },
    mcq: [{
            questionId: String,
            options: [{
                    optionId: String,
                    count: {
                        type: Number,
                        default: 0
                    }
                }],
            totalOptionCount: {
                type: Number,
                default: 0
            }
        }],
    number: [{
            questionId: String,
            answers: [{
                    answer: Number,
                    count: {
                        type: Number,
                        default: 0
                    }
                }],
        }]
}, {
    timestamps: true
});
exports.ResultSchema.methods.addNewResult = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Result = (0, mongoose_1.model)("Result", exports.ResultSchema);
//# sourceMappingURL=result.schema.js.map