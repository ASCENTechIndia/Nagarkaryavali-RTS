const asyncHandler = require("../../../libs/asyncHandler");
const { ok, fail } = require("../../../libs/response");

const service = require("./FrmAppoints.service");

exports.getSlotDetails = asyncHandler(async (req, res) => {
  const { applino } = req.body;

  if (!applino) {
    return fail(res, "Application Number is required");
  }

  const result = await service.getSlotDetailsService({
    applino,
  });

  return ok(res, result, "Slot details fetched successfully");
});

exports.getRescheduleReasons = asyncHandler(async (req, res) => {
  const result = await service.getRescheduleReasonsService();

  return ok(res, result, "Reschedule reasons fetched successfully");
});

exports.getSlotsByDate = asyncHandler(async (req, res) => {
  const { slotDate } = req.body;

  if (!slotDate) {
    return fail(res, "Slot date is required");
  }

  const result = await service.getSlotsByDateService({
    slotDate,
  });

  return ok(res, result, "Slots fetched successfully");
});

exports.getAvailableSlots = asyncHandler(async (req, res) => {
  const { slotDate } = req.body;

  if (!slotDate) {
    return fail(res, "Slot date is required");
  }

  const result = await service.getAvailableSlotsService({
    slotDate,
  });

  return ok(res, result, "Available slots fetched successfully");
});

exports.getAllSlots = asyncHandler(async (req, res) => {
  const result = await service.getAllSlotsService();

  return ok(res, result, "All slots fetched successfully");
});

exports.bookAppointmentSlot = asyncHandler(async (req, res) => {
  const { userId, orgId, appNo, slotDate, slotId, reason } = req.body;

  // User ID can come from logged-in user
  const finalUserId = req.user?.userId || userId;

  if (!finalUserId) {
    return fail(res, "User ID is required");
  }

  if (!orgId) {
    return fail(res, "ULB ID is required");
  }

  if (!appNo) {
    return fail(res, "Application Number is required");
  }

  if (!slotDate) {
    return fail(res, "Slot date is required");
  }

  if (!slotId) {
    return fail(res, "Slot ID is required");
  }

  if (reason === undefined || reason === null || reason === "") {
    return fail(res, "Reason is required");
  }

  const result = await service.bookAppointmentSlotService({
    userId: finalUserId,
    orgId,
    appNo,
    slotDate,
    slotId,
    reason,
  });

  if (!result.success) {
    return fail(res, result.message || "Slot booking failed");
  }

  return ok(res, result, result.message || "Slot booked successfully");
});
