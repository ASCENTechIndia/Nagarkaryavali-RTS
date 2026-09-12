const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");
const isValidToken = require("./isValidToken");
const auth = require("../../middlewares/auth.middleware");

router.post("/validate-token", auth(), isValidToken);
router.post("/register", auth(), controller.registerUser);
router.post("/login-proc", auth(), controller.loginProc);
router.post("/send-login-otp", auth(), controller.sendLoginOtp);
router.post("/login-otp", auth(), controller.loginWithOtp);
router.post("/forgot-password-details", auth(), controller.getForgotPasswordDetails);
router.post("/change-password", auth(), controller.changePassword);
router.get("/me", auth(), isValidToken, controller.me);
router.post("/citizen-details", auth(), controller.getCitizenDetailsByMobile);
router.post("/employee-login", auth(), controller.employeeLoginController);

module.exports = router;