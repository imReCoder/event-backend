import { NextFunction, Request, Response } from "express";
import { score as msg } from "../../lib/helpers/customMessage";
import ResponseHandler from "../../lib/helpers/responseHandler";
import Result from './result.model';

class ResultController {

    public create = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            req.body.Result = 0;
            responseHandler.reqRes(req, res).onCreate(msg.CREATED, await Result.create(req.body), msg.CREATED_DEC).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };


    public submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.SUBMIT_ANSWER, await Result.update(req.query, req.userId as string)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public guestsubmitAnswer = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.SUBMIT_ANSWER, await Result.guestResult(req.query)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public timedOut = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.SUBMIT_ANSWER, await Result.timedOut(req.query)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };

    public end = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(msg.SUBMIT_ANSWER, await Result.end(req.query)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };
}

export default new ResultController;