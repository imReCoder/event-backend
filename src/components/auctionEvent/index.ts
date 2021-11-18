import auctionEventController from "./auctionEvent.controller";

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
        handler: [auctionEventController.fetchAll]
    },
    {
        path: "/auctionevent/:id",
        method: "get",
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
        handler:[auctionEventController.addIcon]
    },
    {
        path: "/auctionevent/coverImage/upload/:id",
        method: "post",
        handler: [auctionEventController.addCoverImage]
    }
];

