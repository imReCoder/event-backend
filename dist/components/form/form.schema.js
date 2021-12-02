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
exports.Form = exports.FormSchema = void 0;
const mongoose_1 = require("mongoose");
exports.FormSchema = new mongoose_1.Schema({
    title: {
        type: String,
        minlength: 2,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    eventId: {
        type: String,
        required: true
    },
    questions: [{
            questionText: String,
            questionImage: { type: String, default: "" },
            isRequired: Boolean,
            questiontype: String,
            options: [{
                    optionText: String,
                    optionImage: { type: String, default: "" },
                }]
        }],
}, {
    timestamps: true
});
exports.FormSchema.methods.addNewForm = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Form = (0, mongoose_1.model)("Form", exports.FormSchema);
//# sourceMappingURL=form.schema.js.map