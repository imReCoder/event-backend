import formController from "./form.controller";
import resultController from "./../result/result.controller";

export default [
    {
        path: "/form/create/:eventId",
        method: "post",
        handler:[formController.create]
    },
    {
        path: "/form/:id/result",
        method: "post",
        handler: [formController.increaseCount]
    },
    {
        path: "/form/:id",
        method: "patch",
        handler:[formController.update]
    },
    {
        path: "/forms",
        adminOnly: true,
        method: "get",
        handler:[formController.fetchAll]
    },
    {
        path: "/form/:id",
        method: "get",
        handler:[formController.fetch]
    },
    {
        path: "/form/:id",
        method: "delete",
        handler:[formController.delete]
    },
    {
        path: "/form/event/:id",
        method: "get",
        handler:[formController.fetchByEvent]
    },
    {
        path: "/form/:formId/mcq/result",
        method: "get",
        handler:[resultController.getMCQData]
    },
    {
        path: "/form/:formId/number/result",
        method: "get",
        handler: [resultController.getNumberData]
    },
];

