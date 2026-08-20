const oracledb = require("oracledb");
const { getConnectionANCL, getConnectionTMC } = require("../config/db");

async function executeProcedureANCL({ sql, binds = {} }) {
  let connection;

  try {
    connection = await getConnectionANCL();

    const start = Date.now();

    // const result = await connection.execute(sql, binds);
    const result = await connection.execute(sql, binds, {
      autoCommit: true
    });

    const duration = Date.now() - start;

    return {
      success: true,
      outBinds: result.outBinds || {},
      executionTimeMs: duration,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  } finally {
    if (connection) await connection.close();
  }
}

async function executeProcedureTMC({ sql, binds = {} }) {
  let connection;

  try {
    connection = await getConnectionTMC();

    const start = Date.now();

    // const result = await connection.execute(sql, binds);
    const result = await connection.execute(sql, binds, {
      autoCommit: true
    });

    const duration = Date.now() - start;

    return {
      success: true,
      outBinds: result.outBinds || {},
      executionTimeMs: duration,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { executeProcedureANCL,  executeProcedureTMC};