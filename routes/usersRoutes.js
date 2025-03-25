const router = require("express").Router();
const {
  postUsers,
  userLogin,
  getUser,
  getUsers,
  deleteUser,
} = require("../controllers/usersCtrls");

router.post("/register", postUsers); // 회원가입
router.post("/login", userLogin); // 로그인

router.get("/users", getUsers); // 전체 유저 정보 조회
router.get("/users/:userId", getUser); // 유저 정보 조회

router.delete("/users/:userId", deleteUser); // 유저 탈퇴 (status만 false)

module.exports = router;
