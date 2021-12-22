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
const auction_model_1 = __importDefault(require("./auction.model"));
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
class AuctionController {
    constructor() {
        this.fetchAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("fetching all");
                responseHandler.reqRes(req, res).onFetch('FETCHED_ALL_ITEMS', yield auction_model_1.default.fetchAll()).send();
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
                const result = yield auction_model_1.default.add(req.body, req.userId, req.params.id);
                responseHandler.reqRes(req, res).onCreate("ITEM_ADDED", result).send();
            }
            catch (e) {
                console.log(e.message);
                next(responseHandler.sendError(e));
            }
        });
        this.fetchAuctionItemsByAuctionEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield auction_model_1.default.fetchAuctionItemsByAuctionEvent(req.params.auctionEventId);
                responseHandler.reqRes(req, res).onFetch("AUCTION_ITEMS", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.addImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log(req.file);
                // req.body.filename = req.file.originalname;
                req.body.locationUrl = req.file.location;
                const result = yield auction_model_1.default.addImage(req.params.id, req.body.locationUrl);
                console.log(result);
                responseHandler.reqRes(req, res).onCreate("FILE_UPLOADED", result).send();
            }
            catch (e) {
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
                console.log("fetch");
                responseHandler.reqRes(req, res).onCreate('ITEM_FOUND', yield auction_model_1.default.fetch(req.params.id)).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onCreate('UPDATED', yield auction_model_1.default.update(req.params.id, req.body)).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                yield auction_model_1.default.delete(req.params.id, req.params.auctioneventid);
                responseHandler.reqRes(req, res).onCreate('DELETED').send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.bid = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield auction_model_1.default.bid(req.params.id, req.query.amount, req.userId);
                responseHandler.reqRes(req, res).onCreate("Bid Successfull", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.searchItem = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield auction_model_1.default.searchItem(req.params.key, req.userId);
                responseHandler.reqRes(req, res).onCreate("Here is your search results", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.default = new AuctionController();
//# sourceMappingURL=auction.controller.js.map