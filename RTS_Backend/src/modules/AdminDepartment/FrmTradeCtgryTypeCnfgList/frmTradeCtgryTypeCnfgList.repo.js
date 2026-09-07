const { executeQueryTMC } = require("../../../db/queryExecutor");
const { withTxTMC } = require("../../../db/tx");
const oracledb = require("oracledb");

const getTradeTypeConfigListRepo = async () => {
  try {
    const query = `
      SELECT
        CATEGORYID,
        BUISNESSNM,
        CATGTYPID,
        TRADETYPENAME,
        TYPE,
        STATUS,
        JWALANSHILSTAT
      FROM vw_tradTypeconfg
      ORDER BY CATEGORYID, CATGTYPID
    `;

    const result = await executeQueryTMC(query, {});

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error("GET TRADE TYPE CONFIG LIST REPO ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};
const getTradeCategoriesRepo = async () => {
  try {
    const query = `
      SELECT
        var_tradecategory_name,
        num_category_catgryid
      FROM aorts_category_confg
      INNER JOIN aorts_tradecategory_mas
        ON num_tradecategory_id = num_category_catgryid
      WHERE var_tradecategory_flag = 'Y'
      ORDER BY num_category_catgryid
    `;

    const result = await executeQueryTMC(query, {});

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error("GET TRADE CATEGORIES REPO ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};
const getCategoryTypeConfigRepo = async ({
  categoryId,
  categoryTypeId,
}) => {
  try {
    const query = `
      SELECT
        num_categorytype_catgryid AS categoryid,
        num_categorytype_catgtypid AS catgtypid,
        var_categorytype_type AS type,
        var_categorytype_status AS status,
        var_categorytype_jwalanshilstat AS jwalanshilstat
      FROM aorts_categorytype_confg
      WHERE num_categorytype_catgryid = :categoryId
        AND num_categorytype_catgtypid = :categoryTypeId
    `;

    const result = await executeQueryTMC(query, {
      categoryId: Number(categoryId),
      categoryTypeId: Number(categoryTypeId),
    });

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error("GET CATEGORY TYPE CONFIG REPO ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};
const getTradeTypesRepo = async (categoryId) => {
  try {
    const query = `
      SELECT
        var_tradetype_name,
        num_tradetype_id
      FROM aorts_tradetypes_mas
      WHERE var_tradetype_flag = 'Y'
        AND aomk_tradetype_tradecategoryid = :categoryId
      ORDER BY num_tradetype_id
    `;

    const result = await executeQueryTMC(query, {
      categoryId: Number(categoryId),
    });

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error("GET TRADE TYPES REPO ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};
const saveTradeTypeConfigRepo = async ({
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

const getTradeCategoriesConfigRepo = async (ulbId) => {
  try {
    const query = `
      SELECT
        num_tradecategory_id AS categoryid,
        var_tradecategory_name AS buisnessnm,
        CASE
          WHEN var_tradecategory_flag = 'Y' THEN 'Yes'
          WHEN var_tradecategory_flag = 'N' THEN 'No'
          ELSE var_tradecategory_flag
        END AS status
      FROM aorts_TradeCategory_mas
      WHERE num_tradecategory_ulbid = :ulbId
      ORDER BY num_tradecategory_id DESC
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
    console.error("GET TRADE CATEGORIES REPO ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};
const getTradeCategoryByIdRepo = async (categoryId) => {
  try {
    const query = `
      SELECT
        num_tradecategory_id AS categoryid,
        var_tradecategory_name AS tradecategorynm,
        var_tradecategory_flag AS status
      FROM aorts_TradeCategory_mas
      WHERE num_tradecategory_id = :categoryId
    `;

    const result = await executeQueryTMC(query, {
      categoryId: Number(categoryId),
    });

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error("GET TRADE CATEGORY BY ID REPO ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

const saveTradeCategoryRepo = async ({
  userId,
  categoryTradeId,
  category,
  status,
  ulbId,
  mode,
}) => {
  try {
    const result = await withTxTMC(async (connection) => {
      const query = `
        BEGIN
          aorts_trdcatgry_ins(
            :in_userid,
            :in_categoryTradeid,
            :in_category,
            :in_status,
            :in_ulbid,
            :in_mode,
            :out_errcode,
            :out_ErrMsg
          );
        END;
      `;

      const binds = {
        in_userid: String(userId),
        in_categoryTradeid: Number(categoryTradeId) || 0,
        in_category: String(category || ""),
        in_status: String(status || ""),
        in_ulbid: Number(ulbId),
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
    console.error("SAVE TRADE CATEGORY REPO ERROR:", error);

    return {
      success: false,
      errorCode: 1500,
      errorMsg: error.message,
    };
  }
};
module.exports = {
  
  getTradeTypeConfigListRepo,
  getTradeCategoriesRepo,
  getCategoryTypeConfigRepo,
  getTradeTypesRepo,
  saveTradeTypeConfigRepo,
  getTradeCategoriesConfigRepo,
  getTradeCategoryByIdRepo,
  saveTradeCategoryRepo
};

