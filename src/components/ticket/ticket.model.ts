import { HTTP400Error } from './../../lib/utils/httpErrors';
import { ITicketModel } from './ticket.schema';
import { Ticket } from "./ticket.schema";


export class TicketModel{
    public async create(body:ITicketModel,userId:string){
            try{
                body.creator= userId;
                body.startDate = new Date(body.startDate);
                body.endDate = new Date(body.endDate);
                const newTicket:ITicketModel = new Ticket(body);
                const newTicketData:ITicketModel = await newTicket.saveTicket();
                return newTicketData;
            }catch(e){
                console.log(e)
                throw new HTTP400Error(e.message);
            }
    };

    public async update(id: string, body: any) {
      
        if (body.startDate) {
          body.startDate = new Date(body.startDate);
        }
    
        if (body.endDate) {
          body.endDate = new Date(body.endDate);
        }
        console.log("update ticket ",id," to ",body);
    
        const data = await Ticket.findByIdAndUpdate({ _id: id }, body, {
                runValidators: true,
                new: true
            })
    
            return data;
        }

        public async fetch(id: string) {
            const data = Ticket.findById(id);
            return data;
        }

        public async delete(id: string) {
            await Ticket.deleteOne({ _id: id });
        }
}

export default new TicketModel();