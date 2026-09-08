const repo = require("./FrmHearingDateAssign.repo");
const { AppError } = require("../../../libs/errors");

const getHearingProcessListService = async () => {
  return await repo.getHearingProcessListRepo();
};


const assignHearingDateService = async ({ userId, ulbId, in_str }) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (ulbId === null || ulbId === undefined || ulbId === "") {
    throw new AppError("ULB ID is required", 400);
  }

  if (!in_str || typeof in_str !== "string") {
    throw new AppError("in_str is required", 400);
  }

  const records = in_str.split("#");

  const convertedRecords = records.map((record) => {
    const parts = record.split("$");

    if (parts.length < 7) {
      throw new AppError("Invalid in_str format", 400);
    }

    const hearingDate = parts[5];

    if (!hearingDate) {
      throw new AppError("Hearing date is required", 400);
    }

    const dateParts = hearingDate.split("/");

    if (dateParts.length !== 3) {
      throw new AppError("Hearing date must be in DD/MM/YYYY format", 400);
    }

    const day = Number(dateParts[0]);
    const month = Number(dateParts[1]);
    const year = Number(dateParts[2]);

    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year) || day < 1 || day > 31 || month < 1 || month > 12) {
      throw new AppError("Invalid hearing date", 400);
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      throw new AppError("Invalid hearing date", 400);
    }

    parts[5] = `${String(day).padStart(2, "0")}-${monthNames[month - 1]}-${year}`;

    return parts.join("$");
  });

  const convertedInStr = convertedRecords.join("#");

  console.log("Original In_str:", in_str);
  console.log("Converted In_str:", convertedInStr);

  const result = await repo.assignHearingDateRepo({
    userId,
    in_str: convertedInStr,
    ulbId,
  });

  return result;
};

module.exports = {
  getHearingProcessListService,
  assignHearingDateService,
};
