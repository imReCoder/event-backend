import auctionEventController from "./auctionEvent.controller";
import { s3UploadMulter } from "../../lib/services/s3";

export default [
    {
        path: "/auctionevent/add",
        method: "post",
        handler: [auctionEventController.create]
    },
    {
        path: "/auctionevent/:id/remove",
        method: "post",
        handler: [auctionEventController.delete]
    },
    {
        path: "/auctionevent/fetchAll",
        method: "get",
        escapeAuth:true,
        handler: [auctionEventController.fetchAll]
    },
    {
        path: "/auctionevent/upcoming",
        method: "get",
        escapeAuth:true,
        handler: [auctionEventController.upcoming]
    },
    {
        path: "/auctionevent/:id",
        method: "get",
        escapeAuth:true,
        handler: [auctionEventController.fetch]
    },
    {
        path: "/auctionevent/:id",
        method: "patch",
        handler: [auctionEventController.update]
    },
    {
        path: "/auctionevent/icon/upload/:id",
        method: "post",
        handler:[s3UploadMulter.single('file'),auctionEventController.addIcon]
    },
    {
        path: "/auctionevent/coverImage/upload/:id",
        method: "post",
        handler: [s3UploadMulter.single('file'),auctionEventController.addCoverImage]
    },
    {
        path: "/auctionevent/search/:key",
        method: "get",
        handler:[auctionEventController.searchAuction]
    },
];

