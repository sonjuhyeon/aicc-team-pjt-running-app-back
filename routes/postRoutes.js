const router = require("express").Router();
const { postUser, loginUser } = require("../controllers/postUser");
const { postCourse } = require("../controllers/postCourse");
const { uploadImage } = require("../controllers/uploadImage");

router.post("/register", postUser);
router.post("/login", loginUser);

// 이미지 업로드 엔드포인트
router.post("/upload_image", uploadImage);

// 코스 생성 엔드포인트
router.post("/make_course", postCourse);

module.exports = router;
