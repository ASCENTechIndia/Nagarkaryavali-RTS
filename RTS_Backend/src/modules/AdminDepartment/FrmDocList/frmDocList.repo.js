const { executeQueryTMC } = require("../../../db/queryExecutor");
const { withTxTMC } = require("../../../db/tx");
const oracledb = require("oracledb");


const getServiceDocumentCountRepo = async () => {
  try {
    const query = `
      SELECT
        num_doc_serviceid,
        var_service_eng_name,
        var_service_mar_name,
        COUNT(num_doc_id) AS noofdoc
      FROM aorts_doc_def
      INNER JOIN aorts_tmcservice_def
        ON num_service_serviceid = num_doc_serviceid
      GROUP BY
        num_doc_serviceid,
        var_service_eng_name,
        var_service_mar_name
      ORDER BY num_doc_serviceid
    `;

    const result = await executeQueryTMC(query, {});

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error(
      "GET SERVICE DOCUMENT COUNT REPO ERROR:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

const getAllServicesRepo = async () => {
  try {
    const query = `
      SELECT
        var_service_eng_name,
        num_service_serviceid
      FROM aorts_tmcservice_def
      ORDER BY num_service_serviceid
    `;

    const result = await executeQueryTMC(query, {});

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error(
      "GET ALL SERVICES REPO ERROR:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

const getDocumentsByServiceRepo = async (serviceId) => {
  try {
    const query = `
      SELECT
        num_doc_id,
        var_doc_engname,
        var_doc_marname,
        var_doc_chargepercopy,
        var_doc_active
      FROM aorts_doc_def
      WHERE num_doc_serviceid = :serviceId
      ORDER BY num_doc_id
    `;

    const result = await executeQueryTMC(query, {
      serviceId: Number(serviceId),
    });

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error(
      "GET DOCUMENTS BY SERVICE REPO ERROR:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

const getActiveServicesRepo = async () => {
  try {
    const query = `
      SELECT
        var_service_eng_name,
        num_service_serviceid
      FROM aorts_tmcservice_def
      WHERE num_service_serviceid NOT IN (12)
        AND var_service_active = 'Y'
      ORDER BY num_service_serviceid
    `;

    const result = await executeQueryTMC(query, {});

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error(
      "GET ACTIVE SERVICES REPO ERROR:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

const getServiceDocumentsRepo = async (serviceId) => {
  try {
    const query = `
      SELECT
        num_doc_id AS doc_id,
        var_doc_engname AS engname,
        var_doc_marname AS marname,
        num_service_serviceid AS serviceid
      FROM aorts_doc_def
      INNER JOIN aorts_service_def
        ON num_service_serviceid = num_doc_serviceid
      WHERE num_doc_serviceid = :serviceId
      ORDER BY num_doc_id
    `;

    const result = await executeQueryTMC(query, {
      serviceId: Number(serviceId),
    });

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error(
      "GET SERVICE DOCUMENTS REPO ERROR:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

const getServiceDocumentConfigRepo = async ({
  ulbId,
  serviceId,
}) => {
  try {
    const query = `
      SELECT
        num_serdoc_ulbid,
        num_serdoc_servid,
        num_serdoc_docid
      FROM aorts_serv_doc_config
      WHERE num_serdoc_ulbid = :ulbId
        AND num_serdoc_servid = :serviceId
      ORDER BY num_serdoc_docid
    `;

    const result = await executeQueryTMC(query, {
      ulbId: Number(ulbId),
      serviceId: Number(serviceId),
    });

    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rows?.length || 0,
    };
  } catch (error) {
    console.error(
      "GET SERVICE DOCUMENT CONFIG REPO ERROR:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

const saveServiceDocumentConfigRepo = async ({
  userId,
  ulbId,
  serviceId,
  servDocConfigCgStr,
  ipAddress,
  source,
}) => {
  try {
    const result = await withTxTMC(async (connection) => {
      const query = `
        BEGIN
          aorts_serv_doc_config_ins(
            :in_UserId,
            :in_ULBid,
            :in_Servid,
            :in_ServDocConfigCgStr,
            :in_ipaddress,
            :in_source,
            :Out_errorCode,
            :Out_ErrorMsg
          );
        END;
      `;

      const binds = {
        in_UserId: String(userId),

        in_ULBid: Number(ulbId),

        in_Servid: String(serviceId),

        in_ServDocConfigCgStr:
          String(servDocConfigCgStr),

        in_ipaddress:
          String(ipAddress || ""),

        in_source:
          String(source || ""),

        Out_errorCode: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },

        Out_ErrorMsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 32767,
        },
      };

      console.log(
        "================================================"
      );
      console.log(
        "PROCEDURE: aorts_serv_doc_config_ins"
      );
      console.log(
        "INPUT:",
        {
          userId,
          ulbId,
          serviceId,
          servDocConfigCgStr,
          ipAddress,
          source,
        }
      );
      console.log(
        "================================================"
      );

      const procedureResult =
        await connection.execute(
          query,
          binds,
          {
            autoCommit: false,
          }
        );

      console.log(
        "PROCEDURE OUT:",
        procedureResult.outBinds
      );

      return procedureResult.outBinds;
    });

    return {
      success: true,
      errorCode: result?.Out_errorCode,
      errorMsg: result?.Out_ErrorMsg,
    };
  } catch (error) {
    console.error(
      "SAVE SERVICE DOCUMENT CONFIG REPO ERROR:",
      error
    );

    return {
      success: false,
      errorCode: 1500,
      errorMsg: error.message,
    };
  }
};

const saveDocumentRepo = async ({
  userId,
  mode,
  docSerId,
  docSerStr,
  ipAddress,
  source,
}) => {
  try {
    const result = await withTxTMC(async (connection) => {
      const query = `
        BEGIN
          aorts_doc_ins(
            :in_UserId,
            :in_Mode,
            :in_docserid,
            :in_docserstr,
            :in_ipaddress,
            :in_source,
            :Out_ErrorCode,
            :Out_ErrorMsg
          );
        END;
      `;

      const binds = {
        in_UserId: String(userId),
        in_Mode: Number(mode),
        in_docserid: Number(docSerId),
        in_docserstr: String(docSerStr),
        in_ipaddress: String(ipAddress || ""),
        in_source: String(source || ""),

        Out_ErrorCode: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },

        Out_ErrorMsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 32767,
        },
      };

      const procedureResult = await connection.execute(
        query,
        binds,
        { autoCommit: false }
      );

      return procedureResult.outBinds;
    });

    return {
      success: true,
      errorCode: result?.Out_ErrorCode,
      errorMsg: result?.Out_ErrorMsg,
    };

  } catch (error) {
    console.error("SAVE DOCUMENT REPO ERROR:", error);

    return {
      success: false,
      errorCode: 1500,
      errorMsg: error.message,
    };
  }
};

module.exports = {
 
  getServiceDocumentCountRepo,
  getAllServicesRepo,
  getDocumentsByServiceRepo,
  getActiveServicesRepo,
  getServiceDocumentsRepo,
  getServiceDocumentConfigRepo,
  saveServiceDocumentConfigRepo,
  saveDocumentRepo,
};