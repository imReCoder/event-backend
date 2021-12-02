"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventPortfolio_controller_1 = __importDefault(require("./eventPortfolio.controller"));
const s3_1 = require("../../lib/services/s3");
exports.default = [
    {
        path: "/eventportfolio/create",
        method: "post",
        handler: [eventPortfolio_controller_1.default.create]
    },
    {
        path: "/eventportfolio/:id",
        method: "patch",
        handler: [eventPortfolio_controller_1.default.update]
    },
    {
        path: "/eventportfolios",
        adminOnly: true,
        method: "get",
        handler: [eventPortfolio_controller_1.default.fetchAll]
    },
    {
        path: "/eventportfolio/:id",
        method: "get",
        handler: [eventPortfolio_controller_1.default.fetch]
    },
    {
        path: "/eventportfolio/:id",
        method: "delete",
        handler: [eventPortfolio_controller_1.default.delete]
    },
    {
        path: "/eventportfolio/:id/follower",
        method: "post",
        handler: [eventPortfolio_controller_1.default.addFollower]
    },
    {
        path: "/eventportfolio/:id/removefollower",
        method: "post",
        handler: [eventPortfolio_controller_1.default.removeFollower]
    },
    {
        path: "/eventportfolio/:id/follow",
        method: "post",
        handler: [eventPortfolio_controller_1.default.addFollow]
    },
    {
        path: "/eventportfolio/:id/upcomingevent/:eventId",
        method: "delete",
        handler: [eventPortfolio_controller_1.default.addUpcomingEvent]
    },
    {
        path: "/eventportfolio/upload/:id",
        method: "post",
        handler: [s3_1.s3UploadMulter.single('file'), eventPortfolio_controller_1.default.uploadFile]
    },
];
//# sourceMappingURL=index.js.map