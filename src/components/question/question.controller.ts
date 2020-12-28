import { NextFunction, Request, Response } from "express";
import Ques from './question.model';
import { ques as msg } from '../../lib/helpers/customMessage'
import ResponseHandler from "../../lib/helpers/responseHandler";

class QuesController {

    public create = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.CREATED, await Ques.create(req.body, req.userId as string), msg.CREATED_DEC).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public fetch = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.CREATED, await Ques.fetchById(req.params.id), msg.CREATED_DEC).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public fetchAll = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            const data = await Ques.fetchAllQuestions(req.query);
            responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL, data).send();
        } catch (e) {
            // send error with next function.
            next(responseHandler.sendError(e));
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            req.body.creator = req.userId;
            responseHandler.reqRes(req, res).onCreate(msg.UPDATED, await Ques.update(req.params.id, req.body)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            const data = await Ques.delete(req.params.id);
            responseHandler.reqRes(req, res).onFetch(msg.UPDATED, data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public fetchAnswer = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            const data = await Ques.delete(req.params.id);
            responseHandler.reqRes(req, res).onFetch(msg.UPDATED, data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };
}

export default new QuesController;