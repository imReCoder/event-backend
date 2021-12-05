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
const eventPortfolio_model_1 = __importDefault(require("./eventPortfolio.model"));
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const customMessage_1 = require("../../lib/helpers/customMessage");
const customMessage_2 = require("../../lib/helpers/customMessage");
const event_model_1 = __importDefault(require("../event/event.model"));
class EventPortfolioController {
    constructor() {
        this.fetchAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch(customMessage_1.user.FETCH_ALL, yield eventPortfolio_model_1.default.fetchAll()).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                // const data =  await userModel.add(req.body);
                console.log(req.body);
                // res.set("X-Auth")
                responseHandler
                    .reqRes(req, res)
                    .onCreate(customMessage_2.eventPortfolio.CREATED, yield eventPortfolio_model_1.default.add(req.body), customMessage_2.eventPortfolio.CREATED_DEC)
                    .send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
        this.fetch = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.CREATED, yield eventPortfolio_model_1.default.fetch(req.params.id), customMessage_1.user.CREATED_DEC).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED, yield eventPortfolio_model_1.default.update(req.params.id, req.body)).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                yield eventPortfolio_model_1.default.delete(req.params.id);
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.addUpcomingEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log(req.params.id, req.params.eventId);
                const data = yield eventPortfolio_model_1.default.addUpcomingEvents(req.params.id, req.params.eventId);
                if (data.success) {
                    next();
                }
                // responseHandler.reqRes(req, res).onCreate("upcoming event added", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.addFollow = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield eventPortfolio_model_1.default.addFollow(req.params.id);
                responseHandler.reqRes(req, res).onCreate("Follow Count increased", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.addEventCount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log(req.params.id);
                const data = yield eventPortfolio_model_1.default.addEvent(req.params.id);
                if (data.success) {
                    const event = yield event_model_1.default.fetch(req.params.eventId);
                    responseHandler.reqRes(req, res).onCreate("Event Count Increased", { data, event }).send();
                }
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.addFollower = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield eventPortfolio_model_1.default.addFollower(req.params.id, req.userId);
                responseHandler.reqRes(req, res).onCreate("New Follower Added", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.removeFollower = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield eventPortfolio_model_1.default.removeFollower(req.params.id, req.userId);
                responseHandler.reqRes(req, res).onCreate("New Follower Added", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.uploadFile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                // @ts-ignore
                console.log(req.file);
                // req.body.filename = req.file.originalname;
                req.body.locationUrl = req.file.location;
                const result = yield eventPortfolio_model_1.default.addGallery(req.params.id, req.body.locationUrl);
                console.log(result);
                // s3UploadMulter.single('video')
                responseHandler.reqRes(req, res).onCreate("Video uploaded", result).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.default = new EventPortfolioController();
//# sourceMappingURL=eventPortfolio.controller.js.map