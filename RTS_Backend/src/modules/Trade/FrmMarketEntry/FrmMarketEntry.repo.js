const { executeQuery } = require("../../../db/queryExecutor");
const oracledb = require("oracledb");
const { withTx } = require("../../../db/tx");

// ============================================================
// GET BUSINESS PLACE
// ============================================================
const getBusinessPlaceRepo = async () => {
  const query = `
    SELECT
      var_busiplace_name,
      num_busiplace_id
    FROM aorts_busiplace_mas
  `;

  const result = await executeQuery(query);
  return result.rows || [];
};

// ============================================================
// GET JALAN SHIL
// ============================================================
const getJalanShilRepo = async () => {
  const query = `
    SELECT
      var_jalanshil_name,
      var_jalanshil_code
    FROM aorts_jalanshil_mas
  `;

  const result = await executeQuery(query);

  return result.rows || [];
};

// ============================================================
// GET ILLEGAL TYPE
// ============================================================
const getIllegalTypeRepo = async () => {
  const query = `
    SELECT
      var_illegal_name,
      num_illegal_id
    FROM aorts_illegal_mas
  `;

  const result = await executeQuery(query);

  return result.rows || [];
};

// ============================================================
// GET APPLICANT TYPE
// ============================================================
const getApplicantTypeRepo = async (ulbId) => {
  const query = `
    SELECT
      var_applitype_name,
      num_applitype_id
    FROM aorts_applitype_mas
    WHERE num_applitype_ulbid = :ulbId
      AND var_applitype_flag = 'Y'
  `;

  const result = await executeQuery(query, {
    ulbId,
  });

  return result.rows || [];
};

// ============================================================
// GET WARD
// ============================================================
const getWardRepo = async (ulbId) => {
  const query = `
    SELECT DISTINCT
      wardname,
      wardid
    FROM prop.vw_zonemas
    WHERE ulbid = :ulbId
  `;

  const result = await executeQuery(query, {
    ulbId,
  });

  return result.rows || [];
};

// ============================================================
// GET LICENSE TYPE
// ============================================================
const getLicenseTypeRepo = async () => {
  const query = `
    SELECT
      var_licensetype_name,
      num_licensetype_id
    FROM aorts_licensetype_mas
  `;

  const result = await executeQuery(query);

  return result.rows || [];
};

// ============================================================
// GET TRADE CATEGORY
// ============================================================
const getTradeCategoryRepo = async (licenseType, jalanShil) => {
  const query = `
    SELECT
      var_tradecategory_name,
      num_category_catgryid
    FROM aorts_category_confg
    INNER JOIN aorts_tradecategory_mas
      ON num_tradecategory_id = num_category_catgryid
    WHERE var_tradecategory_flag = 'Y'
      AND var_category_type = :licenseType
      AND var_category_jwalanshilstat = :jalanShil
  `;

  const result = await executeQuery(query, {
    licenseType,
    jalanShil,
  });

  return result.rows || [];
};

// ============================================================
// GET TRADE DETAILS
// ============================================================
const getTradeDetailsRepo = async (ulbId) => {
  const query = `
    SELECT
      num_trade_id AS tradeid,
      var_trade_name AS tradename,
      'N' AS flag
    FROM aorts_trade_mas
    WHERE var_trade_flag = 'Y'
      AND num_trade_ulbid = :ulbId
  `;

  const result = await executeQuery(query, {
    ulbId,
  });

  return result.rows || [];
};

// ============================================================
// GET DOCUMENT DETAILS
// ============================================================
const getDocumentDetailsRepo = async (serviceId, ulbId) => {
  const query = `
    SELECT
      num_doc_id AS docid,
      var_doc_engname AS doctypename,
      var_doc_engdocdesc AS engdocdesc,
      var_doc_type AS DocType,
      NULL AS noc_new,
      NULL AS noc_renewal,
      var_doc_active AS active
    FROM aorts_doc_def
    INNER JOIN aorts_serv_doc_config
      ON num_serdoc_servid = num_doc_serviceid
     AND num_serdoc_docid = num_doc_id
    INNER JOIN vw_services
      ON num_service_serviceid = num_doc_serviceid
    WHERE num_doc_serviceid = :serviceId
      AND num_serdoc_ulbid = :ulbId
      AND var_service_active = 'Y'
  `;

  const result = await executeQuery(query, {
    serviceId,
    ulbId,
  });

  return result.rows || [];
};

