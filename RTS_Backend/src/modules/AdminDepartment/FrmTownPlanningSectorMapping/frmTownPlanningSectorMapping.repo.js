const { executeQueryTMC } = require("../../../db/queryExecutor");


const getUserListRepo = async () => {
  try {
    const query = `
      SELECT
        num_user_userid   AS USERID,
        var_user_username AS USERNAME
      FROM admins.aoma_user_def
      ORDER BY var_user_username
    `;

    const result = await executeQueryTMC(query, {});

    return {
      success: true,
      rows: result.rows || [],
    };
  } catch (error) {
    console.error("GET USER LIST REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};

const getSectorListWithMappingRepo = async ({ userId }) => {
  try {
    const query = `
      SELECT
        s.num_sector_id   AS SECTORID,
        s.var_sector_name AS SECTORNAME,
        CASE
          WHEN c.num_sector_sectorid IS NOT NULL THEN 1
          ELSE 0
        END AS ISMAPPED
      FROM aorts_sector_mst s
      LEFT JOIN aorts_sector_config c
        ON  c.num_sector_sectorid = s.num_sector_id
        AND c.var_sector_userid   = :userId
      WHERE s.var_sector_active = 'Y'
      ORDER BY s.num_sector_id
    `;

    const result = await executeQueryTMC(query, { userId: String(userId) });

    return {
      success: true,
      rows: result.rows || [],
    };
  } catch (error) {
    console.error("GET SECTOR LIST WITH MAPPING REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};


const saveSectorMappingRepo = async ({ userId, sectorIds }) => {
  try {
    const deleteQuery = `
      DELETE FROM aorts_sector_config
      WHERE var_sector_userid = :userId
    `;

    const deleteResult = await executeQueryTMC(
      deleteQuery,
      { userId: String(userId) },
      { autoCommit: true }
    );

    if (!deleteResult.success) {
      throw new Error(deleteResult.error);
    }

    console.log(`[SectorMapping] Deleted old rows for user ${userId}`);
    let insertedRows = 0;

    if (Array.isArray(sectorIds) && sectorIds.length > 0) {
      const insertQuery = `
        INSERT INTO aorts_sector_config (
          var_sector_userid,
          num_sector_sectorid
        ) VALUES (
          :userId,
          :sectorId
        )
      `;

      for (const sectorId of sectorIds) {
        const insertResult = await executeQueryTMC(
          insertQuery,
          {
            userId: String(userId),
            sectorId: Number(sectorId),
          },
          { autoCommit: true }
        );

        if (!insertResult.success) {
          throw new Error(insertResult.error);
        }

        insertedRows++;
      }
    }

    console.log(`[SectorMapping] Inserted ${insertedRows} new rows for user ${userId}`);

    return {
      success: true,
      insertedRows,
    };
  } catch (error) {
    console.error("SAVE SECTOR MAPPING REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  getUserListRepo,
  getSectorListWithMappingRepo,
  saveSectorMappingRepo,
};
