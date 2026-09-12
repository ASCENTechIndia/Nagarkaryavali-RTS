const { executeQueryTMC } = require("../../../db/queryExecutor");
const { withTxTMC } = require("../../../db/tx");
const oracledb = require("oracledb");

const getNOCHordingSubTypeListRepo = async ({ ulbId }) => {
  try {
    const query = `
      SELECT
        NUM_HORDSUBTYPE_ID     AS HORDSUBTYPEID,
        NUM_HORDSUBTYPE_HORDID AS HORDID,
        VAR_HORDSUBTYPE_NAME   AS HORDSUBTYPENAME,
        NUM_HORDSUBTYPE_ULBID  AS ULBID
      FROM AORTS_NOCCHORDSUBTYPE_MAS
      WHERE NUM_HORDSUBTYPE_ULBID = :ulbId
      ORDER BY NUM_HORDSUBTYPE_ID
    `;

    const result = await executeQueryTMC(query, {
      ulbId: Number(ulbId),
    });

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error("Get NOC Hording Sub Type List Repo ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

const getNOCHordingSubTypeByIdRepo = async (subTypeId) => {
  try {
    const query = `
      SELECT
        NUM_HORDSUBTYPE_ID     AS HORDSUBTYPEID,
        NUM_HORDSUBTYPE_HORDID AS HORDID,
        VAR_HORDSUBTYPE_NAME   AS HORDSUBTYPENAME,
        NUM_HORDSUBTYPE_ULBID  AS ULBID
      FROM AORTS_NOCCHORDSUBTYPE_MAS
      WHERE NUM_HORDSUBTYPE_ID = :subTypeId
    `;

    const result = await executeQueryTMC(query, {
      subTypeId: Number(subTypeId),
    });

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error("Get NOC Hording Sub Type By Id Repo:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

const saveNOCHordingSubTypeRepo = async ({
  userId,
  subTypeId,
  hordId,
  name,
  ulbId,
  mode,
  ipAddress = "",
  ipSource = "",
}) => {
  try {
    const result = await withTxTMC(async (connection) => {
      const query = `
        BEGIN
          AORTS_NOCCHORDSUBTYPE_INS(
            :in_userid,
            :in_subtypeid,
            :in_hordid,
            :in_name,
            :in_ulbid,
            :in_mode,
            :in_ipaddress,
            :in_ipsource,
            :out_errcode,
            :out_errmsg
          );
        END;
      `;

      const binds = {
        in_userid: String(userId),
        in_subtypeid:
          subTypeId !== undefined && subTypeId !== null
            ? Number(subTypeId)
            : null,
        in_hordid: Number(hordId),
        in_name: String(name || ""),
        in_ulbid: Number(ulbId),
        in_mode: Number(mode),
        in_ipaddress: String(ipAddress || ""),
        in_ipsource: String(ipSource || ""),

        out_errcode: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },

        out_errmsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 32767,
        },
      };

      const procedureResult = await connection.execute(query, binds, {
        autoCommit: false,
      });

      return procedureResult.outBinds;
    });

    return {
      success: true,
      errorCode: result?.out_errcode,
      errorMsg: result?.out_errmsg,
    };
  } catch (error) {
    console.error("SAVE NOC HORDING SUB TYPE REPO ERROR:", error);

    return {
      success: false,
      errorCode: 1500,
      errorMsg: error.message,
    };
  }
};

module.exports = {
  getNOCHordingSubTypeListRepo,
  getNOCHordingSubTypeByIdRepo,
  saveNOCHordingSubTypeRepo,
};