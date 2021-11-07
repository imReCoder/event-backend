import responseController from "./response.controller";

export default [
    {
        path: "/response/create",
        method: "post",
        handler:[responseController.create]
    },
    {
        path: "/response/update",
        method: "patch",
        handler:[responseController.update]
    },
    {
        path: "/responses",
        adminOnly: true,
        method: "get",
        handler:[responseController.fetchAll]
    },
    {
        path: "/response/:id",
        method: "get",
        handler:[responseController.fetch]
    },
    {
        path: "response/:id",
        method: "delete",
        handler:[responseController.delete]
    },
];

