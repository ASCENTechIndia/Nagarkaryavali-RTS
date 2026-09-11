const { executeQueryTMC }     = require("../../../db/queryExecutor");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const oracledb                 = require("oracledb");

const getNocRoadTypeListRepo = async () => {
  try {
    const query = `
      SELECT
        NUM_ROADTYPE_ID   AS roadTypeId,
        VAR_ROADTYPE_NAME AS roadTypeName
      FROM AORTS_NOCROADTYPE_MAS
      ORDER BY VAR_ROADTYPE_NAME
    `;

    const result = await executeQueryTMC(query, {});

    return {
      success: true,
      rows:    result.rows || [],
    };
  } catch (error) {
    console.error("GET NOC ROAD TYPE LIST REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};

const saveNocRoadTypeRepo = async ({
  userId,
  roadTypeId,
  roadTypeName,
  ulbId,
  mode,
  ipAddress,
  ipSource,
}) => {
  try {
    const sql = `
      BEGIN
        AORTS_NOCROADTYPE_INS(
          :IN_USERID,
          :IN_ROADTYPEID,
          :IN_NAME,
          :IN_ULBID,
          :IN_MODE,
          :IN_IPADDRESS,
          :IN_IPSOURCE,
          :OUT_ERRCODE,
          :OUT_ERRMSG
        );
      END;
    `;

    const binds = {
      IN_USERID:     String(userId || ""),
      IN_ROADTYPEID: Number(roadTypeId || 0),
      IN_NAME:       String(roadTypeName || "").trim(),
      IN_ULBID:      Number(ulbId || 0),
      IN_MODE:       Number(mode || 1),
      IN_IPADDRESS:  String(ipAddress || ""),
      IN_IPSOURCE:   String(ipSource  || "WEB"),
      OUT_ERRCODE:   { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_ERRMSG:    { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
    };

    console.log("NOC Road Type Procedure Input:", {
      ...binds,
      OUT_ERRCODE: "OUT",
      OUT_ERRMSG:  "OUT",
    });

    const result = await executeProcedureTMC({ sql, binds });

    if (!result.success) {
      console.error("NOC Road Type Procedure Execution Error:", result.error);
      return {
        success: false,
        errCode: 1500,
        errMsg:  result.error || "Failed to execute procedure.",
      };
    }

    const outBinds = result.outBinds || {};
    const errCode  = Number(outBinds.OUT_ERRCODE ?? outBinds.out_errcode ?? 0);
    const errMsg   = outBinds.OUT_ERRMSG ?? outBinds.out_errmsg ?? "";

    console.log("NOC Road Type Procedure Output:", { errCode, errMsg });

    return {
      success: errCode === 9999,
      errCode,
      errMsg,
    };
  } catch (error) {
    console.error("SAVE NOC ROAD TYPE REPO ERROR:", error);
    return {
      success: false,
      errCode: 1500,
      errMsg:  error.message || "Failed to save NOC Road Type.",
    };
  }
};

module.exports = {
  getNocRoadTypeListRepo,
  saveNocRoadTypeRepo,
};
