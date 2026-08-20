const repo = require("./FrmAssessmentCerti.repo");
const { AppError } = require("../../../libs/errors");

async function getDocumentDefinitionsService(params) {
  const { serviceId, ulbId } = params;

  if (!serviceId) {
    throw new AppError("Service ID is required", 400);
  }

  if (!ulbId) {
    throw new AppError("ULB ID is required", 400);
  }

  const result = await repo.getDocumentDefinitions({ serviceId, ulbId });

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function getServicePaymentFlagService(serviceId) {
  if (!serviceId) {
    throw new AppError("Service ID is required", 400);
  }

  const result = await repo.getServicePaymentFlag(serviceId);

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function getMahaServiceIdService(params) {
  const { serviceId, mahaUlbId } = params;

  if (!serviceId) {
    throw new AppError("Service ID is required", 400);
  }

  if (!mahaUlbId) {
    throw new AppError("Maha ULB ID is required", 400);
  }

  const result = await repo.getMahaServiceId({ serviceId, mahaUlbId });

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  if (result.rows.length === 0) {
    return {
      success: false,
      message: "Maha Service ID not found",
      data: null,
    };
  }

  const row = result.rows[0];

  return {
    success: true,
    data: {
      maxDays: row.MAXDAYS || 0,
      mahaServiceId: row.SERVICE_MAHAID || "",
    },
  };
}

async function uploadDocumentService(params) {
  const { corpId, serviceId, appNo, docType, documentId, fileBuffer } = params;

  if (!serviceId) {
    throw new AppError("Service ID is required", 400);
  }

  if (!appNo) {
    throw new AppError("Application Number is required", 400);
  }

  if (!docType) {
    throw new AppError("Document Type is required", 400);
  }

  if (!documentId) {
    throw new AppError("Document ID is required", 400);
  }

  if (!fileBuffer || fileBuffer.length === 0) {
    throw new AppError("Document file is required", 400);
  }

  if (fileBuffer.length > 5 * 1024 * 1024) {
    throw new AppError("Document size should be less than 5MB", 400);
  }

  const result = await repo.insertDocument({
    corpId: corpId || 10001,
    serviceId,
    appNo,
    docType,
    documentId,
    docBuffer: fileBuffer,
  });

  if (!result.success) {
    throw new AppError(result.error || "Document upload failed", 500);
  }

  return {
    success: true,
    message: "Document uploaded successfully",
  };
}

async function submitAssessmentApplicationService(payload) {
  const {
    userId,
    zoneId,
    serviceId,
    propNo,
    subCode,
    landHolder,
    structHolder,
    ownDetails,
    address,
    flatNo,
    structure,
    usageType,
    constType,
    area,
    lettingRate,
    rate,
    yearTax,
    assessmentYear,
    applicantName,
    mobile,
    email,
    appSource,
    documents,
    mahaData,
  } = payload;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!zoneId) {
    throw new AppError("Zone ID is required", 400);
  }

  if (!serviceId) {
    throw new AppError("Service ID is required", 400);
  }

  if (!propNo) {
    throw new AppError("Property Number is required", 400);
  }

  if (!applicantName) {
    throw new AppError("Applicant Name is required", 400);
  }

  if (!mobile) {
    throw new AppError("Mobile Number is required", 400);
  }

  if (String(mobile).length !== 10) {
    throw new AppError("Mobile Number must be 10 digits", 400);
  }

  if (!email) {
    throw new AppError("Email ID is required", 400);
  }

  const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Invalid Email Address", 400);
  }

  const appResult = await repo.insertAssessmentApplication({
    userId,
    zoneId,
    serviceId,
    propNo,
    subCode,
    landHolder: landHolder || "",
    structHolder: structHolder || "",
    ownDetails: ownDetails || "",
    address: address || "",
    flatNo: flatNo || "",
    structure: structure || "",
    usageType: usageType || "",
    constType: constType || "",
    area: area || 0,
    lettingRate: lettingRate || 0,
    rate: rate || 0,
    yearTax: yearTax || 0,
    assessmentYear: assessmentYear || "",
    applicantName,
    mobile,
    email,
    appSource: appSource || "WEB",
  });

  if (Number(appResult.out_errcode) !== 9999) {
    return {
      success: false,
      errorCode: appResult.out_errcode,
      message: appResult.out_errmsg,
    };
  }

  const applicationNo = appResult.out_applino;

  if (documents && documents.length > 0) {
    for (const doc of documents) {
      if (doc.fileBuffer && doc.fileBuffer.length > 0) {
        try {
          let buffer;
          if (Buffer.isBuffer(doc.fileBuffer)) {
            buffer = doc.fileBuffer;
          } else if (doc.fileBuffer instanceof ArrayBuffer) {
            buffer = Buffer.from(new Uint8Array(doc.fileBuffer));
          } else if (typeof doc.fileBuffer === 'string') {
            if (doc.fileBuffer.startsWith('data:')) {
              const base64Data = doc.fileBuffer.split(',')[1];
              buffer = Buffer.from(base64Data, 'base64');
            } else {
              buffer = Buffer.from(doc.fileBuffer, 'base64');
            }
          } else {
            buffer = Buffer.from(doc.fileBuffer);
          }

          await repo.insertDocument({
            corpId: 10001,
            serviceId: Number(serviceId),
            appNo: applicationNo,
            docType: doc.docType || "PDF",
            documentId: Number(doc.docId || 0),
            docBuffer: buffer,
          });
          
          console.log("Document uploaded successfully:", doc.docName);
        } catch (error) {
          console.error("Document Insert Error:", error);
          throw new AppError(`Failed to upload document: ${doc.docName}`, 500);
        }
      }
    }
  }

  if (mahaData && mahaData.mahaUlbId) {
    await insertMahaOnlineFirstStepService({
      mahaData,
      applicationNo,
      serviceId,
    });
  }

  const paymentFlagResult = await repo.getServicePaymentFlag(serviceId);

  let payFlag = "N";
  if (paymentFlagResult.success && paymentFlagResult.rows.length > 0) {
    payFlag = paymentFlagResult.rows[0].VAR_SERVICE_PAYFLAG || "N";
  }

  const parts = appResult.out_errMsg.split("$");
  const message = parts[0] || "Application submitted successfully";

  return {
    success: true,
    errorCode: appResult.out_errcode,
    message: message,
    applicationNo: applicationNo,
    payFlag: payFlag,
    redirectTo: payFlag === "N" ? "FrmAssessmentCerti.aspx" : "FrmAppliFee.aspx",
  };
}

