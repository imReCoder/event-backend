import commonController from "./common.controller";


export default [
    {
        path:"/common/search/:key",
        method:"get",
        handler:[commonController.search]
    }
]