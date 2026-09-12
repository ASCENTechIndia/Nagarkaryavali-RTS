const { executeQueryTMC } = require("../../../db/queryExecutor");
const { withTxTMC } = require("../../../db/tx");
const oracledb = require("oracledb");

const getNOCHordingTypeListRepo = async ({ ulbId }) => {
  try {
    const query = `
      SELECT
        NUM_HORDINGTYPE_ID       AS HORDINGTYPEID,
        VAR_HORDINGTYPE_NAME     AS HORDINGTYPENAME
      FROM AORTS_NOCHORDINGTYPE_MAS
      WHERE NUM_HORDINGTYPE_ULBID = :ulbId
      ORDER BY NUM_HORDINGTYPE_ID
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
    console.error("Get NOC Hording Type List Repo ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

const getNOCHordingTypeByIdRepo = async (hordId) => {
  try {
    const query = `
      SELECT
        NUM_HORDINGTYPE_ID       AS HORDINGTYPEID,
        VAR_HORDINGTYPE_NAME     AS HORDINGTYPENAME,
        NUM_HORDINGTYPE_ULBID    AS ULBID
      FROM AORTS_NOCHORDINGTYPE_MAS
      WHERE NUM_HORDINGTYPE_ID = :hordId
    `;

    const result = await executeQueryTMC(query, {
      hordId: Number(hordId),
    });

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error("Get NOC Hording Type By Id Repo:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

const saveNOCHordingTypeRepo = async ({
  userId,
  hordingTypeId,
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
          AORTS_NOCHORDINGTYPE_INS(
            :in_userid,
            :in_hordingtypeid,
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
        in_hordingtypeid:
          hordingTypeId !== undefined && hordingTypeId !== null
            ? Number(hordingTypeId)
            : null,
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
    console.error("SAVE NOC HORDING TYPE REPO ERROR:", error);

    return {
      success: false,
      errorCode: 1500,
      errorMsg: error.message,
    };
  }
};

module.exports = {
  getNOCHordingTypeListRepo,
  getNOCHordingTypeByIdRepo,
  saveNOCHordingTypeRepo,
};