// ============================================================
// GET SELF DECLARE DATA
// ============================================================
const getSelfDeclareDataRepo = async (serviceId) => {
  const query = `
    SELECT
      num_selfdeclare_id AS id,
      var_selfdeclare_desc AS MESSAGE
    FROM aorts_selfdeclare_mas
    WHERE num_selfdeclare_servid = :serviceId
  `;

  const result = await executeQuery(query, {
    serviceId,
  });

  return result.rows || [];
};

// ============================================================
// GET TRADE TYPE DETAILS
// ============================================================
const getTradeTypeDetailsRepo = async (ulbId, tradeCategoryId, tradeTypeId) => {
  const query = `
    SELECT
      num_rate_tradetypename AS tradetype,
      num_rate_id AS tradetypeid,
      0 AS Rate,
      'N' AS flag
    FROM aorts_tradetypes_mas
    INNER JOIN aorts_tradecategory_mas
      ON aomk_tradetype_tradecategoryid = num_tradecategory_id
     AND aomk_tradetype_ulbid = num_tradecategory_ulbid
    INNER JOIN aorts_rate_mas
      ON num_rate_tradetypename = num_tradetype_id
     AND num_rate_ulbid = aomk_tradetype_ulbid
    WHERE var_tradetype_flag = 'Y'
      AND aomk_tradetype_ulbid = :ulbId
      AND num_tradecategory_id = :tradeCategoryId
      AND num_tradetype_id = :tradeTypeId
  `;

  const result = await executeQuery(query, {
    ulbId,
    tradeCategoryId,
    tradeTypeId,
  });

  return result.rows || [];
};

// ============================================================
// GET APPLICATION DETAILS
// ============================================================
const getApplicationDetailsRepo = async (applicationId, ulbId) => {
  const query = `
    SELECT
      var_appli_applino,
      var_appli_applidt,
      var_appli_oldlicencno,
      var_appli_shopname,
      var_appli_panno,
      num_appli_contactno,
      var_appli_email,
      var_appli_address,
      num_appli_zoneid,
      num_appli_wardid,
      var_appli_isprod,
      var_appli_ownspace,
      var_appli_agrmentwith,
      num_appli_area,
      var_appli_iscorpnoc,
      num_appli_busstartyr,
      var_appli_shopactno,
      var_appli_foodlicno,
      num_appli_licdays,
      var_appli_shopnamemar,
      var_appli_placeownername,
      var_appli_placeowneraddress,
      dat_appli_fromdt,
      dat_appli_todt,
      NVL(num_appli_amount, 0) AS amount,
      num_appli_licensetypeid
    FROM aomk_appli_mas
    WHERE num_appli_id = :applicationId
      AND num_appli_ulbid = :ulbId
  `;

  const result = await executeQuery(query, {
    applicationId,
    ulbId,
  });

  return result.rows || [];
};

// ============================================================
// GET APPLICATION TRADE TYPE DETAILS
// ============================================================
const getApplicationTradeTypeDetailsRepo = async (applicationId, ulbId) => {
  const query = `
    SELECT
      num_applitradetype_id,
      num_applitradetype_appliid,
      num_applitradetype_trdtypid,
      NVL(num_applitrade_traderate, 0) AS Rate,
      num_rate_tradetypename AS tradetype,
      num_rate_id AS tradetypeid
    FROM aomk_applitradetyp_det
    INNER JOIN aomk_rate_mas
      ON num_rate_id = num_applitradetype_trdtypid
     AND num_rate_ulbid = num_applitradetyp_ulbid
    WHERE num_applitradetype_appliid = :applicationId
      AND num_applitradetyp_ulbid = :ulbId
  `;

  const result = await executeQuery(query, {
    applicationId,
    ulbId,
  });

  return result.rows || [];
};

