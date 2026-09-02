const express = require("express");

const router = express.Router();

const controller = require("./FrmRoadCutting.controller");
const auth = require("../../middlewares/auth.middleware");


router.get("/road-types",auth(), controller.getRoadTypeList);


router.get("/wardlist",auth(), controller.getWardList);


router.get(
"/road-cutting-types",auth(),
controller.getRoadCuttingTypeList,
);


router.get(
"/prabhag-samiti-list",auth(),
controller.getPrabhagSamitiList,
);


router.post("/saveRoadCutting",auth(), controller.saveRoadCutting);
module.exports = router;
