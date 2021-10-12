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

  public fetchAllActiveQuiz = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL,await Quiz.fetchByActiveQuiz(req.query)).send();
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
      responseHandler.reqRes(req, res).onFetch(msg.START, await Quiz.start(req.userId as string, req.query.quizId , req.query.code)).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public guestStart = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try{
      responseHandler.reqRes(req, res).onFetch(msg.START, await Quiz.guestStart(req.query.quizId)).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  }


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

  public registerForQuiz = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onCreate('Registeration Of Quiz Completed', await Quiz.registerForQuiz(req.userId as string, req.body.quizId)).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public getParticipants = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();

    try {
      responseHandler.reqRes(req, res).onFetch('Here are the participants', await Quiz.getParticipants(req.params.id)).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const data = await Quiz.getLeaderboard(req.params.id);

      responseHandler.reqRes(req, res).onFetch("Leaderboard for the quiz", data).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public getPrize = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const data = await Quiz.getPrize(req.params.id);

      responseHandler.reqRes(req, res).onFetch("Prize of winners", data).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public updateQuiz = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();

    try {
      const data = await Quiz.updateQuiz();

      console.log(data);
      responseHandler.reqRes(req, res).onFetch("Updating the quiz", data).send();
      // return data;
    } catch (e) {
      responseHandler.sendError(e);
    }
  };

  public checkQuiz = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const data = await Quiz.checkQuiz(req.body.quizId);

      console.log(data,req.body);
      if (!data.isFreebie) {
        try {
          req.body.amount = data.poolAmount;
          const transactiondetails = await Quiz.transactions(req.userId, req.body);
          console.log(transactiondetails);
          if (transactiondetails._id) {

            const paymentBody = {
              phone: req.body.phone,
              amount:transactiondetails.amount,
              userId:transactiondetails.userId,
              isFreebie:false,
              description:transactiondetails.metadata.description,
              transactionId:transactiondetails._id
            }
            const walletTransaction = await Quiz.payment(paymentBody,req.query.apiKey);
            
            if(walletTransaction.data.status){
              next();
            }else 
            {
              throw Error("Wallet transaction failed");
            }
          }
        } catch (e) {
          next(responseHandler.sendError(e));
        }
      }else {
        next();
      }
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };


  public transaction = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("In here");
      const transactionBody = await Quiz.initiateTransaction(req.body);
      req.body.transactionBody = transactionBody;
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

};

export default new QuizController;
