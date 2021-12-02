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
exports.ResultModel = void 0;
const result_schema_1 = require("./result.schema");
// import { sendMessage } from "./../../lib/services/textlocal";
const httpErrors_1 = require("../../lib/utils/httpErrors");
class ResultModel {
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield result_schema_1.Result.find();
            return data;
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield result_schema_1.Result.findById(id);
            return data;
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield result_schema_1.Result.findByIdAndUpdate(id, body, {
                runValidators: true,
                new: true
            });
            return data;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield result_schema_1.Result.deleteOne({ _id: id });
        });
    }
    createResultBody(form) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(form);
            const resultBody = {
                formId: form._id,
                mcq: [],
                number: []
            };
            for (let i = 0; i < form.questions.length; i++) {
                const question = form.questions[i];
                const questionId = question._id;
                if (question.questiontype == 'mcq') {
                    const options = [];
                    for (let j = 0; j < question.options.length; j++) {
                        const optionId = question.options[j]._id;
                        options.push({ optionId, count: 0 });
                    }
                    resultBody.mcq.push({ questionId, options });
                }
                else if (question.questiontype == 'number') {
                    resultBody.number.push({ questionId, answers: [] });
                }
            }
            yield this.add(resultBody);
        });
    }
    add(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(body);
                const q = new result_schema_1.Result(body);
                console.log("hiii", q);
                const data = yield q.addNewResult();
                console.log(data);
                return { data, alreadyExisted: false };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    ;
    increaseCount(formId, questionId, optionId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(formId, questionId, optionId);
            const data = yield result_schema_1.Result.findOne({ formId: formId });
            for (let i = 0; i < data.mcq.length; i++) {
                const question = data.mcq[i];
                let flag = 0;
                if (question.questionId == questionId) {
                    for (let j = 0; j < question.options.length; j++) {
                        const option = question.options[j];
                        if (option.optionId == optionId) {
                            option.count = option.count + 1;
                            question.totalOptionCount = question.totalOptionCount + 1;
                            flag = 1;
                            break;
                        }
                    }
                }
                if (flag) {
                    break;
                }
            }
            yield data.save();
            return data;
        });
    }
    // public async increaseNumber(formId: string, questionId: string,answer:number) {
    //     const data = await Result.findOneAndUpdate({ $and: [{ formId: formId }, { number: { $elemMatch: { questionId: questionId } } }] }, {
    //         $push:{"number.$.answer":answer}
    //     },{
    //         new:true
    //     });
    //     return data;
    // }
    increaseNumber(formId, questionId, answer) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(formId, questionId, optionId);
            const data = yield result_schema_1.Result.findOne({ formId: formId });
            let flag = 0;
            for (let i = 0; i < data.number.length; i++) {
                const question = data.number[i];
                if (question.questionId == questionId) {
                    for (let j = 0; j < question.answers.length; j++) {
                        const answerData = question.answers[j];
                        // console.log("answer" + answer.answer + "parameter answer" + answer);
                        // console.log(answer.answer == answer);
                        if (answerData.answer == answer) {
                            answerData.count = answerData.count + 1;
                            // question.totalOptionCount = question.totalOptionCount + 1;
                            flag = 1;
                            break;
                        }
                    }
                    if (!flag) {
                        question.answers.push({ answer, count: 1 });
                        flag = 1;
                    }
                }
                if (flag) {
                    break;
                }
            }
            yield data.save();
            return data;
        });
    }
    getMCQData(formId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield result_schema_1.Result.findOne({ formId: formId });
            let optionPercentage = [];
            for (let i = 0; i < data.mcq.length; i++) {
                const question = data.mcq[i];
                if (question.questionId == questionId) {
                    for (let j = 0; j < question.options.length; j++) {
                        const option = question.options[j];
                        const optionId = option.optionId;
                        const value = (option.count * 100) / question.totalOptionCount;
                        optionPercentage.push({ optionId, value });
                    }
                    break;
                }
            }
            return optionPercentage.length > 0 ? optionPercentage : new httpErrors_1.HTTP400Error(`No question found with questionId ${questionId}`);
        });
    }
    ;
    getNumberData(formId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield result_schema_1.Result.findOne({ formId: formId });
            for (let i = 0; i < data.number.length; i++) {
                const question = data.number[i];
                if (question.questionId == questionId) {
                    return question.answers;
                }
            }
            return [];
        });
    }
    ;
}
exports.ResultModel = ResultModel;
exports.default = new ResultModel();
//# sourceMappingURL=result.model.js.map