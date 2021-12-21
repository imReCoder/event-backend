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
const auctionEvent_model_1 = __importDefault(require("./auctionEvent.model"));
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const customMessage_1 = require("../../lib/helpers/customMessage");
class AuctionEventController {
    constructor() {
        this.fetchAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("fetching all");
                responseHandler.reqRes(req, res).onFetch(customMessage_1.user.FETCH_ALL, yield auctionEvent_model_1.default.fetchAll(req.query)).send();
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
                const result = yield auctionEvent_model_1.default.add(req.body, req.userId);
                responseHandler.reqRes(req, res).onCreate("Auction Event Created", result).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
        // public addCategory = async (req: Request, res: Response, next: NextFunction) => {
        //     const responseHandler = new ResponseHandler();
        //     try {
        //         console.log(req.userId);
        //         const data = await Category.create(req.body, req.userId as string)
        //         responseHandler.reqRes(req, res).onFetch("New Category Added", data).send();
        //     } catch (e) {
        //         // send error with next function.
        //         next(responseHandler.sendError(e));
        //     }
        // };
        this.fetch = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("fetch by id");
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.CREATED, yield auctionEvent_model_1.default.fetch(req.params.id), customMessage_1.user.CREATED_DEC).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED, yield auctionEvent_model_1.default.update(req.params.id, req.body)).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                yield auctionEvent_model_1.default.delete(req.params.id);
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.addIcon = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log(req.file);
                // req.body.filename = req.file.originalname;
                req.body.locationUrl = req.file.location;
                const result = yield auctionEvent_model_1.default.addIcon(req.params.id, req.body.locationUrl);
                console.log(result);
                responseHandler.reqRes(req, res).onCreate("File Uploaded", result).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.addCoverImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log(req.file);
                // req.body.filename = req.file.originalname;
                req.body.locationUrl = req.file.location;
                const result = yield auctionEvent_model_1.default.addcoverImage(req.params.id, req.body.locationUrl);
                console.log(result);
                responseHandler.reqRes(req, res).onCreate("File Uploaded", result).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.searchAuction = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield auctionEvent_model_1.default.searchAuction(req.params.key, req.userId);
                responseHandler.reqRes(req, res).onCreate("Here is your search results", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.default = new AuctionEventController();
//# sourceMappingURL=auctionEvent.controller.js.map