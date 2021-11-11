import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { IResult } from "./result.interface";
import { IResultModel, Result } from "./result.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import { IFormModel } from "../form/form.schema";
import mongoose from "mongoose";
export class ResultModel {
    public async fetchAll() {

        const data = await Result.find();

        return data;
    }

    public async fetch(id: string) {
        const data = await Result.findById(id);
        return data;
    }

    public async update(id: string, body: any) {
        const data = await Result.findByIdAndUpdate(id, body, {
            runValidators: true,
            new: true
        })

        return data;
    }

    public async delete(id: string) {
        await Result.deleteOne({ _id: id });
    }

    public async createResultBody(form: IFormModel) {
        console.log(form);
        const resultBody: any = {
            formId: form._id,
            mcq: [],
            number: []
        };

        for (let i = 0; i < form.questions.length; i++){
            const question: any = form.questions[i];
            const questionId = question._id;
            if (question.questiontype == 'mcq') {
        
                const options = [];

                for (let j = 0; j < question.options.length; j++){
                    const optionId = question.options[j]._id;

                    options.push({ optionId, count: 0 });
                }

                resultBody.mcq.push({ questionId, options });
            } else if (question.questiontype == 'number') {
                resultBody.number.push({ questionId, answers:[]});
            }
        }

        await this.add(resultBody);
    }

    public async add(body: IResultModel) {
        try {
            console.log(body);
            const q: IResultModel = new Result(body);
            console.log("hiii", q);
            const data: IResultModel = await q.addNewResult();
            console.log(data);
            return { data, alreadyExisted: false };
        } catch (e) {
            throw new Error(e);
        }
    };

    public async increaseCount(formId: string, questionId: string, optionId: string) {
        console.log(formId, questionId, optionId);
        const data = await Result.findOne({ formId: formId });

        for (let i = 0; i < data.mcq.length; i++){
            const question: any = data.mcq[i];
            let flag = 0;
            if (question.questionId == questionId) {
                for (let j = 0; j < question.options.length;j++){
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

        await data.save();
        return data;
    }

    // public async increaseNumber(formId: string, questionId: string,answer:number) {
    //     const data = await Result.findOneAndUpdate({ $and: [{ formId: formId }, { number: { $elemMatch: { questionId: questionId } } }] }, {
    //         $push:{"number.$.answer":answer}
    //     },{
    //         new:true
    //     });

    //     return data;
    // }

    public async increaseNumber(formId: string, questionId: string, answer: number) {
        // console.log(formId, questionId, optionId);
        const data = await Result.findOne({ formId: formId });

        for (let i = 0; i < data.number.length; i++) {
            const question: any = data.number[i];
            let flag = 0;
            if (question.questionId == questionId) {
                for (let j = 0; j < question.answers.length; j++) {
                    const answer = question.answers[j];

                    if (answer.answer == answer) {
                        answer.count = answer.count + 1;
                        // question.totalOptionCount = question.totalOptionCount + 1;
                        flag = 1;
                        break;
                    }
                }

                if (!flag) {
                    question.answers.push({ answer, count: 0 });
                    flag = 1;
                }
            }

            if (flag) {
                break;
            } 
        }

        await data.save();
        return data;
    }


    public async getMCQData(formId: string,questionId:string) {
        const data = await Result.findOne({ formId: formId });
        let optionPercentage = [];
        

        for (let i = 0; i < data.mcq.length; i++) {
            const question: any = data.mcq[i];

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

        return optionPercentage.length > 0 ? optionPercentage : new HTTP400Error(`No question found with questionId ${questionId}`);
    };

    public async getNumberData(formId: string, questionId: string) {
        const data = await Result.findOne({ formId: formId });


        for (let i = 0; i < data.number.length; i++) {
            const question: any = data.number[i];

            if (question.questionId == questionId) {
                return question.answers;
            }
        }

        return [];
    };
}

export default new ResultModel();