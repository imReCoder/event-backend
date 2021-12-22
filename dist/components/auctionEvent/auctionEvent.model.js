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
exports.AuctionEventModel = void 0;
const index_1 = require("./../../lib/utils/index");
const auctionEvent_schema_1 = require("./auctionEvent.schema");
const bson_1 = require("bson");
// import { sendMessage } from "./../../lib/services/textlocal";
const httpErrors_1 = require("../../lib/utils/httpErrors");
const fieldsOfUser = 'image firstName';
const defaults = 'startTime endTime description type createdAt updatedAt icon';
class AuctionEventModel {
    fetchAll(body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("fetch all for type ", body.type);
            let condition;
            if (body.type == 'timed') {
                condition = { type: "timed" };
                return yield this.fetchAuctionEventByCondition(condition);
            }
            else if (body.type == 'live') {
                condition = { type: "live" };
                return yield this.fetchAuctionEventByCondition(condition);
            }
            else {
                condition = {};
                return yield this.fetchAuctionEventByCondition(condition);
            }
        });
    }
    upcoming(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = Date.now();
            console.log("date now is ", today);
            let condition = {};
            if (body.type == 'timed') {
                condition = { startTime: { $gte: today }, type: "timed" };
                return yield this.fetchAuctionEventByCondition(condition);
            }
            else if (body.type == 'live') {
                condition = { startTime: { $gte: today }, type: "live" };
                return yield this.fetchAuctionEventByCondition(condition);
            }
            else {
                condition = { startTime: { $gte: today } };
                return yield this.fetchAuctionEventByCondition(condition);
            }
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conidtion = { _id: new bson_1.ObjectID(id) };
            const data = this.fetchAuctionEventByCondition(conidtion);
            if (!data)
                throw new httpErrors_1.HTTP400Error("AUCTIONEVENT_NOT_FOUND");
            return data;
        });
    }
    fetchAuctionEventByCondition(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield auctionEvent_schema_1.AuctionEvent.aggregate([
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
                    $project: Object.assign({ hosted_by: "$user.firstName", hoste_by_image: "$user.image", display_image: "$coverImage", total_items: { $size: "$auctionItems" }, items: "$auctionItems", name: "$title", isLive: {
                            $cond: {
                                if: {
                                    $eq: ['$type', "live"]
                                },
                                then: true,
                                else: false,
                            },
                        } }, (0, index_1.mongoDBProjectFields)(defaults)),
                },
            ]);
            if (!data)
                throw new httpErrors_1.HTTP400Error("AUCTIONEVENT_NOT_FOUND");
            return data;
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield auctionEvent_schema_1.AuctionEvent.findByIdAndUpdate(id, body, {
                runValidators: true,
                new: true
            });
            return data;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auctionEvent_schema_1.AuctionEvent.deleteOne({ _id: id });
        });
    }
    add(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(body);
                body.creator = userId;
                // if (body.startTime) {
                //     body.startTime = new Date(body.startTime).getTime();
                // }
                // if (body.endTime) {
                //     body.endTime = new Date(body.endTime).getTime();
                // }
                console.log("start date", body.startTime, " endDate", body.endTime);
                // if(body.startDate.getTime() < body.endDate.getTime()){
                //     throw new HTTP400Error("Start date should be lesss than end date");
                // }
                const q = new auctionEvent_schema_1.AuctionEvent(body);
                const data = yield q.add();
                return data;
            }
            catch (e) {
                console.log(e.message);
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    addIcon(id, filelocation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const data = yield auctionEvent_schema_1.AuctionEvent.findOneAndUpdate({ _id: id }, {
                    $set: { "icon": filelocation }
                }, { new: true });
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    addcoverImage(id, filelocation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const data = yield auctionEvent_schema_1.AuctionEvent.findOneAndUpdate({ _id: id }, {
                    $set: { "coverImage": filelocation }
                }, { new: true });
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    addAuctionItems(auctionEventId, auctionItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const auctionEvent = yield auctionEvent_schema_1.AuctionEvent.findOneAndUpdate({ _id: auctionEventId }, {
                $push: { "auctionItems": auctionItemId }
            }, { new: true });
            return auctionEvent;
        });
    }
    ;
    removeAuctionItems(auctionEventId, auctionItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const auctionEvent = yield auctionEvent_schema_1.AuctionEvent.findOneAndUpdate({ _id: auctionEventId }, {
                $pull: { "auctionItems": auctionItemId }
            }, { new: true });
            return auctionEvent;
        });
    }
    ;
    searchAuction(key, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("key is ", key);
            let data = yield auctionEvent_schema_1.AuctionEvent.find({ title: { $regex: key, $options: "i" } });
            console.log("data is", data);
            if (!data.length)
                throw new httpErrors_1.HTTP400Error("No results");
            return data;
        });
    }
}
exports.AuctionEventModel = AuctionEventModel;
exports.default = new AuctionEventModel();
//# sourceMappingURL=auctionEvent.model.js.map