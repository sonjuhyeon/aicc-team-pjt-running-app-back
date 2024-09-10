const router = require("express").Router();
const { updateViewCount } = require("../controllers/updateViewCount");

router.patch("/update_viewcount", updateViewCount);

module.exports = router;
