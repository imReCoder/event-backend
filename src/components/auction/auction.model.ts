import { User } from "./../user/user.schema";
import { getPaginationInfo, mongoDBProjectFields } from "./../../lib/utils/index";
import {
  generateToken,
  imageUrl,
  isValidMongoId,
  otpGenerator,
} from "../../lib/helpers";
import { IAuction } from "./auction.interface";
import { IAuctionModel, Auction } from "./auction.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from "bcrypt";
// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import { IFormModel } from "../form/form.schema";
import mongoose from "mongoose";
import axios from "axios";
import transactionModel from "../transactions/transaction.model";
import { Transaction } from "../transactions/transaction.schema";
import auctionEventModel from "../auctionEvent/auctionEvent.model";
import { AuctionEvent } from "../auctionEvent/auctionEvent.schema";
import { ObjectID } from "bson";

const defaults =
  "title startTime endTime description type startingBid lastBid estimate lot previousBid auctionEventId images currentBid createdAt updatedAt selling_info";
  
const defaultsMin =
"title description type startingBidauctionEventId images currentBid";

export class AuctionModel {
  public async fetchAll() {
    const data = await this.fetchAuctionItemsByCondition({});
    if (!data) throw new HTTP400Error("ITEMS_NOT_FOUND");

    return data;
  }

  public async fetch(id: string) {
    const data = await Auction.findById(id);
    if (!data) throw new HTTP400Error("ITEM_NOT_FOUND");

    return data;
  }

  public async update(id: string, body: any) {
    const data = await Auction.findByIdAndUpdate(id, body, {
      runValidators: true,
      new: true,
    });

    return data;
  }

  public async fetchAuctionItemsByCondition(condition: any,pagination:boolean=false,pageNo:number=1) {
   console.log("page no is ",pageNo);
   
    let data;
    if(pagination){
        const {skip,limit} = getPaginationInfo(pageNo);
     data = await Auction.aggregate([
      {
        $match: condition,
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
      { "$limit": skip+limit },
      { "$skip": skip },
      {
        $project: {
          hosted_by: "$user.firstName",
          hoste_by_image: "$user.image",
          total_bids:{$add:[{$size:"$previousBid"},1]},
          ...mongoDBProjectFields(defaults),
        },
      },
    ]);
}else{
     data = await Auction.aggregate([
        {
          $match: condition,
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
            hosted_by: "$user.firstName",
            hoste_by_image: "$user.image",
            total_bids:{$add:[{$size:"$previousBid"},1]},
            ...mongoDBProjectFields(defaults),
          },
        },
      ]);
}
    if (!data) throw new HTTP400Error("ITEMS_NOT_FOUND");

    return data;
  }

  public async delete(id: string, auctionEventId: string) {
    await auctionEventModel.removeAuctionItems(auctionEventId, id);
    await Auction.deleteOne({ _id: id });
  }

  public async add(
    body: IAuctionModel,
    userId: string,
    auctionEventId: string
  ) {
    try {
      console.log("body is ", body);
      body.creator = userId;
      body.auctionEventId = auctionEventId;

      const eventData = await AuctionEvent.findById(auctionEventId).lean();
      if (!eventData) throw new HTTP400Error("Auction event not found");
      body.startTime = eventData.startTime;
      body.endTime = eventData.endTime;
      // if (body.startDate) {
      //     body.startDate = new Date(body.startDate);
      // }

      // if (body.endDate) {
      //     body.endDate = new Date(body.endDate);
      // }

      // if(body.startDate < body.endDate){
      //     throw new HTTP400Error("Error in date");
      // }

      const q: IAuctionModel = new Auction(body);

      const data: IAuctionModel = await q.add();

      const auctionEventUpdate = await AuctionEvent.findByIdAndUpdate(
        auctionEventId,
        { $push: { auctionItems: q._id } },
        { new: true, upsert: true }
      );

      return data;
    } catch (e) {
      console.log(e);

      throw new HTTP400Error(e.message);
    }
  }

  public async returnIkc(auctionId: string, userId: string, amount: number) {
    try {
      const user = await User.findById(userId);
      const body = {
        type: "Others",
        amount: amount,
        phone: user.phone,
        metadataType: "Credit",
        description: `getting return from Bidding for ${auctionId}`,
        auctionId,
        userId,
      };
      console.log("returning ikc ", body);

      const transactionData = await this.transactionBodyCreator(body);
      const paymentBody = {
        type: "Others",
        amount: amount,
        phone: user.phone,
        metadataType: "Credit",
        description: `getting return from Bidding for ${auctionId}`,
        auctionId,
        userId,
        transactionId: transactionData._id,
      };
      const res = await this.masterToWalletTransaction(paymentBody);
      if (!res) throw new HTTP400Error("Refund Faild for ", paymentBody.userId);
      const transaction = await Transaction.findOneAndUpdate(
        { _id: paymentBody.transactionId },
        {
          $set: { status: "Returned" },
        },
        {
          new: true,
        }
      );
      console.log("status updated for transaciton ", transaction);

      return res;
    } catch (e) {
      console.log(e);
      throw new HTTP400Error(e.message);
    }
  }

