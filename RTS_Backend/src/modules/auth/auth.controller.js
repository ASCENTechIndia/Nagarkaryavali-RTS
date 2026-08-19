const asyncHandler = require("../../libs/asyncHandler");
const { ok, fail } = require("../../libs/response");
const service = require("./auth.service");

exports.registerUser = asyncHandler(async (req, res) => {
  const {userId, orgId, name, email, mobile, dob, password, confirmPassword, ipAddress, source, propNo} = req.body;

  const data = await service.registerUser({userId, orgId, name, email, mobile, dob, password, confirmPassword, ipAddress: ipAddress || req.ip, source: source, propNo});
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
    userId: req.body.userId || "SMCTT",
    ulbId: req.body.ulbId || 3,
    mobileNumber: req.body.mobileNumber
  });

  return ok(res, data, "OTP sent successfully");
});

exports.loginWithOtp = asyncHandler(async (req, res) => {
  const data = await service.loginWithOtp({
    userId: req.body.userId || "SMCTT",
    ulbId: req.body.ulbId || 3,
    mobileNumber: req.body.mobileNumber,
    otp: req.body.otp
  });

  return ok(res, data, "OTP login success");
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { corpId, userId, oldPassword, newPassword, mode } = req.body;

  const data = await service.changePassword({ corpId, userId, oldPassword, newPassword, mode });
  return ok(res, data, data.message);
});

exports.me = asyncHandler(async (req, res) => {
  return ok(res, req.user || null, "User profile");
});

exports.getCitizenDetailsByMobile = asyncHandler(async (req, res) => {
  const { mobile } = req.body;

  const data = await service.getCitizenDetailsByMobile({mobile});
  return ok(res, data, "Citizen details fetched successfully");
});