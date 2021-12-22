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
const user_schema_1 = require("./../user/user.schema");
const index_1 = require("./../../lib/utils/index");
const auction_schema_1 = require("./auction.schema");
// import { sendMessage } from "./../../lib/services/textlocal";
const httpErrors_1 = require("../../lib/utils/httpErrors");
const axios_1 = __importDefault(require("axios"));
const transaction_schema_1 = require("../transactions/transaction.schema");
const auctionEvent_model_1 = __importDefault(require("../auctionEvent/auctionEvent.model"));
const auctionEvent_schema_1 = require("../auctionEvent/auctionEvent.schema");
const defaults = 'title startTime endTime description type startingBid lastBid previousBid auctionEventId images currentBid createdAt updatedAt';
class AuctionModel {
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.fetchAuctionItemsByCondition({});
            if (!data)
                throw new httpErrors_1.HTTP400Error("ITEMS_NOT_FOUND");
            return data;
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield auction_schema_1.Auction.findById(id);
            if (!data)
                throw new httpErrors_1.HTTP400Error("ITEM_NOT_FOUND");
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
    fetchAuctionItemsByCondition(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield auction_schema_1.Auction.aggregate([
                {
                    $match: condition,
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "creator",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind: { path: "$user" },
                },
                {
                    $project: Object.assign({ hosted_by: "$user.firstName", hoste_by_image: "$user.image" }, (0, index_1.mongoDBProjectFields)(defaults)),
                },
            ]);
            if (!data)
                throw new httpErrors_1.HTTP400Error("ITEMS_NOT_FOUND");
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
                console.log("body is ", body);
                body.creator = userId;
                body.auctionEventId = auctionEventId;
                const eventData = yield auctionEvent_schema_1.AuctionEvent.findById(auctionEventId).lean();
                if (!eventData)
                    throw new httpErrors_1.HTTP400Error("Auction event not found");
                body.startTime = eventData.startTime;
                body.endTime = eventData.endTime;
                // if (body.startDate) {
                //     body.startDate = new Date(body.startDate);
                // }
                // if (body.endDate) {
                //     body.endDate = new Date(body.endDate);
                // }
                // if(body.startDate < body.endDate){
                //     throw new HTTP400Error("Error in date");
                // }
                const q = new auction_schema_1.Auction(body);
                const data = yield q.add();
                const auctionEventUpdate = yield auctionEvent_schema_1.AuctionEvent.findByIdAndUpdate(auctionEventId, { "$push": { "auctionItems": q._id } }, { "new": true, "upsert": true });
                return data;
            }
            catch (e) {
                console.log(e);
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    returnIkc(auctionId, userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_schema_1.User.findById(userId);
                const body = {
                    type: "Others",
                    amount: amount,
                    phone: user.phone,
                    metadataType: "Credit",
                    description: `getting return from Bidding for ${auctionId}`,
                    auctionId,
                    userId
                };
                console.log("returning ikc ", body);
                const transactionData = yield this.transactionBodyCreator(body);
                const paymentBody = {
                    type: "Others",
                    amount: amount,
                    phone: user.phone,
                    metadataType: "Credit",
                    description: `getting return from Bidding for ${auctionId}`,
                    auctionId,
                    userId,
                    transactionId: transactionData._id
                };
                const res = yield this.masterToWalletTransaction(paymentBody);
                if (!res)
                    throw new httpErrors_1.HTTP400Error("Refund Faild for ", paymentBody.userId);
                const transaction = yield transaction_schema_1.Transaction.findOneAndUpdate({ _id: paymentBody.transactionId }, {
                    $set: { "status": "Returned" }
                }, {
                    new: true
                });
                console.log("status updated for transaciton ", transaction);
                return res;
            }
            catch (e) {
                console.log(e);
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    changeCurrentBid(auctionId, userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auction = yield auction_schema_1.Auction.findById(auctionId);
                let isPreviousBid = false;
                let lastBid;
                let res;
                if (auction.currentBid && auction.currentBid.user) {
                    isPreviousBid = true;
                    lastBid = auction.currentBid;
                    console.log("prev bid ", lastBid);
                    res = yield this.returnIkc(auctionId, lastBid.user, lastBid.amount);
                }
                if (res || !isPreviousBid) {
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
            catch (e) {
                console.log(e);
                throw new httpErrors_1.HTTP400Error(e.message);
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
                console.log(e);
                throw new httpErrors_1.HTTP400Error(e.message);
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
                    phone: body.phone,
                    metadata: {
                        type: body.metadataType,
                        description: body.description,
                        auctionId: body.auctionId
                    },
                    status: "PENDING"
                };
                const transaction = new transaction_schema_1.Transaction(transactionBody);
                const res = yield transaction.save();
                if (!res) {
                    throw new httpErrors_1.HTTP400Error("Transaction creation failed");
                }
                return res;
            }
            catch (e) {
                console.log(e);
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    walletToMasterTransaction(transactionBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKey = process.env.IKCDEALKEY;
                const url = `${process.env.IKC_MASTER_WALLET_URI}/wallet/addToMasterWallet?apiKey=${apiKey}`;
                console.log("url is ", url);
                const res = yield this.axiosRequestor(url, transactionBody);
                if (res.data.status) {
                    const currentBid = yield this.changeCurrentBid(transactionBody.metadata.auctionId, transactionBody.userId, transactionBody.amount);
                    if (!currentBid) {
                        throw new httpErrors_1.HTTP400Error("Change of current Bid Failed");
                    }
                    const transaction = yield transaction_schema_1.Transaction.findOneAndUpdate({ _id: transactionBody.transactionId }, {
                        $set: { "status": "TXN_SUCCESS" }
                    }, {
                        new: true
                    });
                    console.log("Status transaction change", transaction);
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
                console.log(e);
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    masterToWalletTransaction(transactionBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKey = process.env.IKCDEALKEY;
                const url = `${process.env.IKC_MASTER_WALLET_URI}/wallet/addToWallet?apiKey=${apiKey}`;
                const res = yield this.axiosRequestor(url, transactionBody);
                if (res.data.status) {
                    console.log("Status transaction change");
                    const transaction = yield transaction_schema_1.Transaction.findOneAndUpdate({ userId: transactionBody.userId }, {
                        $set: { "status": "TXN_SUCCESS" }
                    }, {
                        new: true
                    });
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
                console.log("bid request for ", amount, " ", auctionId);
                const user = yield user_schema_1.User.findById(userId);
                if (!user.phone)
                    throw new httpErrors_1.HTTP400Error("User phone number is not added. Add phone number to continue..");
                const auction = yield auction_schema_1.Auction.findById(auctionId);
                if (amount < auction.startingBid || amount < auction.currentBid.amount) {
                    console.log("not sufficient amount");
                    throw new httpErrors_1.HTTP400Error("amount not sufficient to bid.");
                }
                const transactionBody = {
                    type: "Others",
                    amount: amount,
                    metadataType: "Debit",
                    description: `Bidding for ${auctionId}`,
                    phone: user.phone,
                    auctionId,
                    userId,
                };
                const transactiondetails = yield this.transactionBodyCreator(transactionBody);
                const paymentBody = {
                    phone: user.phone,
                    amount: transactionBody.amount,
                    userId: transactionBody.userId,
                    isFreebie: false,
                    isPlatform: true,
                    metadata: {
                        type: transactionBody.metadataType,
                        description: transactionBody.description,
                        auctionId: transactionBody.auctionId,
                    },
                    description: transactionBody.description,
                    transactionId: transactiondetails._id,
                };
                console.log("payment body is ", paymentBody);
                if (transactiondetails) {
                    yield this.walletToMasterTransaction(paymentBody);
                }
                return transactiondetails;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    searchItem(key, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("key is ", key);
            let data = yield auction_schema_1.Auction.find({ title: { $regex: key, $options: "i" } });
            console.log("data is", data);
            if (!data.length)
                throw new httpErrors_1.HTTP400Error("No results");
            return data;
        });
    }
}
exports.AuctionModel = AuctionModel;
exports.default = new AuctionModel();
//# sourceMappingURL=auction.model.js.map