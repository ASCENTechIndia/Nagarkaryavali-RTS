
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const { executeQueryTMC } = require("../../../db/queryExecutor");
const oracledb = require("oracledb");


async function getSlotDetails({ applino }) {
  const query = `
    SELECT
      slot_mas.var_slot_applino AS APPLINO,
      TO_CHAR(
        slot_mas.date_slot_slotdt,
        'DD/Mon/YYYY'
      ) AS SLOTDT,
      slot_mas.var_slot_time AS SLOT,
      slot_det.var_slot_time AS SLOT_TIME
    FROM aorts_slot_mas slot_mas
    INNER JOIN aorts_slot_det slot_det
      ON slot_det.num_slot_id = slot_mas.var_slot_time
    WHERE slot_mas.var_slot_applino = :applino
  `;

  const bindParams = {
    applino: String(applino),
  };


  return await executeQueryTMC(
    query,
    bindParams
  );
}


async function getRescheduleReasons() {
  const query = `
    SELECT
      var_reschedule_reason AS RESCHEDULE_REASON,
      num_reschedule_id AS RESCHEDULE_ID
    FROM aorts_reschedule_mas
    ORDER BY num_reschedule_id
  `;

  console.log("Reschedule Reasons Query:", query);

  return await executeQueryTMC(query, {});
}


async function getSlotsByDate({ slotDate }) {
  const query = `
    SELECT
      var_slot_applino AS APPLINO,
      var_slot_time AS SLOT_TIME,
      date_slot_slotdt
    FROM aorts_slot_mas
    WHERE TRUNC(date_slot_slotdt) = TO_DATE(
      :slotDate,
      'DD-MON-YYYY'
    )
  `;

  const bindParams = {
    slotDate: String(slotDate).toUpperCase(),
  };


  return await executeQueryTMC(
    query,
    bindParams
  );
}


async function getAvailableSlots({ slotDate }) {
  const query = `
    SELECT
      var_slot_time AS SLOT_TIME,
      num_slot_id AS SLOT_ID
    FROM aorts_slot_det
    WHERE num_slot_id NOT IN (
      SELECT var_slot_time
      FROM aorts_slot_mas
      WHERE TRUNC(date_slot_slotdt) = TO_DATE(
        :slotDate,
        'DD-MON-YYYY'
      )
    )
    ORDER BY var_slot_tokenname
  `;

  const bindParams = {
    slotDate: String(slotDate).toUpperCase(),
  };


  return await executeQueryTMC(
    query,
    bindParams
  );
}


async function getAllSlots() {
  const query = `
    SELECT
      var_slot_time AS SLOT_TIME,
      num_slot_id AS SLOT_ID
    FROM aorts_slot_det
    ORDER BY var_slot_tokenname
  `;

  console.log("All Slots Query:", query);

  return await executeQueryTMC(query, {});
}


async function bookAppointmentSlot({
  userId,
  orgId,
  appNo,
  slotDate,
  slotId,
  reason,
}) {
  const sql = `
    BEGIN
      aorts_appointslot_ins(
        :in_UserId,
        :in_Orgid,
        :in_Appno,
        :in_Slotdt,
        :in_SlotId,
        :in_Reason,
        :out_ErrorCode,
        :out_ErrorMsg
      );
    END;
  `;

  const binds = {
    in_UserId: String(userId),

    in_Orgid: Number(orgId),

    in_Appno: String(appNo),

    in_Slotdt: {
      val: new Date(slotDate),
      type: oracledb.DATE,
      dir: oracledb.BIND_IN,
    },

    in_SlotId: Number(slotId),

    in_Reason: Number(reason),

    out_ErrorCode: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },

    out_ErrorMsg: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 500,
    },
  };


  const result = await executeProcedureTMC({
    sql,
    binds,
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  console.log(
    "Appointment Slot Procedure Result:",
    result.outBinds
  );

  return result;
}


module.exports = {
  getSlotDetails,
  getRescheduleReasons,
  getSlotsByDate,
  getAvailableSlots,
  getAllSlots,
  bookAppointmentSlot,
};