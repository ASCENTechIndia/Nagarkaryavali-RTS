const { getConnectionTMC } = require("../../config/db");
const { executeQueryTMC } = require("../../db/queryExecutor");
const { executeProcedureTMC } = require("../../db/procedureExecutor");
const oracledb = require("oracledb");

async function getAppealTypes() {
  const query = `
    SELECT
      var_appealtype_appeal AS appealtype,
      num_appealtype_id AS appealtypeid
    FROM aorts_appealtype_mas
  `;

  console.log("Appeal Types Query:", query);

  return await executeQueryTMC(query);
}

async function getAppealAuthorityDetails(params) {
  const { appNo } = params;

  const query = `
    SELECT
      var_appealauthdetails_authodeg AS authodeg,
      var_appealauthdetails_authadd AS authadd
    FROM aorts_application_det
    INNER JOIN aorts_appealauthdetails_mas
      ON num_appealauthdetails_servid = num_application_serviceid
      AND num_appealauthdetails_deptid = num_application_deptid
      AND num_appealauthdetails_zoneid = num_application_zoneid
    WHERE var_application_appno = :appNo
      AND num_appealauthdetails_appealtype = 1
  `;

  const bindParams = {
    appNo: String(appNo),
  };

  console.log("Appeal Authority Details Query:", query);

  console.log("Bind Params:", bindParams);

  return await executeQueryTMC(query, bindParams);
}

async function getApplicationDetails(appNo) {
  const query = `
    SELECT
      dat_application_insdate AS insdate,
      var_service_eng_name AS servicename,
      num_service_serviceid AS serviceid
    FROM aorts_application_det
    INNER JOIN aorts_tmcservice_def
      ON num_service_serviceid = num_application_serviceid
    WHERE var_application_appno = :appNo
  `;

  const bindParams = {
    appNo: String(appNo),
  };

  console.log("Application Details Query:", query);

  console.log("Bind Params:", bindParams);

  return await executeQueryTMC(query, bindParams);
}