async function insertMahaOnlineFirstStepService(params) {
  const { mahaData, applicationNo, serviceId } = params;

  try {
    await repo.insertMahaOnlineData({
      ulbId: mahaData.ulbId,
      requestString: "",
      responseString: "",
      trackId: mahaData.trackId || "0",
      applicationId: applicationNo,
      serviceId: Number(serviceId),
      methodName: "SetAppStatus",
      encryptedFinalString: "",
      mahaUlbId: mahaData.mahaUlbId,
      districtId: mahaData.districtId || 0,
    });

    await repo.insertMahaOnlineData({
      ulbId: mahaData.ulbId,
      requestString: "",
      responseString: "",
      trackId: mahaData.trackId || "0",
      applicationId: applicationNo,
      serviceId: Number(serviceId),
      methodName: "SetAppStatus",
      encryptedFinalString: "",
      mahaUlbId: mahaData.mahaUlbId,
      districtId: mahaData.districtId || 0,
    });

    const paymentFlagResult = await repo.getServicePaymentFlag(serviceId);
    let payFlag = "N";
    if (paymentFlagResult.success && paymentFlagResult.rows.length > 0) {
      payFlag = paymentFlagResult.rows[0].VAR_SERVICE_PAYFLAG || "N";
    }

    if (payFlag === "N") {
      await repo.insertMahaOnlineData({
        ulbId: mahaData.ulbId,
        requestString: "",
        responseString: "",
        trackId: mahaData.trackId || "0",
        applicationId: applicationNo,
        serviceId: Number(serviceId),
        methodName: "SetAppStatus",
        encryptedFinalString: "",
        mahaUlbId: mahaData.mahaUlbId,
        districtId: mahaData.districtId || 0,
      });
    }

    console.log("Maha Online Integration completed for:", applicationNo);
  } catch (error) {
    console.error("Maha Online Integration Error:", error);
  }
}

module.exports = {
  getDocumentDefinitionsService,
  getServicePaymentFlagService,
  getMahaServiceIdService,
  uploadDocumentService,
  submitAssessmentApplicationService,
  insertMahaOnlineFirstStepService,
};