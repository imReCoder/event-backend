import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { IResult } from "./result.interface";
import { IResultModel, Result } from "./result.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import { IFormModel } from "../form/form.schema";

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
                    const optionId = question.options[j];

                    options.push({ optionId, count: 0 });
                }

                resultBody.mcq.push({ questionId, options });
            } else if (question.questiontype == 'number') {
                resultBody.number.push({ questionId, answer:[]});
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

    public async increaseCount(formId:string,questionId: string,optionId:string) {
        const data = await Result.findOne({ $and: [{ formId: formId }, { mcq: { $elemMatch: { questionId: questionId, options: optionId } } }] });

        console.log(data);
    }
}

export default new ResultModel();