async function insertAppealDocument(params) {
  let connection;

  try {
    const {
      corpId,
      serviceId,
      appNo,
      appealNo,
      docType,
      documentId,
      appealTypeId,
      docBuffer,
    } = params;

    connection = await getConnectionTMC();

    const buffer =
      docBuffer && docBuffer.length > 0
        ? Buffer.from(docBuffer)
        : Buffer.alloc(1);

    const query = `
      INSERT INTO aorts_appealDoc_det (
        num_appealDoc_corpid,
        num_appealDoc_serviceid,
        var_appealDoc_appno,
        var_appealDoc_appealno,
        var_appealDoc_doctype,
        num_appealDoc_documentid,
        blob_appealDoc_documentimg,
        num_appealDoc_appealtypeid
      )
      VALUES (
        :corpId,
        :serviceId,
        :appNo,
        :appealNo,
        :docType,
        :documentId,
        :docBuffer,
        :appealTypeId
      )
    `;

    const bindParams = {
      corpId: Number(corpId),

      serviceId: Number(serviceId),

      appNo: String(appNo),

      appealNo: String(appealNo),

      docType: String(docType),

      documentId: Number(documentId),

      docBuffer: {
        val: buffer,
        type: oracledb.BUFFER,
        dir: oracledb.BIND_IN,
        maxSize: buffer.length,
      },

      appealTypeId: Number(appealTypeId),
    };

    console.log("Insert Appeal Document Query:", query);

    console.log("Document Details:", {
      corpId,
      serviceId,
      appNo,
      appealNo,
      docType,
      documentId,
      appealTypeId,
      size: buffer.length,
    });

    const result = await connection.execute(query, bindParams, {
      autoCommit: true,
    });

    console.log("Appeal Document Insert Result:", result);

    return {
      success: true,
      rowsAffected: result.rowsAffected,
    };
  } catch (error) {
    console.error("insertAppealDocument Error:", error);

    return {
      success: false,
      error: error.message,
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

async function insertAppeal(params) {
  const {
    appUserId,
    ulbId,
    app1stAppAuthDesi,
    app1stAppAuthOffAdd,
    nameEligPerson,
    addEligPerson,
    nameDesiOfficer,
    addDesiOfficer,
    appealType,
    appNo,
    dtAProduceBefDesiOffiProvisRvi,
    dtAcknowegmt,
    dtProdDoc,
    detPubServiceReq,
    descIsionDesiOffi,
    stipTimeLimit,
    dtIntiRejAppliRecieEligPer,
    reliefSought,
    firstOtherInfo,
    name1stAppealAuth,
    add1stAppealAuth,
    appealNo,
    dtAppliDesiOffi,
    desi1stAppealAuth,
    dt1stAppeal,
    dtReciOrder1stAppealAuth,
    secondOtherInfo,
    hearingDt,
    refAppealType,
    mode,
  } = params;

  const sql = `
    BEGIN
      aorts_Appeal_ins(
        :In_app_UserId,
        :In_App_ULBid,
        :in_app_1stappauthdesi,
        :in_app_1stappauthoffadd,
        :in_app_Nameeligperson,
        :in_app_Addeligperson,
        :in_app_Namedesiofficer,
        :in_app_Adddesiofficer,
        :in_app_Appealtyp,
        :in_app_Applino,
        :in_app_dtAproducebefdesioffiprovisrvi,
        :in_app_dtacknowegmt,
        :in_app_dtproddoc,
        :in_app_detpubservicereq,
        :in_app_descisondesioffi,
        :in_app_stiptimelimit,
        :in_app_dtintirejapplirecieligiper,
        :in_app_reliefsougth,
        :in_app_1stotherinfo,
        :in_app_name1stappealauth,
        :in_app_add1stappealauth,
        :in_app_Appealno,
        :in_app_dtapplidesioffi,
        :in_app_desi1stappealauth,
        :in_app_dt1stAppeal,
        :in_app_dtreciorder1stappealauth,
        :in_app_2ndotherinfo,
        :in_app_HearingDt,
        :in_app_RefAppealtyp,
        :in_mode,
        :out_errcode,
        :out_ErrMsg,
        :out_appeal
      );
    END;
  `;

  const binds = {
    In_app_UserId: appUserId ? String(appUserId) : null,
    In_App_ULBid: ulbId ? Number(ulbId) : null,
    in_app_1stappauthdesi: app1stAppAuthDesi || null,
    in_app_1stappauthoffadd: app1stAppAuthOffAdd || null,
    in_app_Nameeligperson: nameEligPerson || null,
    in_app_Addeligperson: addEligPerson || null,
    in_app_Namedesiofficer: nameDesiOfficer || null,
    in_app_Adddesiofficer: addDesiOfficer || null,
    in_app_Appealtyp: appealType ? Number(appealType) : null,
    in_app_Applino: appNo || null,
    in_app_dtAproducebefdesioffiprovisrvi: dtAProduceBefDesiOffiProvisRvi
      ? new Date(dtAProduceBefDesiOffiProvisRvi)
      : null,
    in_app_dtacknowegmt: dtAcknowegmt ? new Date(dtAcknowegmt) : null,
    in_app_dtproddoc: dtProdDoc ? new Date(dtProdDoc) : null,
    in_app_detpubservicereq: detPubServiceReq || null,
    in_app_descisondesioffi: descIsionDesiOffi || null,
    in_app_stiptimelimit: stipTimeLimit || null,
    in_app_dtintirejapplirecieligiper: dtIntiRejAppliRecieEligPer
      ? new Date(dtIntiRejAppliRecieEligPer)
      : null,
    in_app_reliefsougth: reliefSought || null,
    in_app_1stotherinfo: firstOtherInfo || null,
    in_app_name1stappealauth: name1stAppealAuth || null,
    in_app_add1stappealauth: add1stAppealAuth || null,
    in_app_Appealno: appealNo || null,
    in_app_dtapplidesioffi: dtAppliDesiOffi ? new Date(dtAppliDesiOffi) : null,
    in_app_desi1stappealauth: desi1stAppealAuth || null,
    in_app_dt1stAppeal: dt1stAppeal ? new Date(dt1stAppeal) : null,
    in_app_dtreciorder1stappealauth: dtReciOrder1stAppealAuth
      ? new Date(dtReciOrder1stAppealAuth)
      : null,
    in_app_2ndotherinfo: secondOtherInfo || null,
    in_app_HearingDt: hearingDt ? new Date(hearingDt) : null,
    in_app_RefAppealtyp: refAppealType ? Number(refAppealType) : null,
    in_mode: mode ? Number(mode) : null,
    out_errcode: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
    out_ErrMsg: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 500,
    },
    out_appeal: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 100,
    },
  };

  console.log("Insert Appeal Procedure");
  console.log("Procedure:", "aorts_Appeal_ins");

  console.log("Input Params:", {
    appUserId,
    ulbId,
    appealType,
    appNo,
    appealNo,
    mode,
  });

  const result = await executeProcedureTMC({
    sql,
    binds,
  });

  if (!result.success) {
    console.error("aorts_Appeal_ins Error:", result.error);

    return {
      success: false,
      error: result.error,
    };
  }

  console.log("aorts_Appeal_ins Result:", result.outBinds);

  return {
    success: true,
    ...result.outBinds,
  };
}

module.exports = {
  getAppealTypes,
  getAppealAuthorityDetails,
  getApplicationDetails,
  insertAppealDocument,
  insertAppeal,
};
