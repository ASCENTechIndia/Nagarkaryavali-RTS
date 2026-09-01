const express = require("express");

const router = express.Router();

const controller = require("./FrmRoadCutting.controller");


router.get("/road-types", controller.getRoadTypeList);


router.get("/wardlist", controller.getWardList);


router.get(
"/road-cutting-types",
controller.getRoadCuttingTypeList,
);


router.get(
"/prabhag-samiti-list",
controller.getPrabhagSamitiList,
);


router.post("/saveRoadCutting", controller.saveRoadCutting);
module.exports = router;
