"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_controller_1 = __importDefault(require("./ticket.controller"));
exports.default = [
    {
        path: "/ticket/create",
        method: "post",
        handler: [ticket_controller_1.default.create]
    },
    {
        path: "/ticket/:id",
        method: "patch",
        handler: [ticket_controller_1.default.update]
    },
    {
        path: "/ticket/:id",
        method: "get",
        handler: [ticket_controller_1.default.fetch]
    },
    {
        path: "/ticket/:id",
        method: "delete",
        handler: [ticket_controller_1.default.delete]
    },
];
//# sourceMappingURL=index.js.map