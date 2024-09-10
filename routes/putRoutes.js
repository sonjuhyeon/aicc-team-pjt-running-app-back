const router = require("express").Router();
const { updateCourse } = require("../controllers/updateCourse");

// patch 는 변경 사항에 대한 부분만 업데이트 한다.
// put 은 전체를 업데이트 한다.
router.put("/update_course", updateCourse);

module.exports = router;
