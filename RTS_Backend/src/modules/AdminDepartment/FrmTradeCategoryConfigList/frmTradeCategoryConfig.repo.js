const { executeQueryTMC } = require("../../../db/queryExecutor");

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


const saveTradeCategoryConfigRepo = async ({
  tradeCatId,       
  businessCategoryId,
  type,            
  inflammable,      
  status,           
  mode,            
}) => {
  try {
   
    const inflammableFlag = inflammable === "Yes" ? "Y" : "N";
    const statusFlag = status === "Yes" ? "Y" : "N";

    let result;
    let operation = "";

    if (mode === "2" && tradeCatId) {
      
      const updateQuery = `
        UPDATE aorts_category_confg
        SET
          var_category_type           = :type,
          var_category_jwalanshilstat = :inflammableFlag,
          var_category_status         = :statusFlag
        WHERE num_category_catgryid   = :tradeCatId
      `;

      result = await executeQueryTMC(
        updateQuery,
        {
          type: String(type),
          inflammableFlag: String(inflammableFlag),
          statusFlag: String(statusFlag),
          tradeCatId: Number(tradeCatId),
        },
        { autoCommit: true }
      );

      operation = "UPDATE";

    } else {
      
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

      result = await executeQueryTMC(
        insertQuery,
        {
          businessCategoryId: Number(businessCategoryId),
          type: String(type),
          inflammableFlag: String(inflammableFlag),
          statusFlag: String(statusFlag),
        },
        { autoCommit: true }
      );

      operation = "INSERT";
    }

    if (!result.success) {
      throw new Error(result.error);
    }

    console.log(`[TradeCategoryConfig] ${operation} successful`);

    return {
      success: true,
      operation,
    };
  } catch (error) {
    console.error("SAVE TRADE CATEGORY CONFIG REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  getTradeCategoryConfigListRepo,
  getBusinessCategoryListRepo,
  getTradeCategoryConfigByIdRepo,
  saveTradeCategoryConfigRepo,
};
