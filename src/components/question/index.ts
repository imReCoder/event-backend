import quesController from './question.controller'

export default [
    {
        path: "/ques/create",
        method: "post",
        handler: [quesController.create],
        adminOnly: true
    },
    {
        path: "/ques/fetchAll",
        method: "get",
        handler: [quesController.fetchAll],
        adminOnly: true
    },
    {
        path: "/ques/update/:id",
        method: "patch",
        handler: [quesController.update],
        adminOnly: true
    },
]