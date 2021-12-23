"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auctionEvent_controller_1 = __importDefault(require("./auctionEvent.controller"));
const s3_1 = require("../../lib/services/s3");
exports.default = [
    {
        path: "/auctionevent/add",
        method: "post",
        handler: [auctionEvent_controller_1.default.create]
    },
    {
        path: "/auctionevent/:id/remove",
        method: "post",
        handler: [auctionEvent_controller_1.default.delete]
    },
    {
        path: "/auctionevent/fetchAll",
        method: "get",
        escapeAuth: true,
        handler: [auctionEvent_controller_1.default.fetchAll]
    },
    {
        path: "/auctionevent/upcoming",
        method: "get",
        escapeAuth: true,
        handler: [auctionEvent_controller_1.default.upcoming]
    },
    {
        path: "/auctionevent/past",
        method: "get",
        escapeAuth: true,
        handler: [auctionEvent_controller_1.default.pastEvents]
    },
    {
        path: "/auctionevent/:id",
        method: "get",
        escapeAuth: true,
        handler: [auctionEvent_controller_1.default.fetch]
    },
    {
        path: "/auctionevent/:id",
        method: "patch",
        handler: [auctionEvent_controller_1.default.update]
    },
    {
        path: "/auctionevent/icon/upload/:id",
        method: "post",
        handler: [s3_1.s3UploadMulter.single('file'), auctionEvent_controller_1.default.addIcon]
    },
    {
        path: "/auctionevent/coverImage/upload/:id",
        method: "post",
        handler: [s3_1.s3UploadMulter.single('file'), auctionEvent_controller_1.default.addCoverImage]
    },
    {
        path: "/auctionevent/search/:key",
        method: "get",
        handler: [auctionEvent_controller_1.default.searchAuction]
    },
];
//# sourceMappingURL=index.js.map