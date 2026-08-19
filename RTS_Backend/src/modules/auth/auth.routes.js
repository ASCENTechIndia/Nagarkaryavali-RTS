const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");
const isValidToken = require("./isValidToken");

router.post("/validate-token", isValidToken);
router.post("/register", controller.registerUser);
router.post("/login-proc", controller.loginProc);
router.post("/send-login-otp", controller.sendLoginOtp);
router.post("/login-otp", controller.loginWithOtp);
router.post("/change-password", controller.changePassword);
router.get("/me", isValidToken, controller.me);
router.post("/citizen-details", controller.getCitizenDetailsByMobile);

module.exports = router;