// ============================================================
// GET APPLICATION TRADE DETAILS
// ============================================================
const getApplicationTradeDetailsRepo = async (applicationId) => {
  const query = `
    SELECT
      num_applitrade_id,
      num_applitrade_appliid,
      num_applitrade_tradeid
    FROM aomk_applitrade_det
    WHERE num_applitrade_appliid = :applicationId
  `;

  const result = await executeQuery(query, {
    applicationId,
  });

  return result.rows || [];
};

// ============================================================
// GET APPLICATION DIRECTOR DETAILS
// ============================================================
const getApplicationDirectorDetailsRepo = async (applicationId) => {
  const query = `
    SELECT
      num_applidirector_id AS directorId,
      num_applidirector_aadhaarno AS adharno,
      var_applidirector_name AS dirctorname,
      Var_AppliDirector_VoterId AS VoterId,
      num_applidirector_mobileno AS mobileno,
      var_applidirector_emailid AS email,
      var_applidirector_gender AS gender,
      var_applidirector_address AS address,
      num_applidirector_applitype AS applitypeid,
      var_applitype_name AS applitypename,
      blo_applitype_photo AS imgDirectorImage
    FROM market.aomk_applidirector_det
    INNER JOIN market.aomk_applitype_mas
      ON num_applitype_id = num_applidirector_applitype
     AND num_applidirector_ulbid = num_applitype_ulbid
    WHERE num_applidirector_appliid = :applicationId
  `;

  const result = await executeQuery(query, {
    applicationId,
  });

  return result.rows || [];
};

// ============================================================
// GET APPLICATION DOCUMENT DETAILS
// ============================================================
const getApplicationDocumentDetailsRepo = async (applicationId, ulbId) => {
  const query = `
    SELECT
      docid AS primaryDocId,
      num_applidoc_appliid AS AppliId,
      docid AS docId,
      var_applidoc_doctype AS FileType,
      blo_applidoc_image AS filebyte,
      doctypename
    FROM view_document_mas
    LEFT JOIN aomk_applidoc_det
      ON docid = num_applidoc_docid
     AND num_applidoc_appliid = :applicationId
    WHERE ulbid = :ulbId
  `;

  const result = await executeQuery(query, {
    applicationId,
    ulbId,
  });

  return result.rows || [];
};

