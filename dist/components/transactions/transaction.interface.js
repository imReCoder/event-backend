"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionStatus = exports.transactionType = void 0;
var transactionType;
(function (transactionType) {
    transactionType["CREDIT"] = "Credit";
    transactionType["DEBIT"] = "Debit";
})(transactionType = exports.transactionType || (exports.transactionType = {}));
var transactionStatus;
(function (transactionStatus) {
    transactionStatus["TXN_SUCCESS"] = "TXN_SUCCESS";
    transactionStatus["PENDING"] = "PENDING";
    transactionStatus["TXN_FAILURE"] = "TXN_FAILURE";
})(transactionStatus = exports.transactionStatus || (exports.transactionStatus = {}));
//# sourceMappingURL=transaction.interface.js.map