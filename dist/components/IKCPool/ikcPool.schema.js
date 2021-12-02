"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ikcPool = void 0;
const mongoose_1 = require("mongoose");
let ikcPoolSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'quizRoom', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'deducted', 'dropped', 'cancelled', 'accepted'], required: true },
    notify: Boolean
});
ikcPoolSchema.index({ userId: 1, roomId: 1 }, { unique: true });
exports.ikcPool = (0, mongoose_1.model)('ikcPool', ikcPoolSchema);
//# sourceMappingURL=ikcPool.schema.js.map