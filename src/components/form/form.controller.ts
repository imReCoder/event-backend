import { NextFunction, Request, Response } from "express";
import formmodel from "./form.model";
import ResponseHandler from "../../lib/helpers/responseHandler";
import { user as msg } from "../../lib/helpers/customMessage";
import { commonConfig } from "../../config";
import { IForm } from "./form.interface";
import { IFormModel } from "./form.schema";
import resultModel from "../result/result.model";
import { formMsg } from "../../lib/helpers/customMessage";
class FormController {
    public fetchAll = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onFetch(formMsg.FETCH_ALL, await formmodel.fetchAll()).send();
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
                .onCreate(formMsg.CREATED, await formmodel.add(req.body,req.params.eventId), formMsg.CREATED_DEC)
                .send();
        } catch (e) {
            console.log(e);
            next(responseHandler.sendError(e));
        }
    };

    public fetch = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(formMsg.FETCH, await formmodel.fetch(req.params.id), msg.CREATED_DEC).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public fetchByEvent = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            responseHandler.reqRes(req, res).onFetch("Event Fetched", await formmodel.fetchByEventId(req.params.id)).send();
        } catch (e) {
            responseHandler.sendError(e);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(formMsg.UPDATED, await formmodel.update(req.params.id, req.body)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            await formmodel.delete(req.params.id);
            responseHandler.reqRes(req, res).onCreate(formMsg.UPDATED).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }

    public increaseCount = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            const data = await resultModel.increaseCount(req.params.id, '6188b45a1b598f9050651e4e', '6188b45a1b598f9050651e51');

            responseHandler.reqRes(req, res).onFetch("Count increased", data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }
}

export default new FormController();

