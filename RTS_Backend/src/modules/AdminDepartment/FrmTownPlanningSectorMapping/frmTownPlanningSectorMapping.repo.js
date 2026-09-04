const { executeQueryTMC } = require("../../../db/queryExecutor");
const { withTxTMC } = require("../../../db/tx");

// ============================================================
// GET USER LIST
// .NET Query:
//   select var_user_username username, num_user_userid userid
//   from admins.aoma_user_def
// ============================================================
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

// ============================================================
// GET SECTOR LIST WITH MAPPING FLAG FOR A USER
//
// .NET cmbUser_SelectedIndexChanged uses 2 queries:
//
// 1) All active sectors:
//    SELECT var_sector_name sectornm, num_sector_id sectorid
//    FROM aorts_sector_mst
//    WHERE var_sector_active = 'Y'
//    ORDER BY num_sector_id
//
// 2) Already mapped sectors for this user:
//    select num_sector_sectorid sectorid
//    from aorts_sector_config
//    where var_sector_userid = ':userId'
//
// Combined into one LEFT JOIN → ISMAPPED flag = 1 if mapped, 0 otherwise
// ============================================================
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

// ============================================================
// SAVE SECTOR MAPPING  — mirrors InsertPWDsectConfig() in .NET
//
// .NET BtnSubmit_Click logic:
//   1. Collects checked sectorIds separated by "#"  → str
//   2. Obj.InsertPWDsectConfig() which:
//        - Deletes all rows from aorts_sector_config where var_sector_userid = User
//        - Inserts one row per selected sectorId
//
// Node.js: same inside an Oracle transaction (withTxTMC)
// ============================================================
const saveSectorMappingRepo = async ({ userId, sectorIds }) => {
  return await withTxTMC(async (conn) => {
    // ── Step 1: Delete existing rows for this user ─────────────
    const deleteQuery = `
      DELETE FROM aorts_sector_config
      WHERE var_sector_userid = :userId
    `;

    const deleteResult = await conn.execute(
      deleteQuery,
      { userId: String(userId) },
      { autoCommit: false }
    );
    const deletedRows = deleteResult.rowsAffected || 0;
    console.log(`[SectorMapping] Deleted ${deletedRows} old rows for user ${userId}`);

    // ── Step 2: Insert newly selected sectors ──────────────────
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
        await conn.execute(
          insertQuery,
          {
            userId:   String(userId),
            sectorId: Number(sectorId),
          },
          { autoCommit: false }
        );
        insertedRows++;
      }
    }

    console.log(`[SectorMapping] Inserted ${insertedRows} new rows for user ${userId}`);

    return {
      success: true,
      deletedRows,
      insertedRows,
    };
  });
};

module.exports = {
  getUserListRepo,
  getSectorListWithMappingRepo,
  saveSectorMappingRepo,
};
