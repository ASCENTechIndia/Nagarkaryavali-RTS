const { getConnectionTMC } = require("../../../config/db");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const {
  executeQueryTMC
} = require("../../../db/queryExecutor");
const oracledb = require("oracledb");

async function getHearingList(params) {
  const { fromDate, toDate } = params;

  let query = `
    SELECT 
      Appno, 
      AppealNo, 
      AppealType, 
      BriefDetails, 
      Appellant, 
      Respondent, 
      appealid, 
      hearingdt 
    FROM view_hearing
    WHERE 1=1
  `;

  const bindParams = {};

  if (fromDate) {
    query += ` AND TRUNC(hearingdt) >= TO_DATE(:fromDate, 'DD-MM-YYYY')`;
    bindParams.fromDate = fromDate;
  }

  if (toDate) {
    query += ` AND TRUNC(hearingdt) <= TO_DATE(:toDate, 'DD-MM-YYYY')`;
    bindParams.toDate = toDate;
  }

  console.log("Get Hearing List Query:", query);
  console.log("Bind Params:", bindParams);

  try {
    const result = await executeQueryTMC(query, bindParams);

    console.log("result", result);

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error("getHearingList Error:", error);
    return {
      success: false,
      error: error.message,
      rows: [],
    };
  }
}

async function getAppealTypes() {
  const query = `
    SELECT 
      var_appealtype_appeal AS appealType, 
      num_appealtype_id AS appealTypeId 
    FROM aorts_appealtype_mas
  `;

  console.log("Get Appeal Types Query:", query);

  try {
    const result = await executeQueryTMC(query, {});
    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error("getAppealTypes Error:", error);
    return {
      success: false,
      error: error.message,
      rows: [],
    };
  }
}

async function getHearingData(params) {
  const { appno, appealno, appealid } = params;

  const query = `
    SELECT 
      Appno, 
      AppealNo, 
      appealtypeid, 
      AppealType, 
      BriefDetails, 
      Appellant, 
      Respondent, 
      AppealDate 
    FROM view_hearing 
    WHERE Appno = :appno 
      AND appealno = :appealno 
      AND appealid = :appealid
  `;

  const bindParams = {
    appno: String(appno),
    appealno: String(appealno),
    appealid: Number(appealid),
  };

  console.log("Get Hearing Data Query:", query);
  console.log("Bind Params:", bindParams);

  try {
    const result = await executeQueryTMC(query, bindParams);
    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error("getHearingData Error:", error);
    return {
      success: false,
      error: error.message,
      rows: [],
    };
  }
}

async function insertAppealHearing(params) {
  const {
    userId,
    appealhearId,
    appealNo,
    appealDate,
    appliNo,
    appealType,
    appealDtls,
    presents,
    briefDescr,
    status,
    fine,
    mode,
    appealTypeId,
    corpId,
  } = params;

  const sql = `
    BEGIN
      aorts_appealhearing_ins(
        :IN_USERID,
        :IN_APPEALHRINGID,
        :IN_APPEALNO,
        :IN_APPEALDATE,
        :IN_APPLINO,
        :IN_APPEALTYPE,
        :IN_APEALDTLS,     
        :IN_PRESENTS,
        :IN_BREIFDESCR,
        :IN_STATUS,
        :IN_FINE,
        :IN_MODE,
        :IN_APPEALTYPEID,
        :IN_ULBID,
        :OUT_ERRCODE,
        :OUT_ERRMSG
      );
    END;
  `;

  const binds = {
    IN_USERID: String(userId),
    IN_APPEALHRINGID: Number(appealhearId) || 0,
    IN_APPEALNO: String(appealNo),
    IN_APPEALDATE: {
      val: new Date(appealDate),
      type: oracledb.DATE,
      dir: oracledb.BIND_IN,
    },
    IN_APPLINO: String(appliNo),
    IN_APPEALTYPE: Number(appealType),
    IN_APEALDTLS: String(appealDtls),
    IN_PRESENTS: String(presents),
    IN_BREIFDESCR: String(briefDescr),
    IN_STATUS: String(status),
    IN_FINE: String(fine) || null,
    IN_MODE: Number(mode) || 1,
    IN_APPEALTYPEID: Number(appealTypeId),
    IN_ULBID: Number(corpId),
    OUT_ERRCODE: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
    OUT_ERRMSG: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 500,
    },
  };

  console.log("=== DEBUG: Procedure Call ===");
  console.log("IN_USERID:", userId);
  console.log("IN_APPEALHRINGID:", appealhearId);
  console.log("IN_APPEALNO:", appealNo);
  console.log("IN_APPLINO:", appliNo);
  console.log("IN_APPEALDATE:", appealDate);
  console.log("IN_APPEALDATE (Date object):", new Date(appealDate));
  console.log("=============================");

  try {
    const result = await executeProcedureTMC({ sql, binds });

    console.log("result", result);

    const outBinds = result.outBinds || {};
    const errCode = Number(outBinds.OUT_ERRCODE);
    const errMsg = outBinds.OUT_ERRMSG || "";

    return {
      success: errCode === 9999,
      errorCode: errCode,
      message: errMsg,
      outBinds: outBinds,
    };
  } catch (error) {
    console.error("insertAppealHearing Error:", error);
    return {
      success: false,
      error: error.message,
      errorCode: -1,
      message: error.message,
    };
  }
}

async function insertAppealHearingDocument(params) {
  const {
    corpId,
    serviceId,
    appNo,
    appealNo,
    docType,
    docImage,
    appealTypeId,
  } = params;

  const query = `
    INSERT INTO aorts_AppealHearing_Doc (
      num_apilhringdoc_corpid,
      num_apilhringdoc_serviceid,
      var_apilhringdoc_applino,
      var_apilhringdoc_appealno,
      var_apilhringdoc_doctype,
      blob_apilhringdoc_docimage,
      num_AppealHearing_appealtypeid
    ) VALUES (
      :corpId,
      :serviceId,
      :appNo,
      :appealNo,
      :docType,
      :docImage,
      :appealTypeId
    )
  `;

  const bindParams = {
    corpId: Number(corpId),
    serviceId: Number(serviceId) || 0,
    appNo: String(appNo),
    appealNo: String(appealNo),
    docType: String(docType),
    docImage: {
      val: Buffer.from(docImage),
      type: oracledb.BUFFER,
      dir: oracledb.BIND_IN,
    },
    appealTypeId: Number(appealTypeId),
  };

  console.log("Insert Document Query:", query);
  console.log("Bind Params:", { ...bindParams, docImage: "[BINARY DATA]" });

  try {
    const connection = await getConnectionTMC();
    try {
      const result = await connection.execute(query, bindParams, {
        autoCommit: true,
      });

      return {
        success: true,
        rowsAffected: result.rowsAffected,
      };
    } finally {
      await connection.close();
    }
  } catch (error) {
    console.error("insertAppealHearingDocument Error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  getHearingList,
  getAppealTypes,
  getHearingData,
  insertAppealHearing,
  insertAppealHearingDocument,
};
