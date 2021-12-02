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
exports.LikeModel = void 0;
const likes_schema_1 = require("./likes.schema");
// import { sendMessage } from "./../../lib/services/textlocal";
const httpErrors_1 = require("../../lib/utils/httpErrors");
class LikeModel {
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield likes_schema_1.Like.find();
            return data;
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield likes_schema_1.Like.findById(id);
            return data;
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield likes_schema_1.Like.findByIdAndUpdate(id, body, {
                runValidators: true,
                new: true
            });
            return data;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield likes_schema_1.Like.deleteOne({ _id: id });
        });
    }
    add(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(body);
                const q = new likes_schema_1.Like(body);
                console.log("hiii", q);
                const data = yield q.addNewLike();
                console.log(data);
                return { data, alreadyExisted: false };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    ;
    addLike(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield likes_schema_1.Like.findOneAndUpdate({ eventId: eventId }, {
                    $push: { "userId": userId }
                }, { new: true });
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
    removeLike(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield likes_schema_1.Like.findOneAndUpdate({ eventId: eventId }, {
                    $pull: { "userId": userId }
                }, { new: true });
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    ;
}
exports.LikeModel = LikeModel;
exports.default = new LikeModel();
//# sourceMappingURL=like.model.js.map