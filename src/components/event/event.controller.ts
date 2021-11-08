import { NextFunction, Request, Response } from "express";
import eventModel from "./event.model";
import ResponseHandler from "../../lib/helpers/responseHandler";
import { user as msg } from "../../lib/helpers/customMessage";
import jwt from 'jsonwebtoken';
import { commonConfig } from "../../config";
import { IEvent } from "./event.interface";
import { IEventModel } from "./event.schema";
import Category from "../category/category.model";
import likeModel from "../likes/like.model";
class EventController {
    public fetchAll = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log("fetching all");
            responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL, await eventModel.fetchAll()).send();
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
            const result = await eventModel.add(req.body, req.userId);

            if (result.data && !result.alreadyExisted) {
                const data = await Category.addEventCount(req.body.category);
                if (!data.success) {
                    throw new Error("Category event count not increased");
                }
                req.params.id = req.body.eventPortfolioId;
                req.params.eventId = result.data._id;
                next();
            } 
            // res.set("X-Auth")
        } catch (e) {
            console.log(e);
            next(responseHandler.sendError(e));
        }
    };

    public addCategory = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log(req.userId);
            const data = await Category.create(req.body, req.userId as string)
            responseHandler.reqRes(req, res).onFetch("New Category Added", data).send();
        } catch (e) {
        // send error with next function.
            next(responseHandler.sendError(e));
        }
    };

    public fetch = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log("fetch");
            responseHandler.reqRes(req, res).onCreate(msg.CREATED, await eventModel.fetch(req.params.id), msg.CREATED_DEC).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.UPDATED, await eventModel.update(req.params.id, req.body)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            await eventModel.delete(req.params.id);
            responseHandler.reqRes(req, res).onCreate(msg.UPDATED).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public getEvents = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            console.log("Hello fetch", req.query);
            const data = await eventModel.fetchEventsForUser(req.query);
            responseHandler.reqRes(req, res).onFetch("Events Fetched",data).send();
        } catch (e) {
            responseHandler.sendError(e);
        }
    }

    public addLike = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            await likeModel.addLike(req.params.id, req.userId);

            responseHandler.reqRes(req, res).onFetch("Like added");
        } catch (e) {
            responseHandler.sendError(e);
        }
    }

    public removeLike = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            await likeModel.removeLike(req.params.id, req.userId);

            responseHandler.reqRes(req, res).onFetch("Like added");
        } catch (e) {
            responseHandler.sendError(e);
        }
    }
}

export default new EventController();

