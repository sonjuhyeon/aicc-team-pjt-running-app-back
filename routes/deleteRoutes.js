const router = require("express").Router();
const { deleteCourse } = require("../controllers/deleteCourse");
const { deleteUser } = require("../controllers/deleteUser");

router.delete("/delete_course/:courseId", deleteCourse);
router.delete("/delete_user/:userId", deleteUser);

module.exports = router;
