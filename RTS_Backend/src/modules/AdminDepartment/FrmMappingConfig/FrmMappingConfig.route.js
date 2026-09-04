const express = require("express");

const router = express.Router();

const controller = require("./FrmMappingConfig.controller");
const auth = require("../../../middlewares/auth.middleware");

router.get(
    "/user-dropdown",
    auth(),
    controller.getUserDropdownController
);

router.get(
    "/ward-dropdown",
    auth(),
    controller.getWardDropdownController
);


router.get(
    "/user-ward-config",
    auth(),
    controller.getUserWardConfigController
);

router.post(
    "/save-user-ward-config",
    auth(),
    controller.saveUserWardConfigController
);


module.exports = router;