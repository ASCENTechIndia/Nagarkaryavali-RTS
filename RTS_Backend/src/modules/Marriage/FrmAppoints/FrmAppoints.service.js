const repo = require("./FrmAppoints.repo");

const { AppError } = require("../../../libs/errors");
const { ok } = require("../../../libs/response");

async function getSlotDetailsService({ applino }) {
  if (!applino) {
    throw new AppError("Application Number is required", 400);
  }

  const result = await repo.getSlotDetails({
    applino,
  });

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function getRescheduleReasonsService() {
  const result = await repo.getRescheduleReasons();

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function getSlotsByDateService({ slotDate }) {
  if (!slotDate) {
    throw new AppError("Slot date is required", 400);
  }

  const result = await repo.getSlotsByDate({
    slotDate,
  });

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function getAvailableSlotsService({ slotDate }) {
  if (!slotDate) {
    throw new AppError("Slot date is required", 400);
  }

  const result = await repo.getAvailableSlots({
    slotDate,
  });

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function getAllSlotsService() {
  const result = await repo.getAllSlots();

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function bookAppointmentSlotService({
  userId,
  orgId,
  appNo,
  slotDate,
  slotId,
  reason,
}) {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!orgId) {
    throw new AppError("ULB ID is required", 400);
  }

  if (!appNo) {
    throw new AppError("Application Number is required", 400);
  }

  if (!slotDate) {
    throw new AppError("Slot date is required", 400);
  }

  if (!slotId) {
    throw new AppError("Slot ID is required", 400);
  }

  if (reason === undefined || reason === null || reason === "") {
    throw new AppError("Reason is required", 400);
  }

  const result = await repo.bookAppointmentSlot({
    userId,
    orgId,
    appNo,
    slotDate,
    slotId,
    reason,
  });

  if (!result.success) {
    throw new AppError(result.error || "Appointment slot booking failed", 500);
  }

  const outBinds = result.outBinds || {};

  const errorCode = Number(outBinds.out_ErrorCode);

  const errorMessage =
    outBinds.out_ErrorMsg || "Appointment slot booking failed";

  if (errorCode !== 9999) {
    return {
      success: false,
      errorCode,
      message: errorMessage,
    };
  }

  return {
    success: true,
    errorCode,
    message: errorMessage,
  };
}

module.exports = {
  getSlotDetailsService,
  getRescheduleReasonsService,
  getSlotsByDateService,
  getAvailableSlotsService,
  getAllSlotsService,
  bookAppointmentSlotService,
};
