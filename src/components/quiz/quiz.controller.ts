import { NextFunction, Request, Response } from "express";
import { quiz as msg } from "../../lib/helpers/customMessage";
import ResponseHandler from "../../lib/helpers/responseHandler";
import Category from "../category/category.model";
import Quiz from "./quiz.model";

class QuizController {

  public fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const data = await Quiz.fetchQuiz(req.query);
      responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL, data).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public addCategory = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const data = await Category.create(req.body, req.userId as string)
      responseHandler.reqRes(req, res).onFetch(msg.CATEGORY, data).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onCreate(msg.CREATED, await Quiz.create(req.body, req.userId as string), msg.CREATED_DEC).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public fetchAllQuizByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL,await Quiz.fetchByCategory(req.query,req.userId as string)).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public fetchById = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch(msg.CREATED, await Quiz.fetchById(req.params.id, req.userId as string), msg.CREATED_DEC).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onCreate(msg.UPDATED, await Quiz.update(req.params.id, req.body)).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const data = await Quiz.delete(req.params.id);
      responseHandler.reqRes(req, res).onFetch(msg.UPDATED, data).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };


  public start = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch(msg.START, await Quiz.start(req.userId as string, req.query.quizId)).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };


  public ruleBook = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch('Here is our quiz rule book', { pdf: Quiz.rulePdf }).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };


  public findAllActiveCategories = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch(msg.CATEGORY_INFO, await Category.fetchAllActive()).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public unlockLevel = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onCreate(msg.CREATED, await Quiz.unlockNextLevel(req.query,req.userId as string)).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public takeHint = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
        responseHandler.reqRes(req, res).onFetch('Hint Taken',await Quiz.takeHint(req.query,req.userId as string)).send();
    } catch (e) {
        next(responseHandler.sendError(e));
    }
};

}

export default new QuizController;
