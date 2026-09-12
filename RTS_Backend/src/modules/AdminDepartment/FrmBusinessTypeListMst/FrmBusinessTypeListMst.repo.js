const oracledb = require("oracledb");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const { executeQueryTMC } = require("../../../db/queryExecutor");

async function fetchBusinessTypeById(bustypId) {
  const sql = `
    SELECT num_bustyp_id, var_bustyp_name
    FROM AORTS_NOCBUSINESSTYP_MAS
    WHERE num_bustyp_id = :bustypId
  `;
  const binds = { bustypId: Number(bustypId) };
  const result = await executeQueryTMC( sql, binds );
  return result.rows || [];
}

async function fetchAllBusinessTypes(ulbid) {
  const sql = `SELECT * FROM AORTS_NOCBUSINESSTYP_MAS where num_bustyp_ulbid= :ulbid`;

  const binds = { ulbid: Number(ulbid) };
  const result = await executeQueryTMC(sql, binds);
  return result.rows || [];
}

async function executeBusinessTypeProcedure(params) {
  const sql = `
    BEGIN
      AORTS_NOCBUSINESSTYP_INS(
        :IN_USERID,
        :IN_ID,
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
    IN_USERID: params.userId,
    IN_ID: params.id ,
    IN_NAME: params.name,
    IN_ULBID: params.ulbid,
    IN_MODE: params.mode, 
    IN_IPADDRESS: params.ipAddress ,
    IN_IPSOURCE: params.ipSource ,

    OUT_ERRCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    OUT_ERRMSG: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1000 }
  };

  const result = await executeProcedureTMC({ sql, binds });
  return result.outBinds;
}

module.exports = { fetchBusinessTypeById, fetchAllBusinessTypes, executeBusinessTypeProcedure };
