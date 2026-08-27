const express = require("express");
const {  getConnectionTMC } = require("../config/db");

const router = express.Router();

router.get("/health", async (req, res) => {
  try {
    const conn = await getConnectionTMC();

    const result = await conn.execute(`SELECT SYSDATE FROM DUAL`);

    res.json({
      ok: true,
      api: "running",
      db: "connected",
      dbTime: result.rows[0][0],
    });

    await conn.close();

  } catch (e) {
    res.status(500).json({
      ok: false,
      api: "running",
      db: "failed",
      error: e.message,
    });
  }
});

module.exports = router;