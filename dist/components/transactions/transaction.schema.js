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
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const TransactionModel = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Voucher', 'Coupon', 'Payment', 'Hint', 'AddRemoval', 'PollReward', 'IKC', 'Others'],
        required: true
    },
    metadata: {
        description: { type: String, required: true },
        type: { type: String, required: true, enum: ['Credit', 'Debit'] },
        sessionId: String,
        voucherId: String,
        mode: String,
        gateway: String,
        offerId: String,
        message: String,
        auctionId: String,
    },
    status: {
        type: String,
        enum: ['TXN_SUCCESS', 'TXN_FAILURE', 'PENDING'],
        required: true
    }
}, {
    timestamps: true
});
TransactionModel.methods.add = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Transaction = (0, mongoose_1.model)("Transaction", TransactionModel);
//# sourceMappingURL=transaction.schema.js.map