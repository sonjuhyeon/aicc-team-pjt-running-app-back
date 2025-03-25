const router = require("express").Router(); // api path 를 전달해 주는 메서드

const { getFacilities } = require("../controllers/facilitiesCtrls");

router.get("/facilities", getFacilities); // 편의시설 위치 api

module.exports = router; // router 모듈 내보내기
