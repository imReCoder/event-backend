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
exports.EventSchema = new mongoose_1.Schema({
    title: {
        type: String,
        minlength: 2,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category"
    },
    information: {
        type: String
    },
    gallery: [String],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ["online", "physical", "virtual"],
        required: true
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
        required: true
    },
    creator: {
        type: String,
        ref: "User"
    },
    eventPortfolioId: {
        type: String,
        ref: "EventPortfolio"
    },
    onlinePlatform: {
        type: String
    },
    venuePlace: {
        type: String,
    },
    venueLocation: {
        type: String
    }
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