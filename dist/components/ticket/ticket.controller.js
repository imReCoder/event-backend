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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpErrors_1 = require("../../lib/utils/httpErrors");
const customMessage_1 = require("../../lib/helpers/customMessage");
const ticket_model_1 = __importDefault(require("./ticket.model"));
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const event_model_1 = __importDefault(require("../event/event.model"));
class TicketController {
    constructor() {
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log(`Creating new ticket for event :${req.params.eventId}`);
                req.body.eventId = req.params.eventId;
                const newTicket = yield ticket_model_1.default.create(req.body, req.userId);
                if (!newTicket || !newTicket._id)
                    throw Error("some error occured...");
                const updateEventData = yield event_model_1.default.addTicket(newTicket._id, newTicket.eventId);
                if (!updateEventData)
                    throw new httpErrors_1.HTTP400Error("some error occured..");
                responseHandler.reqRes(req, res).onFetch(customMessage_1.ticketMsg.CREATED, newTicket).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onCreate(customMessage_1.ticketMsg.UPDATED, yield ticket_model_1.default.update(req.params.id, req.body)).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.fetch = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("fetch");
                responseHandler.reqRes(req, res).onCreate(customMessage_1.ticketMsg.FETCH, yield ticket_model_1.default.fetch(req.params.id)).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                yield ticket_model_1.default.delete(req.params.id);
                responseHandler.reqRes(req, res).onCreate(customMessage_1.ticketMsg.DELETED).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.default = new TicketController();
//# sourceMappingURL=ticket.controller.js.map