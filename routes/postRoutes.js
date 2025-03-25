const router = require("express").Router();
const { uploadImage } = require("../controllers/uploadImage");


// 이미지 업로드 엔드포인트
router.post("/upload_image", uploadImage);

module.exports = router;
