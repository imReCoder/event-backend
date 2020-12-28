import { NextFunction, Request, Response } from "express";
import { user as msg } from "../../lib/helpers/customMessage";
import ResponseHandler from "../../lib/helpers/responseHandler";
import userModel from "./user.model";


class UserController {

  public fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL, await userModel.fetchAll(req.query)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public fetchDailyStats = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL, await userModel.fetchDailyStats()).send();
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
        .onCreate(msg.CREATED, await userModel.add(req.body), msg.CREATED_DEC)
        .send();
    } catch (e) {
      console.log(e);
      next(responseHandler.sendError(e));
    }
  };

  public fetch = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onCreate(msg.CREATED, await userModel.fetch(req.params.id), msg.CREATED_DEC).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const data = await userModel.verifyOtp(req.params.id, +req.query.otp);
      res.set('X-Auth', data.token);
      responseHandler
        .reqRes(req, res)
        .onFetch("otp has been verified", data.data, "otp verified now you can go forward.")
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler
        .reqRes(req, res)
        .onFetch("The otp has been sent to your phone. Please verify", await userModel.login(req.body.phone))
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler
        .reqRes(req, res)
        .onFetch("The otp has been sent to your phone. Please verify", await userModel.login(req.body.phone, true))
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch(`Here are users`, await userModel.searchUsers(req.query)).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

}

export default new UserController;
