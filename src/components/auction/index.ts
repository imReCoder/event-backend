import auctionController from "./auction.controller";

export default [
    {
        path: "/auction/:id/add",
        method: "post",
        handler:[auctionController.create]
    },
    {
        path: "/auction/fetchAll",
        method: "get",
        handler: [auctionController.fetchAll]
    },
    {
        path: "/auction/:id",
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
];

