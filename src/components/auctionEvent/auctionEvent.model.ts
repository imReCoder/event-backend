import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { IAuctionEvent } from "./auctionEvent.interface";
import { IAuctionEventModel, AuctionEvent } from "./auctionEvent.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import { IFormModel } from "../form/form.schema";
import mongoose from "mongoose";
import axios from "axios";
import transactionModel from "../transactions/transaction.model";
import { Transaction } from "../transactions/transaction.schema";
export class AuctionEventModel {
    public async fetchAll() {

        const data = await AuctionEvent.find();

        return data;
    }

    public async fetch(id: string) {
        const data = await AuctionEvent.findById(id);
        return data;
    }

    public async update(id: string, body: any) {
        const data = await AuctionEvent.findByIdAndUpdate(id, body, {
            runValidators: true,
            new: true
        })

        return data;
    }

    public async delete(id: string) {
        await AuctionEvent.deleteOne({ _id: id });
    }


    public async add(body: IAuctionEventModel, userId: string) {
        try {
            console.log(body);
            body.creator = userId;

            if (body.startDate) {
                body.startDate = new Date(body.startDate);
            }


            if (body.endDate) {
                body.endDate = new Date(body.endDate);
            }

            const q: IAuctionEventModel = new AuctionEvent(body);
            const data: IAuctionEventModel = await q.add();
            return { data, alreadyExisted: false };
        } catch (e) {
            throw new Error(e);
        }
    };

    public async addIcon(id: string, filelocation: string) {
        try {
            console.log(id);
            const data = await AuctionEvent.findOneAndUpdate({ _id: id }, {
                $set: { "icon": filelocation }
            },
                { new: true });

            return data;
        } catch (e) {
            throw new HTTP400Error(e.message);
        }
    };

    public async addcoverImage(id: string, filelocation: string) {
        try {
            console.log(id);
            const data = await AuctionEvent.findOneAndUpdate({ _id: id }, {
                $set: { "coverImage": filelocation }
            },
                { new: true });

            return data;
        } catch (e) {
            throw new HTTP400Error(e.message);
        }
    };

    public async addAuctionItems(auctionEventId: string, auctionItemId: string) {
        const auctionEvent = await AuctionEvent.findOneAndUpdate({ _id: auctionEventId }, {
            $push: { "auctionItems": auctionItemId }
        }, { new: true });

        return auctionEvent;
    };


    public async removeAuctionItems(auctionEventId: string, auctionItemId: string) {
        const auctionEvent = await AuctionEvent.findOneAndUpdate({ _id: auctionEventId }, {
            $pull: { "auctionItems": auctionItemId }
        }, { new: true });

        return auctionEvent;
    };
}

export default new AuctionEventModel();