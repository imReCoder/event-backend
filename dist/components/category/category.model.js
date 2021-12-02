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
const utils_1 = require("../../lib/utils");
const category_schema_1 = require("./category.schema");
class CategoryModel {
    constructor() {
        this.default = 'name  icon';
    }
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield category_schema_1.Category.find({});
        });
    }
    fetchAllActive() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield category_schema_1.Category.find({ active: true }).select(Object.assign({}, (0, utils_1.mongoDBProjectFields)(this.default)));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield category_schema_1.Category.deleteOne({ _id: id });
        });
    }
    create(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId);
            body.creator = userId;
            let c = new category_schema_1.Category(body);
            c.add();
            return c;
        });
    }
    addEventCount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield category_schema_1.Category.findOneAndUpdate({ _id: id }, {
                    $inc: { "eventCount": 1 }
                }, {
                    new: true
                });
                return { success: true };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    ;
}
exports.default = new CategoryModel();
//# sourceMappingURL=category.model.js.map