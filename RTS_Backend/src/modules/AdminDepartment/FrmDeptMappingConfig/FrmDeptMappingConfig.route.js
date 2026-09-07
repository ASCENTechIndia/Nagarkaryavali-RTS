const express = require("express");
const router = express.Router();

const controller = require("./FrmDeptMappingConfig.controller");
const auth = require("../../../middlewares/auth.middleware");


router.get(
    "/department-dropdown",
    auth(),
    controller.getDepartmentDropdownController
);

router.get(
    "/user-department-config",
    auth(),
    controller.getUserDepartmentConfigController
);


router.post(
    "/save-user-department-config",
    auth(),
    controller.saveUserDepartmentConfigController
);


module.exports = router;