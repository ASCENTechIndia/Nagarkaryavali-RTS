const asyncHandler = require("../../libs/asyncHandler");
const { ok, fail } = require("../../libs/response");
const service = require("./auth.service");

exports.registerUser = asyncHandler(async (req, res) => {
  const { userId, orgId, name, email, mobile, dob, password, confirmPassword, ipAddress, source, propNo } = req.body;

  const data = await service.registerUser({ userId, orgId, name, email, mobile, dob, password, confirmPassword, ipAddress: ipAddress || req.ip, source: source, propNo });
  return ok(res, data, data.errorMsg);
});

exports.loginProc = asyncHandler(async (req, res) => {
  const payload = {
    corpId: req.body.corpId,
    mobile: req.body.mobile,
    password: req.body.password,
    ulbId: req.body.ulbId,
    logflag: req.body.logflag || "L"
  };

  const data = await service.loginProc(payload);

  return ok(res, data, "Login success");
});

exports.sendLoginOtp = asyncHandler(async (req, res) => {
  const data = await service.sendLoginOtp({
    userId: req.body.userId,
    ulbId: req.body.ulbId,
    mobileNumber: req.body.mobileNumber
  });

  return ok(res, data, "OTP sent successfully");
});

exports.getForgotPasswordDetails = asyncHandler(async (req, res) => {
  const data = await service.getForgotPasswordDetails(req.body);

  return res.status(200).json({
    ok: true,
    message: "Forgot password details fetched successfully",
    data
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const data = await service.changePassword(req.body);

  return res.status(200).json({
    ok: true,
    message: "Password changed successfully",
    data
  });
});

exports.loginWithOtp = asyncHandler(async (req, res) => {
  const data = await service.loginWithOtp({
    userId: req.body.userId,
    ulbId: req.body.ulbId,
    mobileNumber: req.body.mobileNumber,
    otp: req.body.otp
  });

  return ok(res, data, "OTP login success");
});

exports.me = asyncHandler(async (req, res) => {
  return ok(res, req.user || null, "User profile");
});

exports.getCitizenDetailsByMobile = asyncHandler(async (req, res) => {
  const { mobile } = req.body;

  const data = await service.getCitizenDetailsByMobile({ mobile });
  return ok(res, data, "Citizen details fetched successfully");
});


exports.employeeLoginController = asyncHandler(async (req, res) => {
  const data = await service.employeeLoginService({
    corpId : req.body.corpId,
    userId : req.body.userId,
    password: req.body.password,
  });

  return ok(res, data, " login success");
});