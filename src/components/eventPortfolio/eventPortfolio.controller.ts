import { NextFunction, Request, Response } from "express";
import eventPortfolio from "./eventPortfolio.model";
import ResponseHandler from "../../lib/helpers/responseHandler";
import { user as msg } from "../../lib/helpers/customMessage";
import { eventPortfolio as eventPortfolioMsg } from "../../lib/helpers/customMessage";
import jwt from 'jsonwebtoken';
import { commonConfig } from "../../config";
import { IEventPortfolio } from "./eventPortfolio.interface";
import { IEventPortfolioModel } from "./eventPortfolio.schema";
import eventController from "../event/event.controller";
import eventModel from "../event/event.model";

class EventPortfolioController {
    public fetchAll = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL, await eventPortfolio.fetchAll()).send();
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
            // res.set("X-Auth")
            responseHandler
                .reqRes(req, res)
                .onCreate(eventPortfolioMsg.CREATED, await eventPortfolio.add(req.body), eventPortfolioMsg.CREATED_DEC)
                .send();
        } catch (e) {
            console.log(e);
            next(responseHandler.sendError(e));
        }
    };

    public fetch = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.CREATED, await eventPortfolio.fetch(req.params.id), msg.CREATED_DEC).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.UPDATED, await eventPortfolio.update(req.params.id, req.body)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            await eventPortfolio.delete(req.params.id);
            responseHandler.reqRes(req, res).onCreate(msg.UPDATED).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }

    public addUpcomingEvent = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            console.log(req.params.id, req.params.eventId);
            const data = await eventPortfolio.addUpcomingEvents(req.params.id, req.params.eventId);
            if (data.success) {
                next();
            }
            // responseHandler.reqRes(req, res).onCreate("upcoming event added", data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }

    public addFollow = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            const data = await eventPortfolio.addFollow(req.params.id);

            responseHandler.reqRes(req, res).onCreate("Follow Count increased", data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }

    public addEventCount = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            console.log(req.params.id);
            const data = await eventPortfolio.addEvent(req.params.id);

            if (data.success) {
                const event = await eventModel.fetch(req.params.eventId);
                responseHandler.reqRes(req, res).onCreate("Event Count Increased", { data, event }).send();
            }
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }

    public addFollower = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            const data = await eventPortfolio.addFollower(req.params.id, req.userId);
            
            responseHandler.reqRes(req, res).onCreate("New Follower Added", data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }

    public removeFollower = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            const data = await eventPortfolio.removeFollower(req.params.id, req.userId);

            responseHandler.reqRes(req, res).onCreate("New Follower Added", data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }



    public uploadFile = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            // @ts-ignore
            console.log(req.file);
            // req.body.filename = req.file.originalname;
            req.body.locationUrl = req.file.location;
            const result = await eventPortfolio.addGallery(req.params.id, req.body.locationUrl);
            console.log(result);

            // s3UploadMulter.single('video')
            responseHandler.reqRes(req, res).onCreate("Video uploaded", result).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };
    
}

export default new EventPortfolioController();

