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
exports.Follow = exports.FollowSchema = void 0;
const mongoose_1 = require("mongoose");
exports.FollowSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        ref: "User",
        required: true
    },
    eventPortfolioId: {
        type: String,
        ref: "EventPortfolio"
    },
    eventId: {
        type: String,
        ref: "Event"
    },
}, {
    timestamps: true
});
exports.FollowSchema.methods.add = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Follow = (0, mongoose_1.model)("Follow", exports.FollowSchema);
//# sourceMappingURL=follow.schema.js.map