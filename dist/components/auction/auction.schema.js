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
exports.Auction = exports.AuctionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AuctionSchema = new mongoose_1.Schema({
    auctionEventId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "AuctionEvent"
    },
    title: {
        type: String,
        required: true
    },
    images: [{
            type: String
        }],
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: false
    },
    endTime: {
        type: Date,
        required: false
    },
    startingBid: {
        type: Number,
        required: true
    },
    currentBid: {
        user: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        },
        amount: Number
    },
    previousBid: [{
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User"
            },
            amount: Number
        }],
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {
    timestamps: true
});
exports.AuctionSchema.methods.add = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Auction = (0, mongoose_1.model)("Auction", exports.AuctionSchema);
//# sourceMappingURL=auction.schema.js.map