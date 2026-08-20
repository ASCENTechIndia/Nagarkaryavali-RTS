const oracledb = require("oracledb");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");

async function insertPropAppeal(params) {
  const {
    userId,
    zoneId,
    serviceId,
    propNo,
    subCode,
    landHolder,
    structHolder,
    ownDetails,
    address,
    appliName,
    mobile,
    email,
    aadhar,
    objectType,
    objectDesc,
    taxDate1,
    taxDate2,
    oldUsage,
    newUsage,
    oldSubUsage,
    newSubUsage,
    oldArea,
    newArea,
    oldYrKaryogya,
    newYrKaryogya,
    oldKaryogya,
    newKaryogya,
    appSource,
  } = params;

  console.log("Insert Property Appeal:", {
    userId,
    zoneId,
    serviceId,
    propNo,
    appliName,
    appSource,
  });

  const sql = `
    BEGIN
      aorts_PropAppeal_ins(
        :IN_USERID,
        :IN_Zoneid,
        :IN_Serviceid,
        :IN_PropNO,
        :IN_SubCode,
        :IN_LandHolder,
        :IN_StructHolder,
        :IN_OwnDetails,
        :IN_Address,
        :IN_Appliname,
        :IN_Mobile,
        :IN_Email,
        :IN_Aadhar,
        :IN_Objecttype,
        :IN_ObjectDesc,
        :IN_TaxDate1,
        :IN_TaxDate2,
        :IN_OldUsage,
        :IN_NewUsage,
        :IN_OldSubUsage,
        :IN_NewSubUsage,
        :IN_OldArea,
        :IN_NewArea,
        :IN_OldYrKaryogya,
        :IN_NewYrKaryogya,
        :IN_OldKaryogya,
        :IN_NewKaryogya,
        :in_source,
        :out_errcode,
        :out_ErrMsg,
        :out_applino
      );
    END;
  `;

  const binds = {
    IN_USERID: userId,

    IN_Zoneid: {
      val: Number(zoneId),
      type: oracledb.NUMBER,
    },

    IN_Serviceid: {
      val: Number(serviceId),
      type: oracledb.NUMBER,
    },

    IN_PropNO: propNo || null,
    IN_SubCode: subCode || null,
    IN_LandHolder: landHolder || null,
    IN_StructHolder: structHolder || null,
    IN_OwnDetails: ownDetails || null,
    IN_Address: address || null,
    IN_Appliname: appliName || null,

    IN_Mobile:
      mobile !== undefined && mobile !== null && mobile !== ""
        ? {
            val: Number(mobile),
            type: oracledb.NUMBER,
          }
        : null,

    IN_Email: email || null,

    IN_Aadhar:
      aadhar !== undefined && aadhar !== null && aadhar !== ""
        ? {
            val: Number(aadhar),
            type: oracledb.NUMBER,
          }
        : null,

    IN_Objecttype:
      objectType !== undefined &&
      objectType !== null &&
      objectType !== ""
        ? {
            val: Number(objectType),
            type: oracledb.NUMBER,
          }
        : null,

    IN_ObjectDesc: objectDesc || null,

    IN_TaxDate1: taxDate1
      ? {
          val: new Date(taxDate1),
          type: oracledb.DATE,
        }
      : null,

    IN_TaxDate2: taxDate2
      ? {
          val: new Date(taxDate2),
          type: oracledb.DATE,
        }
      : null,

    IN_OldUsage:
      oldUsage !== undefined && oldUsage !== null && oldUsage !== ""
        ? {
            val: Number(oldUsage),
            type: oracledb.NUMBER,
          }
        : null,

    IN_NewUsage:
      newUsage !== undefined && newUsage !== null && newUsage !== ""
        ? {
            val: Number(newUsage),
            type: oracledb.NUMBER,
          }
        : null,

    IN_OldSubUsage:
      oldSubUsage !== undefined &&
      oldSubUsage !== null &&
      oldSubUsage !== ""
        ? {
            val: Number(oldSubUsage),
            type: oracledb.NUMBER,
          }
        : null,

    IN_NewSubUsage:
      newSubUsage !== undefined &&
      newSubUsage !== null &&
      newSubUsage !== ""
        ? {
            val: Number(newSubUsage),
            type: oracledb.NUMBER,
          }
        : null,

    IN_OldArea:
      oldArea !== undefined && oldArea !== null && oldArea !== ""
        ? {
            val: Number(oldArea),
            type: oracledb.NUMBER,
          }
        : null,

    IN_NewArea:
      newArea !== undefined && newArea !== null && newArea !== ""
        ? {
            val: Number(newArea),
            type: oracledb.NUMBER,
          }
        : null,

    IN_OldYrKaryogya:
      oldYrKaryogya !== undefined &&
      oldYrKaryogya !== null &&
      oldYrKaryogya !== ""
        ? {
            val: Number(oldYrKaryogya),
            type: oracledb.NUMBER,
          }
        : null,

    IN_NewYrKaryogya:
      newYrKaryogya !== undefined &&
      newYrKaryogya !== null &&
      newYrKaryogya !== ""
        ? {
            val: Number(newYrKaryogya),
            type: oracledb.NUMBER,
          }
        : null,

    IN_OldKaryogya:
      oldKaryogya !== undefined &&
      oldKaryogya !== null &&
      oldKaryogya !== ""
        ? {
            val: Number(oldKaryogya),
            type: oracledb.NUMBER,
          }
        : null,

    IN_NewKaryogya:
      newKaryogya !== undefined &&
      newKaryogya !== null &&
      newKaryogya !== ""
        ? {
            val: Number(newKaryogya),
            type: oracledb.NUMBER,
          }
        : null,

    // NEW PARAMETER
    in_source: appSource || "WEB",

    out_errcode: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },

    out_ErrMsg: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 4000,
    },

    out_applino: {
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
    "Property Appeal Insert Result:",
    result.outBinds
  );

  return result.outBinds;
}

module.exports = {
  insertPropAppeal,
};