  public async changeCurrentBid(
    auctionId: string,
    userId: string,
    amount: number
  ) {
    try {
      const auction = await Auction.findById(auctionId);
      let isPreviousBid = false;
      let lastBid;
      let res;
      if (auction.currentBid && auction.currentBid.user) {
        isPreviousBid = true;
        lastBid = auction.currentBid;
        console.log("prev bid ", lastBid);
        res = await this.returnIkc(auctionId, lastBid.user, lastBid.amount);
      }

      if (res || !isPreviousBid) {
        const currentBid = {
          user: userId,
          amount,
        };

        const data = await Auction.findOneAndUpdate(
          { _id: auctionId },
          {
            $set: { currentBid: currentBid },
            $push: { previousBid: auction.currentBid },
          },
          { new: true }
        );

        return data;
      } else {
        throw new HTTP400Error("Master wallet to  wallet transaction failed");
      }
    } catch (e) {
      console.log(e);

      throw new HTTP400Error(e.message);
    }
  }

  public async fetchAuctionItemsByAuctionEventMin(auctionEventId: string) {
    try {
        const condition = {auctionEventId:new ObjectID(auctionEventId)};
      const auctionItems = await this.fetchAuctionItemsByConditionMin(condition);

      return auctionItems;
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }

  
  public async fetchAuctionItemsByAuctionEvent(auctionEventId: string) {
    try {
        const condition = {auctionEventId:new ObjectID(auctionEventId)};
      const auctionItems = await this.fetchAuctionItemsByCondition(condition);

      return auctionItems;
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }
  public async fetchAuctionItemsByConditionMin(condition:any,pagination:boolean=false,pageNo:number=1){

    let data;
      if(pagination){
          const {skip,limit} = getPaginationInfo(pageNo);
           data = await Auction.aggregate([
              {
                  $match: condition,
                },
                { "$limit":skip+ limit },
                { "$skip": skip },
                {
                    $project: {
                        
                        total_bids:{$add:[{$size:"$previousBid"},1]},
                        ...mongoDBProjectFields(defaultsMin),
                    },
                },
            ]);
        }else{
            data = await Auction.aggregate([
                {
                    $match: condition,
                  },
        
                  {
                      $project: {
                          
                          total_bids:{$add:[{$size:"$previousBid"},1]},
                          ...mongoDBProjectFields(defaultsMin),
                      },
                  },
              ]);
        }
            if (!data) throw new HTTP400Error("ITEMS_NOT_FOUND");
            
            return data;
  }

  public async addImage(id: string, filelocation: string) {
    try {
      console.log(id);
      const data = await Auction.findOneAndUpdate(
        { _id: id },
        {
          $push: { images: filelocation },
        },
        { new: true }
      );

      return data;
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  }

  public async axiosRequestor(url: string, axiosdata: any = {}) {
    try {
      const res = await axios({
        method: "POST",
        url,
        data: {
          ...axiosdata,
        },
      });

      return res;
    } catch (e) {
      console.log(e);

      throw new HTTP400Error(e.message);
    }
  }

  public async transactionBodyCreator(body: any) {
    try {
      const transactionBody = {
        userId: body.userId,
        amount: body.amount,
        type: body.type,
        description: body.description,
        phone: body.phone,
        metadata: {
          type: body.metadataType,
          description: body.description,
          auctionId: body.auctionId,
        },
        status: "PENDING",
      };

      const transaction = new Transaction(transactionBody);

      const res = await transaction.save();

      if (!res) {
        throw new HTTP400Error("Transaction creation failed");
      }

      return res;
    } catch (e) {
      console.log(e);

      throw new HTTP400Error(e.message);
    }
  }

  public async walletToMasterTransaction(transactionBody: any) {
    try {
      const apiKey = process.env.IKCDEALKEY;
      const url = `${process.env.IKC_MASTER_WALLET_URI}/wallet/addToMasterWallet?apiKey=${apiKey}`;
      console.log("url is ", url);

      const res = await this.axiosRequestor(url, transactionBody);

      if (res.data.status) {
        const currentBid = await this.changeCurrentBid(
          transactionBody.metadata.auctionId,
          transactionBody.userId,
          transactionBody.amount
        );

        if (!currentBid) {
          throw new HTTP400Error("Change of current Bid Failed");
        }

        const transaction = await Transaction.findOneAndUpdate(
          { _id: transactionBody.transactionId },
          {
            $set: { status: "TXN_SUCCESS" },
          },
          {
            new: true,
          }
        );
        console.log("Status transaction change", transaction);

        if (transaction.status != "TXN_SUCCESS") {
          throw Error(
            `Transaction status not updated for user ${transactionBody.userId}`
          );
        }
      } else {
        throw Error(
          `Making payment from masterWallet failed for user ${transactionBody.userId}`
        );
      }

      return res;
    } catch (e) {
      console.log(e);

      throw new HTTP400Error(e.message);
    }
  }

  public async masterToWalletTransaction(transactionBody: any) {
    try {
      const apiKey = process.env.IKCDEALKEY;
      const url = `${process.env.IKC_MASTER_WALLET_URI}/wallet/addToWallet?apiKey=${apiKey}`;

      const res = await this.axiosRequestor(url, transactionBody);

      if (res.data.status) {
        console.log("Status transaction change");
        const transaction = await Transaction.findOneAndUpdate(
          { userId: transactionBody.userId },
          {
            $set: { status: "TXN_SUCCESS" },
          },
          {
            new: true,
          }
        );

        if (transaction.status != "TXN_SUCCESS") {
          throw Error(
            `Transaction status not updated for user ${transactionBody.userId}`
          );
        }
      } else {
        throw Error(
          `Making payment from masterWallet failed for user ${transactionBody.userId}`
        );
      }

      return res;
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }

  public async bid(auctionId: string, amount: number, userId: string) {
    try {
      console.log("bid request for ", amount, " ", auctionId);

      const user = await User.findById(userId);

      if (!user.phone)
        throw new HTTP400Error(
          "User phone number is not added. Add phone number to continue.."
        );
      const auction = await Auction.findById(auctionId);

      if (amount < auction.startingBid || amount < auction.currentBid.amount) {
        console.log("not sufficient amount");
        throw new HTTP400Error("amount not sufficient to bid.");
      }

      const transactionBody = {
        type: "Others",
        amount: amount,
        metadataType: "Debit",
        description: `Bidding for ${auctionId}`,
        phone: user.phone,
        auctionId,
        userId,
      };

      const transactiondetails = await this.transactionBodyCreator(
        transactionBody
      );

      const paymentBody = {
        phone: user.phone,
        amount: transactionBody.amount,
        userId: transactionBody.userId,
        isFreebie: false,
        isPlatform: true,
        metadata: {
          type: transactionBody.metadataType,
          description: transactionBody.description,
          auctionId: transactionBody.auctionId,
        },
        description: transactionBody.description,
        transactionId: transactiondetails._id,
      };
      console.log("payment body is ", paymentBody);

      if (transactiondetails) {
        await this.walletToMasterTransaction(paymentBody);
      }

      return transactiondetails;
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  }

  public async searchItem(key: string, userId: string) {
    console.log("key is ", key);
    let data = await Auction.find({ title: { $regex: key, $options: "i" } });
    console.log("data is", data);

    if (!data.length) throw new HTTP400Error("No results");
    return data;
  }

  public async updateTags(auctionId: string, tags: String[], userId: string) {
    let data = await Auction.findByIdAndUpdate(
      auctionId,
      { tags: tags },
      { new: true }
    );
    console.log("data is", data);
    return data;
  }

  public async fetchSimilar(auctionId: string,pageNo:string = "1",userId: string) {
    try {
        console.log("page is",pageNo);
        
      const auctionData = await Auction.findById(auctionId).lean();
      if (!auctionData) throw new HTTP400Error("AUCTION_NOT_FOUND");
      const tags = auctionData.tags;
      if (!tags || !tags.length) throw new HTTP400Error("NO_TAGS_FOUND");
      const insesitiveTags: any = [];
      tags.forEach(function (item: string) {
        var re = new RegExp(item, "i");
        insesitiveTags.push(re);
      });
      const condition = { tags: { $in: insesitiveTags } };
      const similarAuctions = await this.fetchAuctionItemsByCondition(condition,true,Number(pageNo));
      console.log("found similar auctions : ", similarAuctions.length);
      if (!similarAuctions || !similarAuctions.length)
        throw new HTTP400Error("No_SIMILAR_AUCTIONS_FOUND");
      return similarAuctions;
    } catch (err) {
      console.log(err);

      throw new HTTP400Error(err.message);
    }
  }
  public async fetchSimilarMin(auctionId: string,pageNo:string = "1",userId: string) {
    try {
        console.log("page is",pageNo);
        
      const auctionData = await Auction.findById(auctionId).lean();
      if (!auctionData) throw new HTTP400Error("AUCTION_NOT_FOUND");
      const tags = auctionData.tags;
      if (!tags || !tags.length) throw new HTTP400Error("NO_TAGS_FOUND");
      const insesitiveTags: any = [];
      tags.forEach(function (item: string) {
        var re = new RegExp(item, "i");
        insesitiveTags.push(re);
      });
      const condition = { tags: { $in: insesitiveTags } };
      const similarAuctions = await this.fetchAuctionItemsByConditionMin(condition,true,Number(pageNo));
      console.log("found similar auctions : ", similarAuctions.length);
      if (!similarAuctions || !similarAuctions.length)
        throw new HTTP400Error("No_SIMILAR_AUCTIONS_FOUND");
      return similarAuctions;
    } catch (err) {
      console.log(err);

      throw new HTTP400Error(err.message);
    }
  }


}

export default new AuctionModel();
