import auctionController from "./auction.controller";
import { s3UploadMulter } from "../../lib/services/s3";

export default [
    {
        path: "/auction/:id/add",
        method: "post",
        handler:[auctionController.create]
    },
    {
        path: "/auction/fetchAll",
        escapeAuth:true,
        method: "get",
        handler: [auctionController.fetchAll]
    },
    {
        path: "/auction/:id/tags/update",
        escapeAuth:true,
        method: "post",
        handler: [auctionController.updateTags]
    },
    {
        path: "/auction/similar/:id",
        escapeAuth:true,
        method: "get",
        handler: [auctionController.fetchSimilar]
    },
    {
        path: "/auction/:auctionEventId/fetch/min",
        escapeAuth: true,
        method: "get",
        handler:[auctionController.fetchAuctionItemsByAuctionEventMin]
    },
    {
        path: "/auction/:auctionEventId/fetch",
        escapeAuth: true,
        method: "get",
        handler:[auctionController.fetchAuctionItemsByAuctionEvent]
    },
    {
        path: "/auction/:id",
        escapeAuth: true,
        method: "get",
        handler: [auctionController.fetch]
    },
    {
        path: "/auction/:id",
        method: "patch",
        handler: [auctionController.update]
    },
    {
        path: "/auction/:auctioneventid/remove/:id",
        method: "post",
        handler:[auctionController.delete]
    },
    {
        path: "/auction/:id/bid",
        method: "post",
        handler:[auctionController.bid]
    },
    {
        path: "/auction/search/:key",
        method: "get",
        handler:[auctionController.searchItem]
    },
    {
        path: "/auction/image/upload/:id",
        method: "post",
        handler: [s3UploadMulter.single('file'), auctionController.addImage]
    },
];

