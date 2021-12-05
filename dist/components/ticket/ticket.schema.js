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
exports.Ticket = exports.TicketSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TicketSchema = new mongoose_1.Schema({
    name: {
        type: String,
        minlength: 2,
        required: true,
    },
    type: {
        type: String,
        enum: ["PAID", "FREE", "DONATION"],
        required: false,
        default: "FREE"
    },
    totalQuantity: {
        type: Number,
        required: true,
        max: 10000
    },
    ticketPrice: {
        type: Number,
        required: true,
        max: 10000
    },
    startDate: {
        type: Date,
        required: true,
        maxlength: 20
    },
    startTime: {
        type: String,
        required: true,
        maxlength: 10
    },
    endDate: {
        type: Date,
        required: true,
        maxlength: 20
    },
    endTime: {
        type: String,
        required: true,
        maxlength: 10
    },
    minimumPerBooking: {
        type: Number,
        default: 1,
        max: 100
    },
    maximumPerBooking: {
        type: Number,
        required: true
    },
    GSTInvoice: {
        type: Boolean,
        required: true
    },
    GSTNumber: {
        type: String,
        maxlength: 15,
        minlength: 15,
        description: "GST must be of 15 characters"
    },
    creator: {
        type: String,
        ref: "User"
    },
    eventId: {
        type: String,
        required: true,
        ref: "Event"
    }
}, {
    timestamps: true,
});
exports.TicketSchema.methods.saveTicket = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Ticket = (0, mongoose_1.model)("Ticket", exports.TicketSchema);
//# sourceMappingURL=ticket.schema.js.map