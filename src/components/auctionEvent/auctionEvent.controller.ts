import { NextFunction, Request, Response } from "express";
import auctionEventModel from "./auctionEvent.model";
import ResponseHandler from "../../lib/helpers/responseHandler";
import { user as msg } from "../../lib/helpers/customMessage";
import jwt from 'jsonwebtoken';
import { commonConfig } from "../../config";
import { IAuctionEvent } from "./auctionEvent.interface";
import { IAuctionEventModel } from "./auctionEvent.schema";
import Category from "../category/category.model";
import likeModel from "../likes/like.model";
class AuctionEventController {
    public fetchAll = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log("fetching all");
            responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL, await auctionEventModel.fetchAll()).send();
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
            const result = await auctionEventModel.add(req.body, req.userId);
            responseHandler.reqRes(req, res).onCreate("Auction Event Created", result).send();
        } catch (e) {
            console.log(e);
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
            responseHandler.reqRes(req, res).onCreate(msg.CREATED, await auctionEventModel.fetch(req.params.id), msg.CREATED_DEC).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.UPDATED, await auctionEventModel.update(req.params.id, req.body)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            await auctionEventModel.delete(req.params.id);
            responseHandler.reqRes(req, res).onCreate(msg.UPDATED).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };
}

export default new AuctionEventController();

