const { executeQueryTMC } = require("../../../db/queryExecutor");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const oracledb = require("oracledb");

async function fetchTradeTypesByUlb(ulbid) {
  const sql = `
    SELECT 
      num_tradetype_id AS tradetypeid,
      var_tradetype_name AS tradetypenm,
      aomk_tradetype_ulbid AS ulbid,
      aomk_tradetype_tradecategoryid AS tradecategoryid,
      var_tradecategory_name AS tradecategorynm,
      CASE  
        WHEN var_tradetype_flag = 'Y' THEN 'Yes' 
        WHEN var_tradetype_flag = 'N' THEN 'No'  
        ELSE var_tradetype_flag  
      END AS status
    FROM aorts_tradetypes_mas  
    INNER JOIN aorts_TradeCategory_mas 
      ON num_tradecategory_id = aomk_tradetype_tradecategoryid 
    WHERE aomk_tradetype_ulbid = :ulbid
    ORDER BY num_tradetype_id DESC
  `;

  const binds = { ulbid: Number(ulbid) };

  const result = await executeQueryTMC( sql, binds );
  return result.rows || [];
}

async function fetchTradeCategories() {
  const sql = `
    SELECT var_tradecategory_name, num_tradecategory_id
    FROM aorts_TradeCategory_mas
    WHERE var_tradecategory_flag = 'Y'
    ORDER BY num_tradecategory_id ASC
  `;
  const result = await executeQueryTMC( sql );
  return result.rows || [];
}

// 2. Trade type detail
async function fetchTradeTypeDetail({ tradeTypeId, tradeCategoryId, ulbid }) {
  const sql = `
    SELECT 
      var_tradetype_name AS tradecategorynm,
      aomk_tradetype_tradecategoryid AS tradecategoryid,
      var_tradetype_flag AS status
    FROM aorts_tradetypes_mas
    WHERE num_tradetype_id = :tradeTypeId
      AND aomk_tradetype_tradecategoryid = :tradeCategoryId
      AND aomk_tradetype_ulbid = :ulbid
  `;
  const binds = {
    tradeTypeId: Number(tradeTypeId),
    tradeCategoryId: Number(tradeCategoryId),
    ulbid: Number(ulbid)
  };
  const result = await executeQueryTMC( sql, binds );
  return result.rows || [];
}

async function executeTradeCategoryTypeProcedure(params) {
  const sql = `
    BEGIN
      aorts_trdcatgrytype_ins(
        :in_userid,
        :in_categoryTypid,
        :in_category,
        :in_categoryid,
        :in_status,
        :in_ulbid,
        :in_mode,
        :out_errcode,
        :out_ErrMsg
      );
    END;
  `;

  const binds = {
    in_userid: params.userId,
    in_categoryTypid: params.categoryTypId || null,
    in_category: params.category,
    in_categoryid: params.categoryId,
    in_status: params.status,
    in_ulbid: params.ulbid,
    in_mode: params.mode,
    out_errcode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_ErrMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1000 }
  };

  const result = await executeProcedureTMC({ sql, binds });

  if (!result.success) throw new Error(result.error);

  return result.outBinds; // <-- return only outBinds
}


module.exports = { fetchTradeTypesByUlb, fetchTradeCategories, fetchTradeTypeDetail,  executeTradeCategoryTypeProcedure };
