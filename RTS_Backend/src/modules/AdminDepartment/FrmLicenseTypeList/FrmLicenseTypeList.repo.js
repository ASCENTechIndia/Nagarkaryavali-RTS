const oracledb = require("oracledb");
const { executeQueryTMC } = require("../../../db/queryExecutor");
const { withTxTMC } = require("../../../db/tx");

// ============================================
// GET LICENSE TYPE LIST
// ============================================

async function getLicenseTypeListRepo(payload) {
  try {
    const query = `
      SELECT
        num_licensetype_id     licensetypeid,
        var_licensetype_name   licensetypename,
        num_licensetype_ulbid  licensetypeulbid
      FROM AORTS_NOCLICENSETYPE_MAS
      WHERE num_licensetype_ulbid = :ulbid
      ORDER BY num_licensetype_id
    `;

    const result = await executeQueryTMC(query, {
      ulbid: Number(payload.ulbid),
    });

    return result.rows || [];
  } catch (err) {
    console.error("GET LICENSE TYPE LIST REPO ERROR:", err);
    throw err;
  }
}

// ============================================
// GET LICENSE TYPE BY ID
// ============================================

async function getLicenseTypeByIdRepo(payload) {
  try {
    const query = `
      SELECT
        num_licensetype_id     licensetypeid,
        var_licensetype_name   licensetypename,
        num_licensetype_ulbid  licensetypeulbid
      FROM AORTS_NOCLICENSETYPE_MAS
      WHERE num_licensetype_id = :licensetypeid
      ORDER BY num_licensetype_id
    `;

    const result = await executeQueryTMC(query, {
      licensetypeid: Number(payload.licensetypeid),
    });

    return result.rows || [];
  } catch (err) {
    console.error("GET LICENSE TYPE BY ID REPO ERROR:", err);
    throw err;
  }
}

// ============================================
// INSERT / UPDATE / DELETE LICENSE TYPE
// ============================================

async function insertLicenseTypeRepo(data) {
  try {
    const result = await withTxTMC(async (connection) => {
      const query = `
        BEGIN
          AORTS_NOCLICENSETYPE_INS(
            :in_UserId,
            :in_Id,
            :in_Name,
            :in_UlbId,
            :in_Mode,
            :in_IpAddress,
            :in_IpSource,
            :Out_ErrCode,
            :Out_ErrMsg
          );
        END;
      `;

      const binds = {
        in_UserId: String(data.userId || ""),
        in_Id: data.licenseTypeId != null ? Number(data.licenseTypeId) : null,
        in_Name: String(data.licenseTypeName || ""),
        in_UlbId: Number(data.ulbId),
        in_Mode: Number(data.mode),
        in_IpAddress: String(data.ipAddress || ""),
        in_IpSource: String(data.ipSource || ""),

        Out_ErrCode: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },

        Out_ErrMsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 32767,
        },
      };

      console.log("================================================");
      console.log("PROCEDURE: AORTS_NOCLICENSETYPE_INS");
      console.log("INPUT:", data);
      console.log("================================================");

      const procedureResult = await connection.execute(query, binds, {
        autoCommit: false,
      });

      console.log("PROCEDURE OUT:", procedureResult.outBinds);

      return procedureResult.outBinds;
    });

    return {
      success: true,
      errorCode: result?.Out_ErrCode,
      errorMsg: result?.Out_ErrMsg,
    };
  } catch (error) {
    console.error("INSERT LICENSE TYPE REPO ERROR:", error);

    return {
      success: false,
      errorCode: 1500,
      errorMsg: error.message,
    };
  }
}

module.exports = {
  getLicenseTypeListRepo,
  getLicenseTypeByIdRepo,
  insertLicenseTypeRepo,
};