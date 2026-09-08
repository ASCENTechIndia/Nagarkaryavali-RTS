const { executeQueryTMC } = require("../../../db/queryExecutor");
const oracledb = require("oracledb");

const getServiceListRepo = async () => {
  try {
    const query = `
      SELECT
        num_service_serviceid AS SERVICEID,
        var_service_eng_name  AS SERVICENAME
      FROM aorts_service_def
      ORDER BY num_service_serviceid
    `;

    const result = await executeQueryTMC(query, {});

    return {
      success: true,
      rows: result.rows || [],
    };
  } catch (error) {
    console.error("GET SERVICE LIST REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};


const getZoneListRepo = async () => {
  try {
    const query = `
      SELECT
        num_corporation_corpid  AS ZONEID,
        var_corporation_engname AS ZONENAME
      FROM aorts_corporation_def
      WHERE num_corporation_parentid = 10001
        AND num_corporation_category = 3
      ORDER BY var_corporation_engname
    `;

    const result = await executeQueryTMC(query, {});

    return {
      success: true,
      rows: result.rows || [],
    };
  } catch (error) {
    console.error("GET ZONE LIST REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};

const getAppliReportRepo = async ({
  serviceId,
  fromDate,
  toDate,
  zoneId,
  appliNo,
  mobileNo,
}) => {
  try {
    const binds = {};

    let whereClause = " WHERE 1 = 1 ";

    if (serviceId && String(serviceId) !== "-1") {
      whereClause += " AND num_appl_serviceid = :serviceId ";
      binds.serviceId = String(serviceId);
    }

    if (fromDate && toDate) {
      whereClause += `
        AND TRUNC(applidet.dat_application_insdate)
          BETWEEN TO_DATE(:fromDate, 'DD-MON-YYYY')
            AND TO_DATE(:toDate,   'DD-MON-YYYY')
      `;
      binds.fromDate = String(fromDate);
      binds.toDate   = String(toDate);
    }

    if (zoneId && String(zoneId) !== "-1") {
      whereClause += " AND num_application_zoneid = :zoneId ";
      binds.zoneId = Number(zoneId);
    }

    if (appliNo && appliNo.trim() !== "") {
      whereClause += " AND var_application_appno = :appliNo ";
      binds.appliNo = appliNo.trim();
    }

    if (mobileNo && mobileNo.trim() !== "") {
      whereClause += " AND var_appl_mobno = :mobileNo ";
      binds.mobileNo = mobileNo.trim();
    }

    const query = `
      SELECT
        serviceid,
        servicename,
        appno,
        apliname,
        mobileno,
        address,
        recieptno,
        recieptdate,
        amount,
        deptname,
        applidate,
        deptid,
        pageurl,
        authdate,
        service_delivery_time,
        num_service_maxdays,
        var_application_status,
        CASE
          WHEN ROUND(
            (NVL(num_service_maxdays, 3) / service_delivery_time) * 100, 2
          ) > 100
          THEN 100
          ELSE ROUND(
            (NVL(num_service_maxdays, 3) / service_delivery_time) * 100, 2
          )
        END AS SERVICE_TAT
      FROM (
        SELECT
          appinfo.num_appl_serviceid                                        AS serviceid,
          var_service_eng_name                                              AS servicename,
          applidet.var_application_appno                                    AS appno,
          var_appl_firstname || ' ' || var_appl_middlename
            || ' ' || var_appl_lastname                                     AS apliname,
          var_appl_mobno                                                    AS mobileno,
          var_appl_address                                                  AS address,
          applidet.var_appliaction_recieptno                                AS recieptno,
          TO_CHAR(applidet.dat_application_recieptdate)                     AS recieptdate,
          applidet.num_application_amount                                   AS amount,
          var_dept_engname                                                  AS deptname,
          TO_CHAR(appinfo.dat_application_insdate)                          AS applidate,
          applidet.num_application_deptid                                   AS deptid,
          var_servmenu_pageurl                                              AS pageurl,
          TRUNC(
            NVL(
              CASE
                WHEN var_application_status = 'DL'
                THEN NVL(
                  appinfo.date_appl_hodauthdt,
                  TRUNC(applidet.dat_application_recieptdate) + 1
                )
                WHEN var_application_status IN ('CR', 'CA')
                THEN appinfo.date_appl_clerkauthdt
              END,
              SYSDATE
            )
          )                                                                 AS authdate,
          GREATEST(
            TRUNC(
              NVL(
                CASE
                  WHEN var_application_status = 'DL'
                  THEN NVL(
                    appinfo.date_appl_hodauthdt,
                    TRUNC(applidet.dat_application_recieptdate) + 1
                  )
                  WHEN var_application_status IN ('CR', 'CA')
                  THEN appinfo.date_appl_clerkauthdt
                END,
                SYSDATE
              )
            ) - TRUNC(appinfo.dat_application_insdate),
            0
          ) + 1                                                             AS service_delivery_time,
          num_service_maxdays,
          var_application_status
        FROM aorts_applicant_infodet appinfo
        JOIN aorts_application_det applidet
          ON  applidet.var_application_appno    = appinfo.var_appl_appno
          AND applidet.num_application_serviceid = appinfo.num_appl_serviceid
          AND applidet.num_application_ulbid     = appinfo.num_appl_ulbid
        JOIN admins.aoms_dept_mas
          ON num_dept_id = applidet.num_application_deptid
        JOIN aorts_service_def
          ON num_service_serviceid = appinfo.num_appl_serviceid
        JOIN aorts_servmenu_mas
          ON num_servmenu_servid = appinfo.num_appl_serviceid
        ${whereClause}
      )
      ORDER BY applidate
    `;

    const result = await executeQueryTMC(query, binds);

    return {
      success: true,
      rows: result.rows || [],
    };
  } catch (error) {
    console.error("GET APPLI REPORT REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};

const getAppliDocumentsRepo = async ({ appliNo, authMode }) => {
  let connection;

  try {
    const applicationNo = String(appliNo || "").trim();

    if (!applicationNo) {
      return {
        success: false,
        error: "Application number is required.",
        rows: [],
      };
    }

    const binds = {
      appliNo: applicationNo,
    };

    // =========================================================
    // CONVERT ORACLE LOB TO BASE64
    // IMPORTANT: This must happen before connection.close()
    // =========================================================
    const lobToBase64 = async (lob) => {
      if (!lob) return null;

      // Buffer
      if (Buffer.isBuffer(lob)) {
        return lob.toString("base64");
      }

      // Uint8Array
      if (lob instanceof Uint8Array) {
        return Buffer.from(lob).toString("base64");
      }

      // Oracle Lob
      if (typeof lob.on === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];

          lob.on("data", (chunk) => {
            chunks.push(Buffer.from(chunk));
          });

          lob.on("end", () => {
            try {
              const buffer = Buffer.concat(chunks);
              resolve(buffer.toString("base64"));
            } catch (error) {
              reject(error);
            }
          });

          lob.on("error", (error) => {
            reject(error);
          });
        });
      }

      return null;
    };

    // =========================================================
    // DOCUMENT QUERY
    // =========================================================
    let query = `
      SELECT
        A.num_appdoc_documentid AS DOCID,
        D.var_doc_engname AS DOCNAME,
        D.var_doc_engname AS FILENAME,
        A.blob_appdoc_documentimg AS FILEBYTES,
        '.PDF' AS FILEEXTENSION,
        'Citizen' AS DOCTYPE,
        CASE
          WHEN A.var_appdoc_vrfyflag IS NULL THEN 'N'
          ELSE 'Y'
        END AS VRFYFLAG
      FROM aorts_appdoc_det A
      LEFT JOIN aorts_doc_def D
        ON D.num_doc_serviceid = A.num_appdoc_serviceid
        AND D.num_doc_id = A.num_appdoc_documentid
      WHERE A.var_appdoc_appno = :appliNo
    `;

    // =========================================================
    // HO DOCUMENTS
    // =========================================================
    if (String(authMode || "").toUpperCase() === "HO") {
      query += `
        UNION ALL

        SELECT
          ROWNUM AS DOCID,
          var_appverifdoc_docname AS DOCNAME,
          var_appverifdoc_docname AS FILENAME,
          blob_appverifdoc_documentimg AS FILEBYTES,
          '.PDF' AS FILEEXTENSION,
          'Clerk' AS DOCTYPE,
          'Y' AS VRFYFLAG
        FROM aorts_appverifdoc_det
        WHERE var_appverifdoc_applino = :appliNo
      `;
    }

    console.log("========================================");
    console.log("GET APPLI DOCUMENTS");
    console.log("APPLICATION NO:", applicationNo);
    console.log("AUTH MODE:", authMode || "HO");
    console.log("========================================");

    // =========================================================
    // IMPORTANT:
    // DO NOT USE executeQueryTMC HERE.
    //
    // executeQueryTMC closes the connection immediately,
    // therefore Oracle LOB cannot be read afterwards.
    //
    // Use getConnectionTMC directly.
    // =========================================================
    const { getConnectionTMC } = require("../../../config/db");

    connection = await getConnectionTMC();

    const result = await connection.execute(
      query,
      binds,
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    const documentRows = result.rows || [];

    console.log("DOCUMENT COUNT:", documentRows.length);

    // =========================================================
    // READ ALL BLOBS WHILE CONNECTION IS OPEN
    // =========================================================
    const rows = [];

    for (const row of documentRows) {
      let fileBytes = null;

      if (row.FILEBYTES) {
        console.log(
          "DOCUMENT TYPE:",
          row.FILEBYTES?.constructor?.name
        );

        fileBytes = await lobToBase64(row.FILEBYTES);
      }

      rows.push({
        DOCID: row.DOCID,
        DOCNAME: row.DOCNAME || "Document",
        FILENAME: row.FILENAME || row.DOCNAME || "Document",
        FILEBYTES: fileBytes,
        FILEEXTENSION: row.FILEEXTENSION || ".PDF",
        DOCTYPE: row.DOCTYPE || "Citizen",
        VRFYFLAG: row.VRFYFLAG || "N",
        HASDOCUMENT: Boolean(fileBytes),
      });
    }

    console.log("========================================");
    console.log("FINAL DOCUMENT COUNT:", rows.length);

    if (rows.length > 0) {
      console.log("FIRST DOCUMENT:", {
        DOCID: rows[0].DOCID,
        DOCNAME: rows[0].DOCNAME,
        HASDOCUMENT: rows[0].HASDOCUMENT,
        BASE64_START: rows[0].FILEBYTES?.substring(0, 20),
      });
    }

    console.log("========================================");

    return {
      success: true,
      rows,
    };
  } catch (error) {
    console.error(
      "GET APPLI DOCUMENTS REPO ERROR:",
      error
    );

    return {
      success: false,
      error: error.message,
      rows: [],
    };
  } finally {
    // Connection closes only after all LOBs are converted
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error(
          "ERROR CLOSING TMC CONNECTION:",
          closeError
        );
      }
    }
  }
};

module.exports = {
  getServiceListRepo,
  getZoneListRepo,
  getAppliReportRepo,
  getAppliDocumentsRepo,
};
