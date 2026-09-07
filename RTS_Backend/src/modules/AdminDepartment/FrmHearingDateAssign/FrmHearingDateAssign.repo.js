const { executeQueryTMC } = require("../../../db/queryExecutor");
const { withTxTMC } = require("../../../db/tx");
const oracledb = require("oracledb");

const getHearingProcessListRepo = async () => {
  try {
    const query = `
      SELECT
        APPNO,
        APPEALNO,
        APPEALTYPE,
        BRIEFDETAILS,
        APPELLANT,
        RESPONDENT,
        APPEALDATE,
        APPEALID
      FROM view_hearingproccess
    `;

    const result = await executeQueryTMC(query, {});

    return {
      rows: result.rows || [],
      rowCount: result.rowCount || 0,
    };
  } catch (error) {
    console.error("Get Hearing Process List Repo Error:", error);
    throw error;
  }
};


const assignHearingDateRepo = async ({ userId, in_str, ulbId }) => {
  try {
    return await withTxTMC(async (connection) => {
      const result = await connection.execute(
        `
          BEGIN
            aorts_Hearingdt_ins(
              :In_UserId,
              :In_str,
              :in_ulbid,
              :out_errcode,
              :out_ErrMsg
            );
          END;
        `,
        {
          In_UserId: {
            dir: oracledb.BIND_IN,
            type: oracledb.STRING,
            val: userId,
          },

          In_str: {
            dir: oracledb.BIND_IN,
            type: oracledb.STRING,
            val: in_str,
          },

          in_ulbid: {
            dir: oracledb.BIND_IN,
            type: oracledb.NUMBER,
            val: Number(ulbId),
          },

          out_errcode: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER,
          },

          out_ErrMsg: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 500,
          },
        },
        {
          autoCommit: false,
        },
      );

      return {
        errCode: result.outBinds.out_errcode !== null && result.outBinds.out_errcode !== undefined ? Number(result.outBinds.out_errcode) : null,

        errMsg: result.outBinds.out_ErrMsg || "",
      };
    });
  } catch (error) {
    console.error("Assign Hearing Date Repo Error:", error);
    throw error;
  }
};

module.exports = {
  getHearingProcessListRepo,
  assignHearingDateRepo,
};
