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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionModel = void 0;
const auction_schema_1 = require("./auction.schema");
// import { sendMessage } from "./../../lib/services/textlocal";
const httpErrors_1 = require("../../lib/utils/httpErrors");
const axios_1 = __importDefault(require("axios"));
const transaction_model_1 = __importDefault(require("../transactions/transaction.model"));
const transaction_schema_1 = require("../transactions/transaction.schema");
const auctionEvent_model_1 = __importDefault(require("../auctionEvent/auctionEvent.model"));
class AuctionModel {
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield auction_schema_1.Auction.find();
            return data;
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield auction_schema_1.Auction.findById(id);
            return data;
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield auction_schema_1.Auction.findByIdAndUpdate(id, body, {
                runValidators: true,
                new: true
            });
            return data;
        });
    }
    delete(id, auctionEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auctionEvent_model_1.default.removeAuctionItems(auctionEventId, id);
            yield auction_schema_1.Auction.deleteOne({ _id: id });
        });
    }
    add(body, userId, auctionEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(body);
                body.creator = userId;
                body.auctionEventId = auctionEventId;
                // if (body.startDate) {
                //     body.startDate = new Date(body.startDate);
                // }
                // if (body.endDate) {
                //     body.endDate = new Date(body.endDate);
                // }
                // if(body.startDate < body.endDate){
                //     throw new HTTP400Error("Error in Dates");
                // }
                const q = new auction_schema_1.Auction(body);
                console.log("hiii", q);
                const data = yield q.add();
                console.log(data);
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    changeCurrentBid(auctionId, userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auction = yield auction_schema_1.Auction.findById(auctionId);
                const body = {
                    type: "Others",
                    amount: amount,
                    metadataType: "CREDIT",
                    description: `getting return from Bidding for ${auctionId}`,
                    auctionId
                };
                const transactionData = yield this.transactionBodyCreator(body);
                if (transactionData) {
                    const res = yield this.masterToWalletTransaction(transactionData);
                    if (res) {
                        const currentBid = {
                            user: userId,
                            amount
                        };
                        const data = yield auction_schema_1.Auction.findOneAndUpdate({ _id: auctionId }, {
                            $set: { "currentBid": currentBid },
                            $push: { "previousBid": auction.currentBid }
                        }, { new: true });
                        return data;
                    }
                    else {
                        throw new httpErrors_1.HTTP400Error("Master wallet to  wallet transaction failed");
                    }
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    fetchAuctionItemsByAuctionEvent(auctionEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auctionItems = yield auction_schema_1.Auction.find({ auctionEventId: auctionEventId }).populate({
                    path: 'auctionEventId'
                });
                return auctionItems;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    addImage(id, filelocation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const data = yield auction_schema_1.Auction.findOneAndUpdate({ _id: id }, {
                    $push: { "images": filelocation }
                }, { new: true });
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    axiosRequestor(url, axiosdata = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, axios_1.default)({
                    method: "POST",
                    url,
                    data: Object.assign({}, axiosdata)
                });
                return res;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    transactionBodyCreator(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactionBody = {
                    userId: body.userId,
                    amount: body.amount,
                    type: body.type,
                    description: body.description,
                    metadata: {
                        type: body.metadataType,
                        description: body.description,
                        auctionId: body.auctionId
                    },
                    status: "PENDING"
                };
                const transaction = new transaction_schema_1.Transaction(transactionBody);
                const res = yield transaction_model_1.default.create(transaction);
                if (!res) {
                    throw new httpErrors_1.HTTP400Error("Transaction creation failed");
                }
                return transactionBody;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    walletToMasterTransaction(transactionBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKey = process.env.IKCDEALKEY;
                const url = `http://localhost:8000/wallet/removeFromWallet?apiKey=${apiKey}`;
                const res = yield this.axiosRequestor(url, transactionBody);
                if (res.data.status) {
                    const currentBid = yield this.changeCurrentBid(transactionBody.metadata.auctionId, transactionBody.userId, transactionBody.amount);
                    if (!currentBid) {
                        throw new httpErrors_1.HTTP400Error("Change of current Bid Failed");
                    }
                    console.log("Status transaction change");
                    const transaction = yield transaction_schema_1.Transaction.findOneAndUpdate({ userId: transactionBody.userId }, {
                        $set: { "status": "TXN_SUCCESS" }
                    }, {
                        new: true
                    });
                    console.log(transaction);
                    if (transaction.status != "TXN_SUCCESS") {
                        throw Error(`Transaction status not updated for user ${transactionBody.userId}`);
                    }
                }
                else {
                    throw Error(`Making payment from masterWallet failed for user ${transactionBody.userId}`);
                }
                return res;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    masterToWalletTransaction(transactionBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKey = process.env.IKCDEALKEY;
                const url = `http://localhost:8000/wallet/addToWallet?apiKey=${apiKey}`;
                const res = yield this.axiosRequestor(url, transactionBody);
                if (res.data.status) {
                    console.log("Status transaction change");
                    const transaction = yield transaction_schema_1.Transaction.findOneAndUpdate({ userId: transactionBody.userId }, {
                        $set: { "status": "TXN_SUCCESS" }
                    }, {
                        new: true
                    });
                    console.log(transaction);
                    if (transaction.status != "TXN_SUCCESS") {
                        throw Error(`Transaction status not updated for user ${transactionBody.userId}`);
                    }
                }
                else {
                    throw Error(`Making payment from masterWallet failed for user ${transactionBody.userId}`);
                }
                return res;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    bid(auctionId, amount, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auction = yield auction_schema_1.Auction.findById(auctionId);
                if (amount < auction.startingBid || amount < auction.currentBid.amount) {
                    throw new httpErrors_1.HTTP400Error("amount not sufficient to bid.");
                }
                const body = {
                    type: "Others",
                    amount: amount,
                    metadataType: "DEBIT",
                    description: `Bidding for ${auctionId}`,
                    auctionId
                };
                const transactionData = yield this.transactionBodyCreator(body);
                if (transactionData) {
                    yield this.walletToMasterTransaction(transactionData);
                }
                return transactionData;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
}
exports.AuctionModel = AuctionModel;
exports.default = new AuctionModel();
//# sourceMappingURL=auction.model.js.map