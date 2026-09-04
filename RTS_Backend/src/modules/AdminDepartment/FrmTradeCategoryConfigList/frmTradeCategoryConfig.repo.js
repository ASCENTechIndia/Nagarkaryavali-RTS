const { executeQueryTMC } = require("../../../db/queryExecutor");
const { withTxTMC } = require("../../../db/tx");

// ============================================================
// GET TRADE CATEGORY CONFIG LIST
//
// .NET FrmTradeCtgryCnfgList page query:
//   select categoryid, buisnessnm, type, status, jwalanshilstat 
//   from vw_tradconfg
// ============================================================
const getTradeCategoryConfigListRepo = async () => {
  try {
    const query = `
      SELECT
        categoryid     AS TRADECATID,
        buisnessnm     AS BUSINESSNAME,
        type           AS TYPE,
        jwalanshilstat AS INFLAMMABLE,
        status         AS STATUS
      FROM vw_tradconfg
      ORDER BY buisnessnm
    `;

    const result = await executeQueryTMC(query, {});

    return {
      success: true,
      rows: result.rows || [],
    };
  } catch (error) {
    console.error("GET TRADE CATEGORY CONFIG LIST REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};

// ============================================================
// GET BUSINESS CATEGORY LIST (for dropdown in master form)
//
// .NET Page_Load query (exact):
//   select var_tradecategory_name, num_tradecategory_id
//   from aorts_TradeCategory_mas
//   where var_tradecategory_flag='Y'
// ============================================================
const getBusinessCategoryListRepo = async () => {
  try {
    const query = `
      SELECT
        num_tradecategory_id   AS BUSINESSCATID,
        var_tradecategory_name AS BUSINESSCATNAME
      FROM aorts_TradeCategory_mas
      WHERE var_tradecategory_flag = 'Y'
      ORDER BY var_tradecategory_name
    `;

    const result = await executeQueryTMC(query, {});

    return {
      success: true,
      rows: result.rows || [],
    };
  } catch (error) {
    console.error("GET BUSINESS CATEGORY LIST REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};

// ============================================================
// GET SINGLE TRADE CATEGORY CONFIG (for Edit pre-fill)
//
// .NET GetTradeCtgryCnfg() exact query:
//   select num_category_catgryid categoryid,
//          var_category_type type,
//          var_category_status status,
//          var_category_jwalanshilstat jwalanshilstat
//   from aorts_category_confg
//   Where num_category_catgryid = ':categoryId'
// ============================================================
const getTradeCategoryConfigByIdRepo = async ({ categoryId }) => {
  try {
    const query = `
      SELECT
        num_category_catgryid       AS CATEGORYID,
        var_category_type           AS TYPE,
        var_category_status         AS STATUS,
        var_category_jwalanshilstat AS JWALANSHILSTAT
      FROM aorts_category_confg
      WHERE num_category_catgryid = :categoryId
    `;

    const result = await executeQueryTMC(query, {
      categoryId: Number(categoryId),
    });

    return {
      success: true,
      row: result.rows?.[0] || null,
    };
  } catch (error) {
    console.error("GET TRADE CATEGORY CONFIG BY ID REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};

// ============================================================
// SAVE TRADE CATEGORY CONFIG — mirrors BoTradeCtgryCnfgInsert()
//
// .NET BtnSubmit_Click fields:
//   objTradeCtgryCnfg.categoryTradeid = ddlTradeCategory.SelectedValue
//   objTradeCtgryCnfg.type            = rdbnLicenseType.SelectedValue ('Trade'|'Storage')
//   objTradeCtgryCnfg.status          = rdbStatus.SelectedValue       ('Y'|'N')
//   objTradeCtgryCnfg.jwalan          = rbtnJwalan.SelectedValue       ('Y'|'N')
//   objTradeCtgryCnfg.mode            = 1 (Insert) | 2 (Update)
//
// Node.js: same logic in Oracle transaction
//   mode "1" → INSERT into aorts_category_confg
//   mode "2" → UPDATE aorts_category_confg WHERE num_category_catgryid = categoryId
// ============================================================
const saveTradeCategoryConfigRepo = async ({
  tradeCatId,       // used on mode 2 (UPDATE)
  businessCategoryId,
  type,             // 'Trade' | 'Storage'
  inflammable,      // 'Yes' | 'No'  → stored as 'Y' | 'N'
  status,           // 'Yes' | 'No'  → stored as 'Y' | 'N'
  mode,             // "1" | "2"
}) => {
  return await withTxTMC(async (conn) => {
    // Convert Yes/No → Y/N  (matches .NET radio button values)
    const inflammableFlag = inflammable === "Yes" ? "Y" : "N";
    const statusFlag      = status      === "Yes" ? "Y" : "N";

    let rowsAffected = 0;
    let operation    = "";

    if (mode === "2" && tradeCatId) {
      // ── UPDATE (mode = 2) ─────────────────────────────────
      const updateQuery = `
        UPDATE aorts_category_confg
        SET
          var_category_type           = :type,
          var_category_jwalanshilstat = :inflammableFlag,
          var_category_status         = :statusFlag
        WHERE num_category_catgryid   = :tradeCatId
      `;

      const result = await conn.execute(
        updateQuery,
        {
          type:            String(type),
          inflammableFlag: String(inflammableFlag),
          statusFlag:      String(statusFlag),
          tradeCatId:      Number(tradeCatId),
        },
        { autoCommit: false }
      );

      rowsAffected = result.rowsAffected || 0;
      operation    = "UPDATE";

    } else {
      // ── INSERT (mode = 1) ─────────────────────────────────
      const insertQuery = `
        INSERT INTO aorts_category_confg (
          num_category_catgryid,
          var_category_type,
          var_category_jwalanshilstat,
          var_category_status
        ) VALUES (
          :businessCategoryId,
          :type,
          :inflammableFlag,
          :statusFlag
        )
      `;

      const result = await conn.execute(
        insertQuery,
        {
          businessCategoryId: Number(businessCategoryId),
          type:               String(type),
          inflammableFlag:    String(inflammableFlag),
          statusFlag:         String(statusFlag),
        },
        { autoCommit: false }
      );

      rowsAffected = result.rowsAffected || 0;
      operation    = "INSERT";
    }

    console.log(`[TradeCategoryConfig] ${operation}: rowsAffected=${rowsAffected}`);

    return {
      success: true,
      rowsAffected,
      operation,
    };
  });
};

module.exports = {
  getTradeCategoryConfigListRepo,
  getBusinessCategoryListRepo,
  getTradeCategoryConfigByIdRepo,
  saveTradeCategoryConfigRepo,
};
