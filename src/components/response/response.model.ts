import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { Response } from "./response.schema";
import { IResponseModel } from "./response.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import resultModel from "../result/result.model";

export class ResponseModel {
    public async fetchAll() {

        const data = await Response.find();

        return data;
    }

    public async fetch(id: string) {
        const data = await Response.findById(id);
        return data;
    }

    public async update(id: string, body: any) {
        const data = await Response.findByIdAndUpdate(id, body, {
            runValidators: true,
            new: true
        })

        return data;
    }

    public async delete(id: string) {
        await Response.deleteOne({ _id: id });
    }

    public async add(body: IResponseModel,userId:string) {
        try {
            console.log(body);
            body.userId = userId;
            const q: IResponseModel = new Response(body);
            console.log("hiii", q);
            const data: IResponseModel = await q.addNewResponse();
            await this.submitAnswer(data);
            console.log(data);
            return { data, alreadyExisted: false };
        } catch (e) {
            throw new Error(e);
        }
    };

    public async submitAnswer(responseBody: IResponseModel) {
        try {
            const formId = responseBody.formId;

            for (let i = 0; i < responseBody.answers.length; i++){
                const answer:any = responseBody.answers[i];

                const questionType = answer.questionType;
                const questionId = answer.questionId;
                console.log(formId, questionId, questionType);
                if (questionType == "mcq") {
                    const optionId = answer.answerId;

                    await resultModel.increaseCount(formId, questionId, optionId);
                } else if (questionType == "number") {
                    console.log(answer);
                    console.log(answer.answerText);
                    const answerText = Number(answer.answerText);
                    console.log(answerText);
                    await resultModel.increaseNumber(formId, questionId, answerText);
                }
            }
        } catch (e) {
            throw new HTTP400Error(e.message);
        }
    }
}

export default new ResponseModel();