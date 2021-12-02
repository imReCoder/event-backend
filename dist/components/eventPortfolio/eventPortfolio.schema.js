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
exports.EventPortfolio = exports.EventPortfolioSchema = void 0;
const mongoose_1 = require("mongoose");
exports.EventPortfolioSchema = new mongoose_1.Schema({
    title: {
        type: String,
        minlength: 2,
        required: true,
    },
    coverImage: {
        type: String,
        default: "https://polbol-media.s3.ap-south-1.amazonaws.com/ic_user_dummy.jpg",
        required: true,
    },
    profileImage: {
        type: String,
    },
    about: {
        type: String,
    },
    gallery: [String],
    followers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    follow: {
        type: Number,
        default: 0,
    },
    pastEvents: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Event",
        },
    ],
    upcomingEvents: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Event",
        },
    ],
    eventsCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.EventPortfolioSchema.methods.addNewEventPortfolio = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.EventPortfolio = (0, mongoose_1.model)("EventPortfolio", exports.EventPortfolioSchema);
//# sourceMappingURL=eventPortfolio.schema.js.map