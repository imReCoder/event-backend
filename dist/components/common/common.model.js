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
exports.CommonModel = void 0;
const auctionEvent_schema_1 = require("./../auctionEvent/auctionEvent.schema");
const auction_schema_1 = require("./../auction/auction.schema");
class CommonModel {
    search(key) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("key is ", key);
            let auctionEvents = yield auctionEvent_schema_1.AuctionEvent.find({ title: { $regex: key, $options: "i" } });
            let auctions = yield auction_schema_1.Auction.find({ title: { $regex: key, $options: "i" } });
            const data = {
                auctionItems: auctions,
                auctionEvents: auctionEvents
            };
            return data;
        });
    }
}
exports.CommonModel = CommonModel;
exports.default = new CommonModel();
//# sourceMappingURL=common.model.js.map