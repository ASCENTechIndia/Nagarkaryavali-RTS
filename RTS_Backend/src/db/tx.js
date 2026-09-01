const oracledb = require("oracledb");
const { getConnectionTMC } = require("../config/db");

async function withTxTMC(fn) {
  let connection;

  try {
    connection = await getConnectionTMC();

    const result = await fn(connection);

    await connection.commit();

    return result;

  } catch (err) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (_) {}
    }
    throw err;

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (_) {}
    }
  }
}

module.exports = {withTxTMC};