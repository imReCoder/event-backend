import { NextFunction, Request, Response } from "express";
import auctionModel from "./auction.model";
import ResponseHandler from "../../lib/helpers/responseHandler";
import { user as msg } from "../../lib/helpers/customMessage";
import jwt from 'jsonwebtoken';
import { commonConfig } from "../../config";
import { IAuction } from "./auction.interface";
import { IAuctionModel } from "./auction.schema";
import Category from "../category/category.model";
import likeModel from "../likes/like.model";
class AuctionController {
    public fetchAll = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log("fetching all");
            responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL, await auctionModel.fetchAll()).send();
        } catch (e) {
            // send error with next function.
            next(responseHandler.sendError(e));
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            // const data =  await userModel.add(req.body);
            console.log(req.body);
            const result = await auctionModel.add(req.body, req.userId,req.params.id);
            responseHandler.reqRes(req, res).onCreate("Auction Item Created", result).send();
        } catch (e) {
            console.log(e);
            next(responseHandler.sendError(e));
        }
    };

    public fetchAuctionItemsByAuctionEvent = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            const data = await auctionModel.fetchAuctionItemsByAuctionEvent(req.params.auctionEventId);

            responseHandler.reqRes(req, res).onFetch("Auction Items Fetched", data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };


    public addImage = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log(req.file);
            // req.body.filename = req.file.originalname;
            req.body.locationUrl = req.file.location;
            const result = await auctionModel.addImage(req.params.id, req.body.locationUrl);
            console.log(result);

            responseHandler.reqRes(req, res).onCreate("File Uploaded", result).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    // public addCategory = async (req: Request, res: Response, next: NextFunction) => {
    //     const responseHandler = new ResponseHandler();
    //     try {
    //         console.log(req.userId);
    //         const data = await Category.create(req.body, req.userId as string)
    //         responseHandler.reqRes(req, res).onFetch("New Category Added", data).send();
    //     } catch (e) {
    //         // send error with next function.
    //         next(responseHandler.sendError(e));
    //     }
    // };

    public fetch = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log("fetch");
            responseHandler.reqRes(req, res).onCreate(msg.CREATED, await auctionModel.fetch(req.params.id), msg.CREATED_DEC).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.UPDATED, await auctionModel.update(req.params.id, req.body)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            await auctionModel.delete(req.params.id, req.params.auctioneventid);
            responseHandler.reqRes(req, res).onCreate(msg.UPDATED).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public bid = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            const data = await auctionModel.bid(req.params.auctionId, req.query.amount, req.userId);

            responseHandler.reqRes(req, res).onCreate("Bid Successfull", data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };
}

export default new AuctionController();

