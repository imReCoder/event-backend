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
exports.AuctionEvent = exports.AuctionEventSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AuctionEventSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
    },
    icon: {
        type: String
    },
    type: {
        type: String,
        enum: ['live', 'timed'],
        required: true
    },
    coverImage: {
        type: String
    },
    auctionItems: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Auction"
        }
    ]
}, {
    timestamps: true
});
exports.AuctionEventSchema.methods.add = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.AuctionEvent = (0, mongoose_1.model)("AuctionEvent", exports.AuctionEventSchema);
//# sourceMappingURL=auctionEvent.schema.js.map