import { NextFunction, Request, Response } from "express";
import resultmodel from "./result.model";
import ResponseHandler from "../../lib/helpers/responseHandler";
import { user as msg } from "../../lib/helpers/customMessage";
import jwt from 'jsonwebtoken';
import { commonConfig } from "../../config";
import { IResult } from "./result.interface";
import { IResultModel } from "./result.schema";

class ResultController {
    public getMCQData = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            const data = await resultmodel.getMCQData(req.params.formId, req.query.questionId);

            responseHandler.reqRes(req, res).onFetch("MCQ Question Data Fetched", data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }

    public getNumberData = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            const data = await resultmodel.getNumberData(req.params.formId, req.query.questionId);

            responseHandler.reqRes(req, res).onFetch("NUmber Question Data Fetched", data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }
}

export default new ResultController();

