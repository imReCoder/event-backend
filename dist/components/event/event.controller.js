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
const event_model_1 = __importDefault(require("./event.model"));
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const customMessage_1 = require("../../lib/helpers/customMessage");
const category_model_1 = __importDefault(require("../category/category.model"));
const like_model_1 = __importDefault(require("../likes/like.model"));
class EventController {
    constructor() {
        this.fetchAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("fetching all");
                responseHandler.reqRes(req, res).onFetch(customMessage_1.user.FETCH_ALL, yield event_model_1.default.fetchAll()).send();
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
                const result = yield event_model_1.default.add(req.body, req.userId);
                if (result.data && !result.alreadyExisted) {
                    const data = yield category_model_1.default.addEventCount(req.body.category);
                    if (!data.success) {
                        throw new Error("Category event count not increased");
                    }
                    req.params.id = req.body.eventPortfolioId;
                    req.params.eventId = result.data._id;
                    next();
                }
                // res.set("X-Auth")
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
        this.addCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log(req.userId);
                const data = yield category_model_1.default.create(req.body, req.userId);
                responseHandler.reqRes(req, res).onFetch("New Category Added", data).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fetch = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("fetch");
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.CREATED, yield event_model_1.default.fetch(req.params.id), customMessage_1.user.CREATED_DEC).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED, yield event_model_1.default.update(req.params.id, req.body)).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                yield event_model_1.default.delete(req.params.id);
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.getEvents = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Hello fetch", req.query);
                const data = yield event_model_1.default.fetchEventsForUser(req.query);
                responseHandler.reqRes(req, res).onFetch("Events Fetched", data).send();
            }
            catch (e) {
                responseHandler.sendError(e);
            }
        });
        this.addLike = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                yield like_model_1.default.addLike(req.params.id, req.userId);
                responseHandler.reqRes(req, res).onFetch("Like added");
            }
            catch (e) {
                responseHandler.sendError(e);
            }
        });
        this.removeLike = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                yield like_model_1.default.removeLike(req.params.id, req.userId);
                responseHandler.reqRes(req, res).onFetch("Like added");
            }
            catch (e) {
                responseHandler.sendError(e);
            }
        });
        this.uploadFile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                // @ts-ignore
                console.log(req.file);
                // req.body.filename = req.file.originalname;
                req.body.locationUrl = req.file.location;
                const result = yield event_model_1.default.addGallery(req.params.id, req.body.locationUrl);
                console.log(result);
                // s3UploadMulter.single('video')
                responseHandler.reqRes(req, res).onCreate("Video uploaded", result).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.increaseShareCount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield event_model_1.default.increaseShareCount(req.params.id);
                responseHandler.reqRes(req, res).onCreate("Increased share count", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.default = new EventController();
//# sourceMappingURL=event.controller.js.map