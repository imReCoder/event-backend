import { NextFunction, Request, Response } from "express";
import formmodel from "./form.model";
import ResponseHandler from "../../lib/helpers/responseHandler";
import { user as msg } from "../../lib/helpers/customMessage";
import { commonConfig } from "../../config";
import { IForm } from "./form.interface";
import { IFormModel } from "./form.schema";

class FormController {
    public fetchAll = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL, await formmodel.fetchAll()).send();
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
                .onCreate(msg.CREATED, await formmodel.add(req.body,req.params.eventId), msg.CREATED_DEC)
                .send();
        } catch (e) {
            console.log(e);
            next(responseHandler.sendError(e));
        }
    };

    public fetch = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.CREATED, await formmodel.fetch(req.params.id), msg.CREATED_DEC).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public fetchByEvent = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            responseHandler.reqRes(req, res).onFetch("Event Fetched", await formmodel.fetchByEventId(req.params.eventId));
        } catch (e) {
            responseHandler.sendError(e);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.UPDATED, await formmodel.update(req.params.id, req.body)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            await formmodel.delete(req.params.id);
            responseHandler.reqRes(req, res).onCreate(msg.UPDATED).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }
}

export default new FormController();

