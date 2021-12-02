"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form_controller_1 = __importDefault(require("./form.controller"));
const result_controller_1 = __importDefault(require("./../result/result.controller"));
exports.default = [
    {
        path: "/form/create/:eventId",
        method: "post",
        handler: [form_controller_1.default.create]
    },
    {
        path: "/form/:id/result",
        method: "post",
        handler: [form_controller_1.default.increaseCount]
    },
    {
        path: "/form/:id",
        method: "patch",
        handler: [form_controller_1.default.update]
    },
    {
        path: "/forms",
        adminOnly: true,
        method: "get",
        handler: [form_controller_1.default.fetchAll]
    },
    {
        path: "/form/:id",
        method: "get",
        handler: [form_controller_1.default.fetch]
    },
    {
        path: "/form/:id",
        method: "delete",
        handler: [form_controller_1.default.delete]
    },
    {
        path: "/form/event/:id",
        method: "get",
        handler: [form_controller_1.default.fetchByEvent]
    },
    {
        path: "/form/:formId/mcq/result",
        method: "get",
        handler: [result_controller_1.default.getMCQData]
    },
    {
        path: "/form/:formId/number/result",
        method: "get",
        handler: [result_controller_1.default.getNumberData]
    },
];
//# sourceMappingURL=index.js.map