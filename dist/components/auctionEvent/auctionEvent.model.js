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
const auctionEvent_schema_1 = require("./auctionEvent.schema");
// import { sendMessage } from "./../../lib/services/textlocal";
const httpErrors_1 = require("../../lib/utils/httpErrors");
class AuctionEventModel {
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield auctionEvent_schema_1.AuctionEvent.find();
            return data;
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield auctionEvent_schema_1.AuctionEvent.findById(id);
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
                if (body.startDate) {
                    body.startDate = new Date(body.startDate);
                }
                if (body.endDate) {
                    body.endDate = new Date(body.endDate);
                }
                if (body.startDate < body.endDate) {
                    throw new httpErrors_1.HTTP400Error("Error in Dates");
                }
                const q = new auctionEvent_schema_1.AuctionEvent(body);
                const data = yield q.add();
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
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
}
exports.AuctionEventModel = AuctionEventModel;
exports.default = new AuctionEventModel();
//# sourceMappingURL=auctionEvent.model.js.map