// ============================================================
// APPLICATION ENTRY
// ============================================================
const applicationEntryRepo = async (data) => {
  try {
    const fromDate = data.fromDate ? new Date(`${data.fromDate}T00:00:00`) : null;

    const toDate = data.toDate ? new Date(`${data.toDate}T00:00:00`) : null;

    const result = await withTx(async (conn) => {
      const res = await conn.execute(
        `
        BEGIN
          aorts_marketentry_ins(
            :In_UserId,
            :In_Appid,
            :In_AppliNo,
            :In_Mode,
            :In_OldLicencNo,

            :In_ShopName,
            :In_PANNo,
            :In_ContactNo,
            :In_Email,
            :In_Address,

            :In_ZoneId,
            :In_WardId,
            :In_IsProd,
            :In_OwnSpace,
            :In_Agrmentwith,

            :In_Area,
            :In_IsCorpNOC,
            :In_BusStartYr,
            :In_ShopActNo,
            :In_foodlicno,

            :In_LicDays,
            :In_Applitrade_Str,
            :In_Applitradetype_Str,
            :In_Applidirector_Str,
            :In_Source,

            :In_ShopNameMar,
            :In_PlaceOwnerName,
            :In_PlaceOwnerAddress,

            :In_FromDate,
            :In_ToDate,
            :in_amount,
            :in_lictype,
            :In_OrgId,
            :in_ipaddr,
            :in_licensetypeid,
            :in_arreasamt,
            :in_Servid,
            :in_CFCRecno,
            :in_Jwalan,
            :in_Illegal,
            :in_category,
            :in_propno,
            :in_trdbusinesstype,

            :Out_Errorcode,
            :Out_Errormsg,
            :Out_Appid,
            :Out_AppliNo
          );
        END;
        `,
        {
          // ==================================================
          // INPUT PARAMETERS
          // ==================================================

          In_UserId: data.userId,

          In_Appid: data.appid,

          In_AppliNo: data.appliNo,

          In_Mode: data.mode,

          In_OldLicencNo: data.oldLicencNo || null,

          In_ShopName: data.shopName,

          In_PANNo: data.panNo,

          In_ContactNo: data.contactNo,

          In_Email: data.email && data.email.trim() !== "" ? data.email : null,

          In_Address: data.address,

          In_ZoneId: data.zoneId,

          In_WardId: data.wardId,

          In_IsProd: data.isProd,

          In_OwnSpace: data.ownSpace,

          In_Agrmentwith: data.agrmentWith,

          In_Area: data.area,

          In_IsCorpNOC: data.isCorpNOC,

          In_BusStartYr: data.busStartYr,

          In_ShopActNo: data.shopActNo && data.shopActNo.trim() !== "" ? data.shopActNo : null,

          In_foodlicno: data.foodlicno && data.foodlicno.trim() !== "" ? data.foodlicno : null,

          In_LicDays: data.licDays,

          In_Applitrade_Str: data.applitradeStr,

          In_Applitradetype_Str: data.applitradetypeStr,

          In_Applidirector_Str: data.applidirectorStr,

          In_Source: data.source,

          In_ShopNameMar: data.shopNameMar,

          In_PlaceOwnerName: data.placeOwnerName,

          In_PlaceOwnerAddress: data.placeOwnerAddress,

          In_FromDate: fromDate,
          
          In_ToDate: toDate,

          in_amount: data.amount,

          in_lictype: data.licType,

          In_OrgId: data.ulbId,

          in_ipaddr: data.ipAddress,

          in_licensetypeid: data.licenseTypeId,

          in_arreasamt: data.arrearsAmount,

          in_Servid: data.serviceId,

          in_CFCRecno: data.cfcRecno,

          in_Jwalan: data.jwalan,

          in_Illegal: data.illegal,

          in_category: data.category,

          in_propno: data.propNo,

          in_trdbusinesstype: data.trdBusinessType && data.trdBusinessType.trim() !== "" ? data.trdBusinessType : null,

          // ==================================================
          // OUTPUT PARAMETERS
          // ==================================================

          Out_Errorcode: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER,
          },

          Out_Errormsg: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 2000,
          },

          Out_Appid: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER,
          },

          Out_AppliNo: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 2000,
          },
        },
      );

      console.log("applicationEntryRepo:", res);

      return res.outBinds;
    });

    // ========================================================
    // RETURN PROCEDURE RESULT
    // ========================================================

    return {
      success: true,
      errorCode: result.Out_Errorcode,
      errorMsg: result.Out_Errormsg,
      appid: result.Out_Appid,
      appliNo: result.Out_AppliNo,
    };
  } catch (err) {
    console.error("APPLICATION ENTRY REPO ERROR:", err);

    return {
      success: false,
      error: err.message,
    };
  }
};

module.exports = {
  getBusinessPlaceRepo,
  getJalanShilRepo,
  getIllegalTypeRepo,
  getApplicantTypeRepo,
  getWardRepo,
  getLicenseTypeRepo,
  getTradeCategoryRepo,
  getTradeDetailsRepo,
  getDocumentDetailsRepo,
  getSelfDeclareDataRepo,
  getTradeTypeDetailsRepo,
  getApplicationDetailsRepo,
  getApplicationTradeTypeDetailsRepo,
  getApplicationTradeDetailsRepo,
  getApplicationDirectorDetailsRepo,
  getApplicationDocumentDetailsRepo,
  applicationEntryRepo,
};
