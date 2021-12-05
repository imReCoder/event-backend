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
exports.Event = exports.EventSchema = void 0;
const mongoose_1 = require("mongoose");
const LocationSchema = new mongoose_1.Schema({
    venu: { type: String },
    fullAddress: { type: String }
});
const EventImageSchema = new mongoose_1.Schema({
    desktopImage: {
        type: String
    },
    mobileImage: {
        type: String
    }
});
exports.EventSchema = new mongoose_1.Schema({
    name: {
        type: String,
        minlength: 2,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        enum: ["PRIVATE", "PUBLIC"],
        description: "visibility must be PUBLIC or PRIVATE"
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    location: {
        type: LocationSchema
    },
    images: {
        type: EventImageSchema
    },
    //new fields
    timeZone: {
        type: String
    },
    repeatingEvent: {
        type: Boolean
    },
    repeatingPeriod: {
        type: String
    },
    repeatingExceptionDays: {
        type: Array
    },
    containsTimeSlots: {
        type: Boolean
    },
    timeSlots: {
        trk: [{
                from: String,
                to: String
            }]
    },
    type: {
        type: String,
        enum: ["ONLINE", "PHYSICAL", "VIRTUAL"],
        required: true,
        description: "type must be ONLINE,PHYSICAL,VIRTUAL"
    },
    likes: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    },
    isFreebie: {
        type: Boolean,
    },
    creator: {
        type: String,
        ref: "User"
    },
    tickets: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Tickets"
        }]
}, {
    timestamps: true
});
exports.EventSchema.methods.addNewEvent = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Event = (0, mongoose_1.model)("Event", exports.EventSchema);
//# sourceMappingURL=event.schema.js.map