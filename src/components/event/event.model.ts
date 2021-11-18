import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { Event } from "./event.schema";
import { IEventModel } from "./event.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import { Aggregate } from "mongoose";
import likeModel from "../likes/like.model";

export class EventModel {
    public async fetchAll() {

        const data = Event.find();

        return data;
    }

    public async fetch(id: string) {
        const data = Event.findById(id);
        return data;
    }

  public async update(id: string, body: any) {
      
    if (body.startDate) {
      body.startDate = new Date(body.startDate);
    }

    if (body.endDate) {
      body.endDate = new Date(body.endDate);
    }

    const data = await Event.findByIdAndUpdate({ _id: id }, body, {
            runValidators: true,
            new: true
        })

        return data;
    }

    public async delete(id: string) {
        await Event.deleteOne({ _id: id });
    }

    public async add(body: IEventModel,userId:string) {
        try {
            console.log(body);
            body.creator = userId;
            body.startDate = new Date(body.startDate);
            body.endDate = new Date(body.endDate);
            const q: IEventModel = new Event(body);
            // await likeModel.add(q._id);
            console.log("hiii", q);
            const data: IEventModel = await q.addNewEvent();
            console.log(data);
            return { data, alreadyExisted: false };
        } catch (e) {
          throw new HTTP400Error(e);
        }
    };

    public async fetchEventsForUser(condition:any) {
        try {
            const sortArgument = {createdAt: -1};
            const data = await this.getEvents(condition, sortArgument);

            return data;
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };


  public async getEvents(condition: any, sortArgument: any) {
    try {
      const data: Aggregate<IEventModel[]> = Event.aggregate([
        { $match: condition },
        { $sort: sortArgument },
        {
          $lookup: {
            from: "EventPortfolio",
            localField: "eventPortfolioId",
            foreignField: "_id",
            as: "eventPortfolio"
          }
        },
      ]);
      return data;
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }

   public async fetchEvents(query: { lastTime?: string }) {
    const sortArgument = {createdAt: -1};

    const today = new Date();
    const condition: any = {
      expiryTime: {$gte: today},
      hidden: false
    };
    if (query.lastTime) {
      const dateObj = new Date(parseInt(query.lastTime, 10));
      condition.createdAt = {$lt: dateObj};
    }
    const data: IEventModel[] = await this.getEvents(condition, sortArgument);
    console.log("Competitions Found :", data.length);
    const lastTime = (data.length > 0) ? data[data.length - 1].createdAt.getTime() : undefined;
    return {
      lastTime,
      length: data.length,
      data
    };
  };

  public async addGallery(id: string, filelocation: string) {
    try {
      console.log(id);
      const data = await Event.findOneAndUpdate({ _id: id }, {
        $push: { "gallery": filelocation }
      },
        { new: true });
      
      return data;
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  };


  public async increaseShareCount(id: string) {
    try {
      console.log(id);
      const data = await Event.findOneAndUpdate({ _id: id }, {
        $inc: { "shares": 1 }
      },
        { new: true });
      
      console.log(data);
      return data;
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }



}

export default new EventModel();