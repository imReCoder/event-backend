import { HTTP400Error } from '../../lib/utils/httpErrors';
import { ticketMsg } from '../../lib/helpers/customMessage';
import ticketModel from "./ticket.model";
import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import eventModel from '../event/event.model';


class TicketController{

        public  create = async(req:Request,res:Response,next:NextFunction)=>{
            const responseHandler = new ResponseHandler();
            try{
                console.log(`Creating new ticket for event :${req.params.eventId}`);
                
                req.body.eventId = req.params.eventId
                const newTicket = await ticketModel.create(req.body,req.userId);
                if(!newTicket || !newTicket._id) throw Error("some error occured...");
                const updateEventData = await eventModel.addTicket(newTicket._id,newTicket.eventId);
                if(!updateEventData) throw new HTTP400Error("some error occured..");

                responseHandler.reqRes(req, res).onFetch(ticketMsg.CREATED,newTicket).send();
            }catch(e){
                next(responseHandler.sendError(e));
            }
           

        }
       public update = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler.reqRes(req, res).onCreate(ticketMsg.UPDATED, await ticketModel.update(req.params.id, req.body)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };
    public fetch = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            console.log("fetch");
            responseHandler.reqRes(req, res).onCreate(ticketMsg.FETCH, await ticketModel.fetch(req.params.id)).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };
    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();

        try {
            await ticketModel.delete(req.params.id);
            responseHandler.reqRes(req, res).onCreate(ticketMsg.DELETED).send();
        } catch (e) {
            next(responseHandler.sendError(e));
        }
    };
}

export default new TicketController();
