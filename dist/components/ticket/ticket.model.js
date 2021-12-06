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
exports.TicketModel = void 0;
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const ticket_schema_1 = require("./ticket.schema");
class TicketModel {
    create(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                body.creator = userId;
                body.startDate = new Date(body.startDate);
                body.endDate = new Date(body.endDate);
                const newTicket = new ticket_schema_1.Ticket(body);
                const newTicketData = yield newTicket.saveTicket();
                return newTicketData;
            }
            catch (e) {
                console.log(e);
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (body.startDate) {
                body.startDate = new Date(body.startDate);
            }
            if (body.endDate) {
                body.endDate = new Date(body.endDate);
            }
            console.log("update ticket ", id, " to ", body);
            const data = yield ticket_schema_1.Ticket.findByIdAndUpdate({ _id: id }, body, {
                runValidators: true,
                new: true
            });
            return data;
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = ticket_schema_1.Ticket.findById(id);
            if (!data)
                throw new httpErrors_1.HTTP400Error("Ticket Not Found");
            return data;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ticket_schema_1.Ticket.deleteOne({ _id: id });
        });
    }
}
exports.TicketModel = TicketModel;
exports.default = new TicketModel();
//# sourceMappingURL=ticket.model.js.map