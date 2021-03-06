import eventController from "./event.controller";
import { s3UploadMulter } from "../../lib/services/s3";
import eventPortfolioController from "../eventPortfolio/eventPortfolio.controller";
export default [
    {
        path: "/event/create",
        method: "post",
        handler:[eventController.create,eventPortfolioController.addUpcomingEvent,eventPortfolioController.addEventCount]
    },
    {
        path: '/event/AddCategory',
        method: 'post',
        adminOnly: true,
        handler: [eventController.addCategory]
    },
    {
        path: "/event/:id",
        method: "patch",
        handler:[eventController.update]
    },
    {
        path: "/events",
        method: "get",
        handler:[eventController.fetchAll]
    },
    {
        path:"/event/fetch",
        method:"get",
        handler:[eventController.getEvents]
    },
    {
        path: "/event/:id",
        method: "get",
        handler:[eventController.fetch]
    },
    {
        path: "/event/:id",
        method: "delete",
        handler:[eventController.delete]
    },
    {
        path: "/event/:id/like",
        method: "post",
        handler:[eventController.addLike]
    },
    {
        path: "/event/:id/unlike",
        method: "post",
        handler:[eventController.removeLike]
    },
    {
        path: "/event/upload/:id",
        method: "post",
        handler: [s3UploadMulter.single('file'),eventController.uploadFile]
    },
    {
        path: "/event/:id/share",
        method: "post",
        handler:[eventController.increaseShareCount]
    }
];

