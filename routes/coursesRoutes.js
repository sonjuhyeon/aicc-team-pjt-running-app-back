const router = require("express").Router();
const {
  getCourses,
  getCourse,
  postCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/coursesCtrls");

// ------- GET -------
router.get("/courses", getCourses); // 전체 또는 user_id별 조회
router.get("/courses/:course_id", getCourse); // 특정 코스 조회

// ------- POST -------
router.post("/courses", postCourse); // 코스 등록

// ------- PATCH -------
router.patch("/courses/:courseId", updateCourse); // 코스 수정

// ------- DELETE -------
router.delete("/courses/:courseId", deleteCourse); // 코스 삭제

module.exports = router;
