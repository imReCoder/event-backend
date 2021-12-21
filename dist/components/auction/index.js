"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auction_controller_1 = __importDefault(require("./auction.controller"));
const s3_1 = require("../../lib/services/s3");
exports.default = [
    {
        path: "/auction/:id/add",
        method: "post",
        handler: [auction_controller_1.default.create]
    },
    {
        path: "/auction/fetchAll",
        escapeAuth: true,
        method: "get",
        handler: [auction_controller_1.default.fetchAll]
    },
    {
        path: "/auction/:auctionEventId/fetch",
        escapeAuth: true,
        method: "get",
        handler: [auction_controller_1.default.fetchAuctionItemsByAuctionEvent]
    },
    {
        path: "/auction/:id",
        escapeAuth: true,
        method: "get",
        handler: [auction_controller_1.default.fetch]
    },
    {
        path: "/auction/:id",
        method: "patch",
        handler: [auction_controller_1.default.update]
    },
    {
        path: "/auction/:auctioneventid/remove/:id",
        method: "post",
        handler: [auction_controller_1.default.delete]
    },
    {
        path: "/auction/:id/bid",
        method: "post",
        handler: [auction_controller_1.default.bid]
    },
    {
        path: "/auction/search/:key",
        method: "get",
        handler: [auction_controller_1.default.searchItem]
    },
    {
        path: "/auction/image/upload/:id",
        method: "post",
        handler: [s3_1.s3UploadMulter.single('file'), auction_controller_1.default.addImage]
    },
];
//# sourceMappingURL=index.js.map