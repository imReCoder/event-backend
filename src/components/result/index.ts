import scoreController from './result.controller'

export default [
    {
        path: "/score",
        method: "post",
        handler: [scoreController.create],
        adminOnly: true
    },
]