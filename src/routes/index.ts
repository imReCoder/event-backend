import User from '../components/user'
import Event from '../components/event'
import EventPortfolio from '../components/eventPortfolio'
import Form from '../components/form';
import Response from '../components/response';
import AuctionEvent from '../components/auctionEvent';
import Auction from '../components/auction';
import Ticket from '../components/ticket';
import common from '../components/common';
export default [
    ...User,
    ...Event,
    ...EventPortfolio,
    ...Form,
    ...Response,
    ...AuctionEvent,
    ...Auction,
    ...Ticket,
    ...common
];