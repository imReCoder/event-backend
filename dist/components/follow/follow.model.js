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
exports.FollowModel = void 0;
const follow_schema_1 = require("./follow.schema");
class FollowModel {
    addEvent(userId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = {
                    userId,
                    eventId
                };
                const q = new follow_schema_1.Follow(body);
                const data = q.add();
                return data;
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    ;
    removeEvent(userId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield follow_schema_1.Follow.findOneAndUpdate({ userId }, {
                    $set: { "eventId": null }
                }, {
                    new: true
                });
                return data;
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    ;
    addEventPortfolio(userId, eventPortfolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = {
                    userId,
                    eventPortfolioId
                };
                const q = new follow_schema_1.Follow(body);
                const data = q.add();
                return data;
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    ;
    removeEventPortfolio(userId, eventPortfolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield follow_schema_1.Follow.findOneAndUpdate({ userId }, {
                    $set: { "eventPortfolioId": null }
                }, {
                    new: true
                });
                return data;
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    ;
    isUserExist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield follow_schema_1.Follow.findOne({ userId });
                if (data) {
                    return { alreadyExist: true };
                }
                else
                    return { alreadyExist: false };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
}
exports.FollowModel = FollowModel;
exports.default = new FollowModel();
//# sourceMappingURL=follow.model.js.map