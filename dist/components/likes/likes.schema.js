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
exports.Like = exports.LikeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.LikeSchema = new mongoose_1.Schema({
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    userId: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }],
}, {
    timestamps: true
});
exports.LikeSchema.methods.addNewLike = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Like = (0, mongoose_1.model)("Like", exports.LikeSchema);
//# sourceMappingURL=likes.schema.js.map