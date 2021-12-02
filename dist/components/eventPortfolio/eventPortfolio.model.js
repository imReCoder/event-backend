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
exports.EventPortfolioModel = void 0;
const eventPortfolio_schema_1 = require("./eventPortfolio.schema");
// import { sendMessage } from "./../../lib/services/textlocal";
const httpErrors_1 = require("../../lib/utils/httpErrors");
class EventPortfolioModel {
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = eventPortfolio_schema_1.EventPortfolio.find();
            return data;
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = eventPortfolio_schema_1.EventPortfolio.findById(id);
            return data;
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield eventPortfolio_schema_1.EventPortfolio.findByIdAndUpdate({ _id: id }, body, {
                runValidators: true,
                new: true
            });
            return data;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield eventPortfolio_schema_1.EventPortfolio.deleteOne({ _id: id });
        });
    }
    add(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(body);
                const q = new eventPortfolio_schema_1.EventPortfolio(body);
                console.log("hiii", q);
                const data = yield q.addNewEventPortfolio();
                console.log(data);
                return { data, alreadyExisted: false };
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    addUpcomingEvents(id, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const data = yield eventPortfolio_schema_1.EventPortfolio.findOneAndUpdate({ _id: id }, {
                    $push: { "upcomingEvents": eventId }
                }, {
                    new: true
                });
                return { data, success: true };
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    addPastEvents(id, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield eventPortfolio_schema_1.EventPortfolio.findOneAndUpdate(id, {
                    $push: { "pastEvents": eventId }
                }, {
                    new: true
                });
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    addEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield eventPortfolio_schema_1.EventPortfolio.findOneAndUpdate({ _id: id }, {
                    $inc: { "eventsCount": 1 }
                }, {
                    new: true
                });
                return { data, success: true };
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    addFollow(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield eventPortfolio_schema_1.EventPortfolio.findOneAndUpdate(id, {
                    $inc: { "follow": 1 }
                }, {
                    new: true
                });
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    isFollowerExist(id, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield eventPortfolio_schema_1.EventPortfolio.findOne({ $and: [{ _id: id }, { followers: followerId }] });
                console.log(data);
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    addFollower(id, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exist = yield this.isFollowerExist(id, followerId);
                if (!exist) {
                    const data = yield eventPortfolio_schema_1.EventPortfolio.findOneAndUpdate({ _id: id }, {
                        $push: { "followers": followerId },
                        $inc: { "follow": 1 }
                    }, {
                        new: true
                    });
                    return data;
                }
                else {
                    throw new httpErrors_1.HTTP400Error("User already exist as a follower");
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    removeFollower(id, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exist = yield this.isFollowerExist(id, followerId);
                if (exist) {
                    const data = yield eventPortfolio_schema_1.EventPortfolio.findOneAndUpdate({ _id: id }, {
                        $pull: { "followers": followerId },
                        $inc: { "follow": -1 }
                    }, {
                        new: true
                    });
                    return data;
                }
                else {
                    throw new httpErrors_1.HTTP400Error("User doesn't exist as a follower");
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    addGallery(id, filelocation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const data = yield eventPortfolio_schema_1.EventPortfolio.findOneAndUpdate({ _id: id }, {
                    $push: { "gallery": filelocation }
                }, { new: true });
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
}
exports.EventPortfolioModel = EventPortfolioModel;
exports.default = new EventPortfolioModel();
//# sourceMappingURL=eventPortfolio.model.js.map