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
const transaction_schema_1 = require("./transaction.schema");
const httpErrors_1 = require("../../lib/utils/httpErrors");
const transactionSelect = "amount type metadata status createdAt";
class TransactionModel {
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let t = new transaction_schema_1.Transaction(body);
            return yield t.add();
        });
    }
    // public async fetchTransactionByQuizId(quiz:IQuizModel) {
    //     try {
    //         const transaction = Transaction.find({
    //             $and: [{ 'metadata.roomId': quiz._id }, { 'amount': quiz.poolAmount }, {
    //                 'metadata.type': 'Debit'
    //             }, { 'status': 'TXN_SUCCESS' },{'type':'Payment'}]
    //         });
    //         console.log(transaction);
    //         return transaction;
    //     } catch (e) {
    //         throw new HTTP400Error(e);
    //     }
    // }
    fetchTransactionsByUserId(userId, status = '') {
        return __awaiter(this, void 0, void 0, function* () {
            let transactions;
            if (status && (status == 'TXN_FAILURE' || status == 'TXN_SUCCESS' || status == 'PENDING')) {
                transactions = yield transaction_schema_1.Transaction.find({ userId: userId, status: status }, transactionSelect).lean();
            }
            else {
                transactions = yield transaction_schema_1.Transaction.find({ userId: userId }, transactionSelect).lean();
            }
            return transactions;
        });
    }
    changeStatusOfTransaction(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield transaction_schema_1.Transaction.findOneAndUpdate({ _id: id }, {
                    $set: { 'status': status }
                });
                if (transaction.status == status) {
                    return { proceed: true };
                }
                else {
                    return { proceed: false };
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
}
exports.default = new TransactionModel();
//# sourceMappingURL=transaction.model.js.map