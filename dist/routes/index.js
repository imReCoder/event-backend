"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../components/user"));
const event_1 = __importDefault(require("../components/event"));
const eventPortfolio_1 = __importDefault(require("../components/eventPortfolio"));
const form_1 = __importDefault(require("../components/form"));
const response_1 = __importDefault(require("../components/response"));
const auctionEvent_1 = __importDefault(require("../components/auctionEvent"));
const auction_1 = __importDefault(require("../components/auction"));
const ticket_1 = __importDefault(require("../components/ticket"));
const common_1 = __importDefault(require("../components/common"));
exports.default = [
    ...user_1.default,
    ...event_1.default,
    ...eventPortfolio_1.default,
    ...form_1.default,
    ...response_1.default,
    ...auctionEvent_1.default,
    ...auction_1.default,
    ...ticket_1.default,
    ...common_1.default
];
//# sourceMappingURL=index.js.map