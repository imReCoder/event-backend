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
            responseHandler.reqRes(req, res).onFetch('FETCHED_ALL_AUCTION_EVENTS', await auctionEventModel.fetchAll(req.query)).send();
        } catch (e) {
            // send error with next function.
            next(responseHandler.sendError(e));
        }
    };
    public upcoming = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log("fetching all");
            responseHandler.reqRes(req, res).onFetch('FETCHED_UPCOMING_AUCTION_EVENTS', await auctionEventModel.upcoming(req.query)).send();
        } catch (e) {
            // send error with next function.
            next(responseHandler.sendError(e));
        }
    };

    public pastEvents = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log("fetching all");
            responseHandler.reqRes(req, res).onFetch('FETCHED_UPCOMING_AUCTION_EVENTS', await auctionEventModel.past(req.query)).send();
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
            console.log("fetch by id");
            responseHandler.reqRes(req, res).onCreate('AUCTION_EVENT_ FOUND', await auctionEventModel.fetch(req.params.id)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate('UPDATED', await auctionEventModel.update(req.params.id, req.body)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            await auctionEventModel.delete(req.params.id);
            responseHandler.reqRes(req, res).onCreate('DELETED').send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public addIcon = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log(req.file);
            // req.body.filename = req.file.originalname;
            req.body.locationUrl = req.file.location;
            const result = await auctionEventModel.addIcon(req.params.id, req.body.locationUrl);
            console.log(result);

            responseHandler.reqRes(req, res).onCreate("FILE_UPLOADED", result).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };


    public addCoverImage = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log(req.file);
            // req.body.filename = req.file.originalname;
            req.body.locationUrl = req.file.location;
            const result = await auctionEventModel.addcoverImage(req.params.id, req.body.locationUrl);
            console.log(result);

            responseHandler.reqRes(req, res).onCreate("FILE_UPLOADED", result).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    
    public searchAuction = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            const data = await auctionEventModel.searchAuction(req.params.key, req.userId);

            responseHandler.reqRes(req, res).onCreate("Here is your search results", data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };
}

export default new AuctionEventController();

