import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { Form } from "./form.schema";
import { IFormModel } from "./form.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import resultModel from "../result/result.model";

export class FormModel {
    public async fetchAll() {

        const data = await Form.find();

        return data;
    }

    public async fetch(id: string) {
        const data = await Form.findById(id);
        return data;
    }

    public async update(id: string, body: any) {
        const data = await Form.findByIdAndUpdate(id, body, {
            runValidators: true,
            new: true
        })

        return data;
    }

    public async delete(id: string) {
        await Form.deleteOne({ _id: id });
    }

    public async add(body: IFormModel, eventId:string) {
        try {
            console.log(body);
            body.eventId = eventId;
            const q: IFormModel = new Form(body);
            console.log("hiii", q);
            await resultModel.createResultBody(body);
            const data: IFormModel = await q.addNewForm();
            console.log(data);
            return { data, alreadyExisted: false };
        } catch (e) {
            throw new Error(e);
        }
    };

    public async fetchByEventId(eventId: string) {
        try {
            const data = await Form.findOne({ eventId });

            return data;
        } catch (e) {
            throw new Error(e);
        }
    };
}

export default new FormModel();