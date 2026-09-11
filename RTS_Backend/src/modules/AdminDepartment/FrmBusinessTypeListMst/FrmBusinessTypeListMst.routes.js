const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmBusinessTypeListMst.controller");

router.post("/business-type", auth(), controller.getBusinessTypeById);

router.post("/business-types", auth(), controller.getAllBusinessTypes);

router.post("/insert-business-type", auth(), controller.manageBusinessType);

module.exports = router;
