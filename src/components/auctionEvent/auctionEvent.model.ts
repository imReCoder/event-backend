import { mongoDBProjectFields } from './../../lib/utils/index';
import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { IAuctionEvent } from "./auctionEvent.interface";
import { IAuctionEventModel, AuctionEvent } from "./auctionEvent.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
import { ObjectID } from "bson";

// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import { IFormModel } from "../form/form.schema";
import mongoose from "mongoose";
import axios from "axios";
import transactionModel from "../transactions/transaction.model";
import { Transaction } from "../transactions/transaction.schema";
const fieldsOfUser = 'image firstName';
const defaults = 'title starDate endDate description type auctionItems createdAt updatedAt icon coverImage'
export class AuctionEventModel {
    public async fetchAll(body:any) {
        console.log("fetch all for type ",body.type);
        let condition={};
        if(body.type=='timed'){
            condition = {type:"timed"};
            return await this.fetchAuctionEventByCondition(condition);
        }else if(body.type=='live'){
            condition = {type:"live"};
            return await this.fetchAuctionEventByCondition(condition);
        }else{
            condition = {};
            return await this.fetchAuctionEventByCondition(condition);
        }
    }


    public async fetch(id: string) {
        const conidtion = {_id:new ObjectID(id)};
        const data = this.fetchAuctionEventByCondition(conidtion)
        return data;
    }

    public async fetchAuctionEventByCondition(condition:any) {
                const data = await AuctionEvent.aggregate([
            {
              $match:condition,
            },
         
            {
              $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: { path: "$user" },
            },
            {
                $project: {
                    hosted_by:"$user.firstName",
                    hoste_by_image:"$user.image",
                    totalItems:{$size:"$auctionItems"},
                  ...mongoDBProjectFields(defaults),
                },
              },
           
          ])
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
            console.log("start date",body.startDate," endDate",body.endDate);
            
            // if(body.startDate.getTime() < body.endDate.getTime()){
            //     throw new HTTP400Error("Start date should be lesss than end date");
            // }

            const q: IAuctionEventModel = new AuctionEvent(body);
            const data: IAuctionEventModel = await q.add();
            return data;
        } catch (e) {
            console.log(e.message);
            
            throw new HTTP400Error(e.message);
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
    public async searchAuction(key:string,userId:string){
        console.log("key is ",key);
        let data = await AuctionEvent.find({ title: { $regex: key, $options: "i" }});
        console.log("data is",data);
        
        if(!data.length) throw  new HTTP400Error("No results");
        return data;
    }
}

export default new AuctionEventModel();