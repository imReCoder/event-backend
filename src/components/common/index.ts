import quizController from "../quiz/quiz.controller";
import resultController from "../result/result.controller"
export default [
  
    {
        path: '/common/quiz/start',
        escapeAuth: true,
        method: 'get',
        handler: [quizController.guestStart]
    },
    {
        path: '/common/quiz/submitAnswer',
        escapeAuth: true,
        method: 'post',
        handler: [resultController.guestsubmitAnswer]
    },
    {
        path: '/common/quiz/timedOut',
        escapeAuth: true,
        method: 'get',
        handler: [resultController.timedOut]
    },
    {
        path: '/common/quiz/end',
        escapeAuth: true,
        method: 'get',
        handler: [resultController.guestEnd]
    },
];
