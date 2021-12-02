"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_controller_1 = __importDefault(require("./event.controller"));
const s3_1 = require("../../lib/services/s3");
const eventPortfolio_controller_1 = __importDefault(require("../eventPortfolio/eventPortfolio.controller"));
exports.default = [
    {
        path: "/event/create",
        method: "post",
        handler: [event_controller_1.default.create, eventPortfolio_controller_1.default.addUpcomingEvent, eventPortfolio_controller_1.default.addEventCount]
    },
    {
        path: '/event/AddCategory',
        method: 'post',
        adminOnly: true,
        handler: [event_controller_1.default.addCategory]
    },
    {
        path: "/event/:id",
        method: "patch",
        handler: [event_controller_1.default.update]
    },
    {
        path: "/events",
        method: "get",
        handler: [event_controller_1.default.fetchAll]
    },
    {
        path: "/event/fetch",
        method: "get",
        handler: [event_controller_1.default.getEvents]
    },
    {
        path: "/event/:id",
        method: "get",
        handler: [event_controller_1.default.fetch]
    },
    {
        path: "/event/:id",
        method: "delete",
        handler: [event_controller_1.default.delete]
    },
    {
        path: "/event/:id/like",
        method: "post",
        handler: [event_controller_1.default.addLike]
    },
    {
        path: "/event/:id/unlike",
        method: "post",
        handler: [event_controller_1.default.removeLike]
    },
    {
        path: "/event/upload/:id",
        method: "post",
        handler: [s3_1.s3UploadMulter.single('file'), event_controller_1.default.uploadFile]
    },
    {
        path: "/event/:id/share",
        method: "post",
        handler: [event_controller_1.default.increaseShareCount]
    }
];
//# sourceMappingURL=index.js.map