import {NextFunction, Request, Response} from "express";
import {award as msg} from "../../lib/helpers/customMessage";
import ResponseHandler from "../../lib/helpers/responseHandler";
import Award from "./award.model";

class SpecializationController {

  public fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {

      responseHandler
        .reqRes(req, res)
        .onFetch(msg.FETCH_ALL, await Award.fetchAwardByShowId(req.params))
        .send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };


  public create = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      req.body.user = req.body.user || req.userId as string;
      responseHandler
        .reqRes(req, res)
        .onCreate(msg.CREATED, await Award.create(req.body))
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public createShow = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      req.body.user = req.body.user || req.userId as string;
      responseHandler
        .reqRes(req, res)
        .onCreate(msg.CREATED_SHOW, await Award.createShow(req.body))
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public addAnswer = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const body = {
        ...req.body,
        user: req.userId as string
      };
      console.log(body);
      const data = await Award.addAnswer(body);
      const newMsg = data ? "You have added your answer" : "You have already updated or created this award poll.";
      responseHandler
        .reqRes(req, res)
        .onCreate(newMsg, data)
        .send();
    } catch (e) {
      console.error(e);
      next(responseHandler.sendError(e));
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onCreate(msg.CREATED, await Award.update(req.params.id, req.body), msg.CREATED_DEC).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public getAwardResults = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler
        .reqRes(req, res)
        .onFetch(msg.RESULTS, await Award.getAwardResults(req.query.id))
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public getShows = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler
        .reqRes(req, res)
        .onFetch(msg.SHOW_LIST, await Award.fetchShowList(req.query))
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public getCategory = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler
        .reqRes(req, res)
        .onFetch(msg.AWARD_LIST, await Award.fetchCategoryListOfaShow(req.query.id))
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  // public getAwardsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  //   const responseHandler = new ResponseHandler();
  //   try {
  //     responseHandler
  //       .reqRes(req, res)
  //       .onFetch(msg.AWARD_LIST, await Award.fetchAwardsBycategory(req.query))
  //       .send();
  //   } catch (e) {
  //     next(responseHandler.sendError(e));
  //   }
  // };

  public getAudienceComments = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler
        .reqRes(req, res)
        .onFetch(msg.AUDIENCE_COMMENTS, await Award.fetchCommentsAudience(req.query.id))
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public getJuryComments = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler
        .reqRes(req, res)
        .onFetch(msg.JURY_COMMENTS, await Award.fetchCommentsJury(req.query.id))
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public getNomineeList = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler
        .reqRes(req, res)
        .onFetch(msg.NOMINEES_LIST, await Award.fetchNominees(req.query.id))
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };
}

export default new SpecializationController;
