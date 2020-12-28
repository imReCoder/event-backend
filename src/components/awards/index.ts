import awardController from "./award.controller";

export default [
  {
    path: "/award",
    method: "get",
    handler: [awardController.fetchAll]
  },
  {
    path: "/award",
    method: "post",
    adminOnly: true,
    handler: [awardController.create]
  },
  {
    path: "/award/show",
    method: "post",
    adminOnly: true,
    handler: [awardController.createShow]
  },
  {
    path: "/award/fetchAllAwards/:showId",
    method: "get",
    adminOnly: true,
    handler: [awardController.fetchAll]
  },
  {
    path: "/award/add-answer",
    method: "post",
    handler: [awardController.addAnswer]
  },
  {
    path: "/award/results",
    method: "get",
    escapeAuth: true,
    handler: [awardController.getAwardResults]
  },
  {
    path: "/award/:id",
    method: "patch",
    adminOnly: true,
    handler: [awardController.update]
  },
  {
    path: "/award/showList",
    method: "get",
    escapeAuth: true,
    handler: [awardController.getShows]
  },
  {
    path: "/award/awardCategoryList",
    method: "get",
    escapeAuth: true,
    handler: [awardController.getCategory]
  },
  // {
  //   path: "/award/awardList",
  //   method: "get",
  //   escapeAuth: true,
  //   handler: [awardController.getAwardsByCategory]
  // },
  {
    path: "/award/juryComments",
    method: "get",
    escapeAuth: true,
    handler: [awardController.getJuryComments]
  },
  {
    path: "/award/audienceComments",
    method: "get",
    escapeAuth: true,
    handler: [awardController.getAudienceComments]
  },
  {
    path: "/award/nominees",
    method: "get",
    escapeAuth: true,
    handler: [awardController.getNomineeList]
  }
];
