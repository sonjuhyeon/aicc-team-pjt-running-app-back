const router = require("express").Router(); // api path 를 전달해 주는 메서드

const { getUser, getUsers } = require("../controllers/getUser");
const {
  getCourse,
  getUsersJoinCourse,
  getUserJoinCourse,
  get1course,
} = require("../controllers/getCourse");
const { getFacilities } = require("../controllers/getFacilities");
const { getMapApi } = require("../controllers/getMapApi");

router.get("/get_user/:userId", getUser); // 로그인한 유저정보
router.get("/get_user_join_course/:userId", getUserJoinCourse); // 한명의 유저와 코스 조인
router.get("/get_users", getUsers); // 전체 유저정보
router.get("/get_users_join_course", getUsersJoinCourse); // 전체유저와 코스 조인
router.get("/get_course", getCourse); //코스 전체
router.get("/get1course/:course_id", get1course); // 선택된 코스 정보
router.get("/get_facilities", getFacilities); // 편의시설 위치 api

router.get("/api/kakao-key", getMapApi); // 카카오 맵 api

module.exports = router; // router 모듈 내보내기
