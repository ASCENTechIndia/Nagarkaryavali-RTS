const { withTxTMC } = require("../../../db/tx");
const oracledb = require("oracledb");

const saveHolidayRepo = async ({
  Userid,
  Str,
  Ulbid
}) => {
  try {
    const result = await withTxTMC(async (connection) => {
      const query = `
        BEGIN
          admins.aoma_holiday_ins(
            :in_userid,
            :in_ulbid,
            :in_str,
            :out_errcode,
            :out_errmsg
          );
        END;
      `;

      const binds = {
        in_userid: String(Userid),
        in_ulbid: Number(Ulbid),
        in_str: String(Str || ""),
        out_errcode: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },
        out_errmsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 300,
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
      ErrCode: result?.out_errcode,
      ErrMsg: result?.out_errmsg,
    };
  } catch (error) {
    console.error("SAVE HOLIDAY REPO ERROR:", error);

    return {
      success: false,
      ErrCode: 1500,
      ErrMsg: error.message,
    };
  }
};

module.exports = {
  saveHolidayRepo
};