import quizController from "./quiz.controller";
import resultController from "../result/result.controller"

export default [
  {
    path: "/quiz/create",
    method: "post",
    adminOnly: true,
    handler: [quizController.create]
  },
  {
    path: '/quiz/AddCategory',
    method: 'post',
    adminOnly: true,
    handler: [quizController.addCategory]
  },
  {
    path: '/quiz/fetchAllCategories',
    method: "get",
    escapeAuth: true,
    handler: [quizController.findAllActiveCategories]
  },
  {
    path: '/quiz/fetchQuiz',
    method: "get",
    handler: [quizController.fetchAllActiveQuiz]
  },
  {
    path: '/quiz/start',
    method: 'get',
    handler: [quizController.start]
  },
  {
    path: '/quiz/submitAnswer',
    method: 'get',
    handler: [resultController.submitAnswer]
  },
  {
    path: '/quiz/timedOut',
    method: 'get',
    handler: [resultController.timedOut]
  },
  {
    path: '/quiz/hint',
    method: 'get',
    handler: [quizController.takeHint]
  },
  {
    path: '/quiz/end',
    method: 'get',
    handler: [resultController.end]
  },
  {
    path: '/quiz/ruleBook',
    method: 'get',
    escapeAuth: true,
    handler: [quizController.ruleBook]
  },
  {
    path: '/quiz/unlockLevel',
    method: 'get',
    handler: [quizController.unlockLevel]
  },
  {
    path: '/quiz/register',
    method: 'post',
    handler: [quizController.registerForQuiz]
  },
];
