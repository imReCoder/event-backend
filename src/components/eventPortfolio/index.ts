import eventPortfolioController from "./eventPortfolio.controller";
import { s3UploadMulter } from "../../lib/services/s3";

export default [
    {
        path: "/eventportfolio/create",
        method: "post",
        handler:[eventPortfolioController.create]
    },
    {
        path: "/eventportfolio/:id",
        method: "patch",
        handler:[eventPortfolioController.update]
    },
    {
        path: "/eventportfolios",
        adminOnly: true,
        method: "get",
        handler:[eventPortfolioController.fetchAll]
    },
    {
        path: "/eventportfolio/:id",
        method: "get",
        handler:[eventPortfolioController.fetch]
    },
    {
        path: "/eventportfolio/:id",
        method: "delete",
        handler:[eventPortfolioController.delete]
    },
    {
        path: "/eventportfolio/:id/follower",
        method: "post",
        handler:[eventPortfolioController.addFollower]
    },
    {
        path: "/eventportfolio/:id/removefollower",
        method: "post",
        handler: [eventPortfolioController.removeFollower]
    },
    {
        path: "/eventportfolio/:id/follow",
        method: "post",
        handler:[eventPortfolioController.addFollow]
    },
    {
        path: "/eventportfolio/:id/upcomingevent/:eventId",
        method: "delete",
        handler:[eventPortfolioController.addUpcomingEvent]
    },
    {
        path: "/eventportfolio/upload/:id",
        method: "post",
        handler: [s3UploadMulter.single('file'), eventPortfolioController.uploadFile]
    },
];

