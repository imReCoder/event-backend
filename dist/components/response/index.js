"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_controller_1 = __importDefault(require("./response.controller"));
exports.default = [
    {
        path: "/response/create",
        method: "post",
        handler: [response_controller_1.default.create]
    },
    {
        path: "/response/update",
        method: "patch",
        handler: [response_controller_1.default.update]
    },
    {
        path: "/responses",
        adminOnly: true,
        method: "get",
        handler: [response_controller_1.default.fetchAll]
    },
    {
        path: "/response/:id",
        method: "get",
        handler: [response_controller_1.default.fetch]
    },
    {
        path: "response/:id",
        method: "delete",
        handler: [response_controller_1.default.delete]
    },
];
//# sourceMappingURL=index.js.map