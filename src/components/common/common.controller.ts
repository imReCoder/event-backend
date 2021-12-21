import ResponseHandler from "../../lib/helpers/responseHandler";
import { NextFunction, Request, Response } from "express";
import commonModel from "./common.model";

export class CommonController{
    public async search(req:Request,res:Response,next:NextFunction){
        const responseHandler = new ResponseHandler();
        try {
            const data = await commonModel.search(req.params.key);

            responseHandler.reqRes(req, res).onFetch("Auction Items Fetched", data).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    }
}

export default new CommonController();