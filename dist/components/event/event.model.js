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
exports.EventModel = void 0;
const event_schema_1 = require("./event.schema");
// import { sendMessage } from "./../../lib/services/textlocal";
const httpErrors_1 = require("../../lib/utils/httpErrors");
class EventModel {
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = event_schema_1.Event.find();
            return data;
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = event_schema_1.Event.findById(id);
            return data;
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (body.startDate) {
                body.startDate = new Date(body.startDate);
            }
            if (body.endDate) {
                body.endDate = new Date(body.endDate);
            }
            const data = yield event_schema_1.Event.findByIdAndUpdate({ _id: id }, body, {
                runValidators: true,
                new: true
            });
            return data;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield event_schema_1.Event.deleteOne({ _id: id });
        });
    }
    add(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(body);
                body.creator = userId;
                body.startDate = new Date(body.startDate);
                body.endDate = new Date(body.endDate);
                const q = new event_schema_1.Event(body);
                // await likeModel.add(q._id);
                console.log("hiii", q);
                const data = yield q.addNewEvent();
                console.log(data);
                return { data, alreadyExisted: false };
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    addTicket(ticketId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventData = yield event_schema_1.Event.findByIdAndUpdate({ _id: eventId }, {
                    $addToSet: { "tickets": ticketId }
                }, {
                    runValidators: true,
                    new: true
                });
                console.log("event data is ", eventData);
                return eventData;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    fetchEventsForUser(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sortArgument = { createdAt: -1 };
                const data = yield this.getEvents(condition, sortArgument);
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    getEvents(condition, sortArgument) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = event_schema_1.Event.aggregate([
                    { $match: condition },
                    { $sort: sortArgument },
                    {
                        $lookup: {
                            from: "EventPortfolio",
                            localField: "eventPortfolioId",
                            foreignField: "_id",
                            as: "eventPortfolio"
                        }
                    },
                ]);
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    fetchEvents(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortArgument = { createdAt: -1 };
            const today = new Date();
            const condition = {
                expiryTime: { $gte: today },
                hidden: false
            };
            if (query.lastTime) {
                const dateObj = new Date(parseInt(query.lastTime, 10));
                condition.createdAt = { $lt: dateObj };
            }
            const data = yield this.getEvents(condition, sortArgument);
            console.log("Competitions Found :", data.length);
            const lastTime = (data.length > 0) ? data[data.length - 1].createdAt.getTime() : undefined;
            return {
                lastTime,
                length: data.length,
                data
            };
        });
    }
    ;
    addGallery(id, filelocation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const data = yield event_schema_1.Event.findOneAndUpdate({ _id: id }, {
                    $push: { "gallery": filelocation }
                }, { new: true });
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    increaseShareCount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const data = yield event_schema_1.Event.findOneAndUpdate({ _id: id }, {
                    $inc: { "shares": 1 }
                }, { new: true });
                console.log(data);
                return data;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
}
exports.EventModel = EventModel;
exports.default = new EventModel();
//# sourceMappingURL=event.model.js.map