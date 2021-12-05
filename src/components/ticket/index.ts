import ticketController from "./ticket.controller";
import { s3UploadMulter } from "../../lib/services/s3";

export default [
    {
        path: "/ticket/create",
        method: "post",
        handler:[ticketController.create]
    },
    {
        path: "/ticket/:id",
        method: "patch",
        handler:[ticketController.update]
    },
    
    {
        path: "/ticket/:id",
        method: "get",
        handler:[ticketController.fetch]
    },
    {
        path: "/ticket/:id",
        method: "delete",
        handler:[ticketController.delete]
    },
    
];

