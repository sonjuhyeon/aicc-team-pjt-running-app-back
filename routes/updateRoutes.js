const router = require("express").Router();
const { updateViewCount } = require("../controllers/viewCountCtrls");

router.patch("/update_viewcount", updateViewCount);

module.exports = router;
