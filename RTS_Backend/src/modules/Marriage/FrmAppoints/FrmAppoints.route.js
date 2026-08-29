const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmAppoints.controller");

router.post("/slot-details", auth(),  controller.getSlotDetails);

router.post("/reschedule-reasons", auth(),  controller.getRescheduleReasons);

router.post("/slots-by-date", auth(),  controller.getSlotsByDate);

router.post("/available-slots", auth(),  controller.getAvailableSlots);

router.post("/all-slots", auth(),  controller.getAllSlots);

router.post("/book-slot", auth(),  controller.bookAppointmentSlot);


module.exports = router;
