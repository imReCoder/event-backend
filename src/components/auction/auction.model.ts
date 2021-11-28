import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { IAuction } from "./auction.interface";
import { IAuctionModel, Auction } from "./auction.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
// import { sendMessage } from "./../../lib/services/textlocal";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import { IFormModel } from "../form/form.schema";
import mongoose from "mongoose";
import axios from "axios";
import transactionModel from "../transactions/transaction.model";
import { Transaction } from "../transactions/transaction.schema";
import auctionEventModel from "../auctionEvent/auctionEvent.model";
export class AuctionModel {
    public async fetchAll() {

        const data = await Auction.find();

        return data;
    }

    public async fetch(id: string) {
        const data = await Auction.findById(id);
        return data;
    }

    public async update(id: string, body: any) {
        const data = await Auction.findByIdAndUpdate(id, body, {
            runValidators: true,
            new: true
        })

        return data;
    }

    public async delete(id: string, auctionEventId: string) {
        await auctionEventModel.removeAuctionItems(auctionEventId, id);
        await Auction.deleteOne({ _id: id });
    }


    public async add(body: IAuctionModel,userId:string,auctionEventId:string) {
        try {
            console.log(body);
            body.creator = userId;
            body.auctionEventId = auctionEventId;

            // if (body.startDate) {
            //     body.startDate = new Date(body.startDate);
            // }


            // if (body.endDate) {
            //     body.endDate = new Date(body.endDate);
            // }

            // if(body.startDate < body.endDate){
            //     throw new HTTP400Error("Error in Dates");
            // }

            const q: IAuctionModel = new Auction(body);
            console.log("hiii", q);
            const data: IAuctionModel = await q.add();
            console.log(data);
            return data;
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };

    public async changeCurrentBid(auctionId:string,userId: string, amount: number) {
        try {

            const auction = await Auction.findById(auctionId);

            const body = {
                type: "Others",
                amount: amount,
                metadataType: "CREDIT",
                description: `getting return from Bidding for ${auctionId}`,
                auctionId
            }

            const transactionData = await this.transactionBodyCreator(body);

            if (transactionData) {
                const res = await this.masterToWalletTransaction(transactionData);

                if (res) {
            
                    const currentBid = {
                        user: userId,
                        amount
                    };

                    const data = await Auction.findOneAndUpdate({ _id: auctionId }, {
                        $set: { "currentBid": currentBid },
                        $push: { "previousBid": auction.currentBid }
                    },
                        { new: true });
            
                    return data;
                } else
                {
                    throw new HTTP400Error("Master wallet to  wallet transaction failed");
                }
                
            }

        } catch (e) {
            throw new HTTP400Error(e);
        }
    }

    public async fetchAuctionItemsByAuctionEvent(auctionEventId: string) {
        try {
            const auctionItems = await Auction.find({ auctionEventId: auctionEventId }).populate({
                path: 'auctionEventId'
            });

            return auctionItems;
        } catch (e) {
            throw new HTTP400Error(e);
        }
    }


    public async addImage(id: string, filelocation: string) {
        try {
            console.log(id);
            const data = await Auction.findOneAndUpdate({ _id: id }, {
                $push: { "images": filelocation }
            },
                { new: true });

            return data;
        } catch (e) {
            throw new HTTP400Error(e.message);
        }
    };

    public async axiosRequestor(url: string,axiosdata:any = {}) {
        try {
            const res = await axios({
                method: "POST",
                url,
                data: {
                    ...axiosdata
                }
            });

            return res;
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };

    public async transactionBodyCreator(body: any) {
        try {
            const transactionBody = {
                userId:body.userId,
                amount: body.amount,
                type: body.type,
                description: body.description,
                metadata: {
                    type: body.metadataType,
                    description: body.description,
                    auctionId:body.auctionId
                },
                status: "PENDING"
            }

            const transaction = new Transaction(transactionBody);

            const res = await transactionModel.create(transaction);

            if (!res) {
                throw new HTTP400Error("Transaction creation failed");
            }

            return transactionBody;
        } catch (e) {
            throw new HTTP400Error(e);
        }
    }

    public async walletToMasterTransaction(transactionBody :any ) {
        try {
            const apiKey = process.env.IKCDEALKEY;
            const url = `http://localhost:8000/wallet/removeFromWallet?apiKey=${apiKey}`;

            const res = await this.axiosRequestor(url, transactionBody);

            if (res.data.status) {

                const currentBid = await this.changeCurrentBid(transactionBody.metadata.auctionId, transactionBody.userId, transactionBody.amount);

                if (!currentBid) {
                    throw new HTTP400Error("Change of current Bid Failed");
                }

                console.log("Status transaction change");
                const transaction = await Transaction.findOneAndUpdate({ userId: transactionBody.userId }, {
                    $set: { "status": "TXN_SUCCESS" }
                }, {
                    new: true
                });

                console.log(transaction);

                if (transaction.status != "TXN_SUCCESS") {
                    throw Error(`Transaction status not updated for user ${transactionBody.userId}`);
                }

            } else {
                throw Error(`Making payment from masterWallet failed for user ${transactionBody.userId}`);
            }

            return res;
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };



    public async masterToWalletTransaction(transactionBody: any) {
        try {
            const apiKey = process.env.IKCDEALKEY;
            const url = `http://localhost:8000/wallet/addToWallet?apiKey=${apiKey}`;

            const res = await this.axiosRequestor(url, transactionBody);

            if (res.data.status) {

                console.log("Status transaction change");
                const transaction = await Transaction.findOneAndUpdate({ userId: transactionBody.userId }, {
                    $set: { "status": "TXN_SUCCESS" }
                }, {
                    new: true
                });

                console.log(transaction);

                if (transaction.status != "TXN_SUCCESS") {
                    throw Error(`Transaction status not updated for user ${transactionBody.userId}`);
                }

            } else {
                throw Error(`Making payment from masterWallet failed for user ${transactionBody.userId}`);
            }

            return res;
        } catch (e) {
            throw new HTTP400Error(e);
        }
    };

    public async bid(auctionId: string,amount:number,userId:string) {
        try {
            const auction = await Auction.findById(auctionId);

            if (amount < auction.startingBid || amount < auction.currentBid.amount) {
                throw new HTTP400Error("amount not sufficient to bid.")
            }

            const body = {
                type: "Others",
                amount: amount,
                metadataType: "DEBIT",
                description: `Bidding for ${auctionId}`,
                auctionId
            }

            const transactionData = await this.transactionBodyCreator(body);

            if (transactionData) {
                await this.walletToMasterTransaction(transactionData);
            } 
            

            return transactionData;

        } catch (e) {
            throw new HTTP400Error(e);
        }
    }

}

export default new AuctionModel();