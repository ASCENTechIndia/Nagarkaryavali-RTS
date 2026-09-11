const { executeQueryTMC } = require("../../../db/queryExecutor");
const { withTxTMC } = require("../../../db/tx");
const oracledb = require("oracledb");

const getNOCHordingTypeListRepo = async ({
  ulbId
}) => {
  try {
    const query = `
        select * from AORTS_NOCHORDINGTYPE_MAS 
        where num_hordingtype_ulbid = :ulbId
    `;

    const result = await executeQueryTMC(query, {
      ulbId: Number(ulbId)
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
      select * from AORTS_NOCHORDINGTYPE_MAS 
      where  num_hordingtype_id = :hordId
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
  categoryTradeId,
  tradeTypeId,
  type,
  jwalan,
  status,
  mode,
}) => {
  try {
    const result = await withTxTMC(async (connection) => {

      const query = `
        BEGIN
          aorts_trdtypeconfg_ins(
            :in_userid,
            :in_categoryTradeid,
            :in_Tradetypeid,
            :in_Type,
            :in_jwalan,
            :in_status,
            :in_mode,
            :out_errcode,
            :out_ErrMsg
          );
        END;
      `;

      const binds = {
        in_userid: String(userId),
        in_categoryTradeid: Number(categoryTradeId),
        in_Tradetypeid: Number(tradeTypeId),
        in_Type: String(type || ""),
        in_jwalan: String(jwalan || ""),
        in_status: String(status || ""),
        in_mode: Number(mode),

        out_errcode: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },

        out_ErrMsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 32767,
        },
      };

      const procedureResult = await connection.execute(
        query,
        binds,
        {
          autoCommit: false,
        }
      );

      return procedureResult.outBinds;
    });

    return {
      success: true,
      errorCode: result?.out_errcode,
      errorMsg: result?.out_ErrMsg,
    };

  } catch (error) {
    console.error("SAVE TRADE TYPE CONFIG REPO ERROR:", error);

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
    saveNOCHordingTypeRepo
};

