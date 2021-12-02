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
exports.ikcPool = void 0;
const axios_1 = __importDefault(require("axios"));
const httpErrors_1 = require("../../lib/utils/httpErrors");
class ikcPool {
    deductIKC(userId, cost) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { data } = yield axios_1.default.get('http');
                if (data.success) {
                    return { proceed: true };
                }
                else {
                    return { proceed: false };
                }
            }
            catch (e) {
                console.log(e);
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
}
exports.ikcPool = ikcPool;
exports.default = new ikcPool();
//# sourceMappingURL=ikcPool.model.js.map