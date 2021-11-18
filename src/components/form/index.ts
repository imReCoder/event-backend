import formController from "./form.controller";

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
];

