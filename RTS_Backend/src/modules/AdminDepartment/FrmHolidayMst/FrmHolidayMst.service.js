const repo = require("./FrmHolidayMst.repo");

const saveHolidayService = async ({
  Userid,
  Str,
  Ulbid
}) => {
  if (!Userid) {
    throw new Error("User ID is required.");
  }

  if (!Str) {
    throw new Error("Holiday dates (Str) is required.");
  }

  if (!Ulbid) {
    throw new Error("ULB ID is required.");
  }

  return await repo.saveHolidayRepo({
    Userid,
    Str,
    Ulbid
  });
};

module.exports = {
  saveHolidayService
};