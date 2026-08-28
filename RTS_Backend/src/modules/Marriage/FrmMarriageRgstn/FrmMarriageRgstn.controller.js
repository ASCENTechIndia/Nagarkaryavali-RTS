const asyncHandler = require("../../../libs/asyncHandler");
const { ok, fail } = require("../../../libs/response");
const service = require("./FrmMarriageRgstn.service");

exports.getZones = asyncHandler(async (req, res) => {
  const { ulbId } = req.body;

  if (!ulbId) {
    return fail(res, "ULB ID is required");
  }

  const result = await service.getZonesService(ulbId);
  return ok(res, result, "Zones fetched successfully");
});

exports.getPreviousStatus = asyncHandler(async (req, res) => {
  const result = await service.getPreviousStatusService();
  return ok(res, result, "Previous status list fetched successfully");
});

exports.getReligionList = asyncHandler(async (req, res) => {
  const result = await service.getReligionListService();
  return ok(res, result, "Religion list fetched successfully");
});

exports.getIDDocuments = asyncHandler(async (req, res) => {
  const result = await service.getIDDocumentsService();
  return ok(res, result, "ID Documents fetched successfully");
});

exports.getAddressDocuments = asyncHandler(async (req, res) => {
  const result = await service.getAddressDocumentsService();
  return ok(res, result, "Address Documents fetched successfully");
});

exports.getAgeDocuments = asyncHandler(async (req, res) => {
  const result = await service.getAgeDocumentsService();
  return ok(res, result, "Age Documents fetched successfully");
});

exports.getRelations = asyncHandler(async (req, res) => {
  const result = await service.getRelationsService();
  return ok(res, result, "Relations fetched successfully");
});

exports.getDocumentDefinitions = asyncHandler(async (req, res) => {
  const { corpId, serviceId, ulbId } = req.body;

  if (!corpId) {
    return fail(res, "Corp ID is required");
  }
  if (!serviceId) {
    return fail(res, "Service ID is required");
  }
  if (!ulbId) {
    return fail(res, "ULB ID is required");
  }

  const result = await service.getDocumentDefinitionsService({
    corpId,
    serviceId,
    ulbId,
  });

  return ok(res, result, "Document definitions fetched successfully");
});

exports.calculateAge = asyncHandler(async (req, res) => {
  const { marriageDate, birthDate } = req.body;

  if (!marriageDate) {
    return fail(res, "Marriage Date is required");
  }
  if (!birthDate) {
    return fail(res, "Birth Date is required");
  }

  const result = await service.calculateAgeService({
    marriageDate,
    birthDate,
  });

  return ok(res, result, "Age calculated successfully");
});

exports.submitApplication = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.body.userId;
  const ulbId = req.user?.ulbId || req.body.ulbId;
  const corpId = req.user?.corpId || req.body.corpId;
  const serviceId = req.body.serviceId;

  if (!ulbId) {
    return fail(res, "ULB ID is required");
  }
  if (!userId) {
    return fail(res, "User ID is required");
  }
  if (!corpId) {
    return fail(res, "Corp ID is required");
  }
  if (!serviceId) {
    return fail(res, "Service ID is required");
  }

  // Extract documents from request
  const gridDocuments = req.body.gridDocuments || [];
  const husIdDoc = req.body.husIdDoc ? Buffer.from(req.body.husIdDoc, 'base64') : null;
  const husAddDoc = req.body.husAddDoc ? Buffer.from(req.body.husAddDoc, 'base64') : null;
  const husAgeDoc = req.body.husAgeDoc ? Buffer.from(req.body.husAgeDoc, 'base64') : null;
  const wifeIdDoc = req.body.wifeIdDoc ? Buffer.from(req.body.wifeIdDoc, 'base64') : null;
  const wifeAddDoc = req.body.wifeAddDoc ? Buffer.from(req.body.wifeAddDoc, 'base64') : null;
  const wifeAgeDoc = req.body.wifeAgeDoc ? Buffer.from(req.body.wifeAgeDoc, 'base64') : null;

  // Images
  const husPhoto = req.body.husPhoto ? Buffer.from(req.body.husPhoto, 'base64') : null;
  const husThumb = req.body.husThumb ? Buffer.from(req.body.husThumb, 'base64') : null;
  const wifePhoto = req.body.wifePhoto ? Buffer.from(req.body.wifePhoto, 'base64') : null;
  const wifeThumb = req.body.wifeThumb ? Buffer.from(req.body.wifeThumb, 'base64') : null;
  const wit1Photo = req.body.wit1Photo ? Buffer.from(req.body.wit1Photo, 'base64') : null;
  const wit1Thumb = req.body.wit1Thumb ? Buffer.from(req.body.wit1Thumb, 'base64') : null;
  const wit2Photo = req.body.wit2Photo ? Buffer.from(req.body.wit2Photo, 'base64') : null;
  const wit2Thumb = req.body.wit2Thumb ? Buffer.from(req.body.wit2Thumb, 'base64') : null;
  const wit3Photo = req.body.wit3Photo ? Buffer.from(req.body.wit3Photo, 'base64') : null;
  const wit3Thumb = req.body.wit3Thumb ? Buffer.from(req.body.wit3Thumb, 'base64') : null;

  // Process grid documents
  const processedGridDocs = gridDocuments.map(doc => {
    let buffer = null;
    if (doc.fileBuffer) {
      if (Buffer.isBuffer(doc.fileBuffer)) {
        buffer = doc.fileBuffer;
      } else if (typeof doc.fileBuffer === 'string') {
        if (doc.fileBuffer.startsWith('data:')) {
          const base64Data = doc.fileBuffer.split(',')[1];
          buffer = Buffer.from(base64Data, 'base64');
        } else {
          buffer = Buffer.from(doc.fileBuffer, 'base64');
        }
      }
    }
    return {
      ...doc,
      fileBuffer: buffer,
    };
  });

  const payload = {
    ulbId,
    userId,
    corpId,
    serviceId,
    zoneId: req.body.zoneId,
    appliFname: req.body.appliFname,
    appliMname: req.body.appliMname,
    appliLname: req.body.appliLname,
    appliMobile: req.body.appliMobile,
    appliAddre: req.body.appliAddre,
    regDate: req.body.regDate,
    mrrgDate: req.body.mrrgDate,
    placeEng: req.body.placeEng,
    placeMar: req.body.placeMar,
    documentIds: req.body.documentIds || [],
    deliveryFlag: req.body.deliveryFlag || null,
    appSource: req.body.appSource || "WEB",
    hefname: req.body.hefname,
    hemname: req.body.hemname,
    helname: req.body.helname,
    hmfname: req.body.hmfname,
    hmmname: req.body.hmmname,
    hmlname: req.body.hmlname,
    headdress: req.body.headdress,
    hmaddress: req.body.hmaddress,
    hMobile: req.body.hMobile,
    hmstatus: req.body.hmstatus,
    hphysichall: req.body.hphysichall || 0,
    hbirthdt: req.body.hbirthdt,
    hbirthreligion: req.body.hbirthreligion,
    hadopreligion: req.body.hadopreligion,
    hemail: req.body.hemail || null,
    hiddoc: req.body.hiddoc,
    haddresdoc: req.body.haddresdoc,
    hagedoc: req.body.hagedoc,
    haadharno: req.body.haadharno,
    wefname: req.body.wefname,
    wemname: req.body.wemname,
    welname: req.body.welname,
    wmfname: req.body.wmfname,
    wmmname: req.body.wmmname,
    wmlname: req.body.wmlname,
    weaddress: req.body.weaddress,
    wmaddress: req.body.wmaddress,
    wMobile: req.body.wMobile,
    wmstatus: req.body.wmstatus,
    wphysichall: req.body.wphysichall || 0,
    wbirthdt: req.body.wbirthdt,
    wbirthreligion: req.body.wbirthreligion,
    wadopreligion: req.body.wadopreligion,
    wemail: req.body.wemail || null,
    widdoc: req.body.widdoc,
    waddresdoc: req.body.waddresdoc,
    wagedoc: req.body.wagedoc,
    waadharno: req.body.waadharno || null,
    w1efname: req.body.w1efname,
    w1emname: req.body.w1emname,
    w1elname: req.body.w1elname,
    w1mfname: req.body.w1mfname,
    w1mmname: req.body.w1mmname,
    w1mlname: req.body.w1mlname,
    w1docid: req.body.w1docid,
    w1relationid: req.body.w1relationid,
    w1mobileno: req.body.w1mobileno,
    w1eaddre: req.body.w1eaddre,
    w1maddre: req.body.w1maddre,
    w1birthdt: req.body.w1birthdt,
    w2efname: req.body.w2efname,
    w2emname: req.body.w2emname,
    w2elname: req.body.w2elname,
    w2mfname: req.body.w2mfname,
    w2mmname: req.body.w2mmname,
    w2mlname: req.body.w2mlname,
    w2docid: req.body.w2docid,
    w2relationid: req.body.w2relationid,
    w2mobileno: req.body.w2mobileno,
    w2eaddre: req.body.w2eaddre,
    w2maddre: req.body.w2maddre,
    w2birthdt: req.body.w2birthdt,
    w3efname: req.body.w3efname,
    w3emname: req.body.w3emname,
    w3elname: req.body.w3elname,
    w3mfname: req.body.w3mfname,
    w3mmname: req.body.w3mmname,
    w3mlname: req.body.w3mlname,
    w3docid: req.body.w3docid,
    w3relationid: req.body.w3relationid,
    w3mobileno: req.body.w3mobileno,
    w3eaddre: req.body.w3eaddre,
    w3maddre: req.body.w3maddre,
    w3birthdt: req.body.w3birthdt,
    prefname: req.body.prefname,
    premname: req.body.premname,
    prelname: req.body.prelname,
    prmfname: req.body.prmfname,
    prmmname: req.body.prmmname,
    prmlname: req.body.prmlname,
    prage: req.body.prage,
    prreligion: req.body.prreligion,
    preaddress: req.body.preaddress,
    prmaddress: req.body.prmaddress,
    husPhoto,
    husThumb,
    wifePhoto,
    wifeThumb,
    wit1Photo,
    wit1Thumb,
    wit2Photo,
    wit2Thumb,
    wit3Photo,
    wit3Thumb,
    husIdDoc,
    husAddDoc,
    husAgeDoc,
    wifeIdDoc,
    wifeAddDoc,
    wifeAgeDoc,
    gridDocuments: processedGridDocs,
  };

  const result = await service.submitMarriageRegistrationService(payload);

  if (!result.success) {
    return fail(res, result.message || "Application submission failed");
  }

  return ok(res, result, result.message || "Application submitted successfully");
});

exports.getMarriageData = asyncHandler(async (req, res) => {
  const { applicationNo } = req.body;

  if (!applicationNo) {
    return fail(res, "Application Number is required");
  }

  const result = await service.getMarriageDataService(applicationNo);
  return ok(res, result, "Marriage data fetched successfully");
});

exports.getServicePaymentFlag = asyncHandler(async (req, res) => {
  const { serviceId } = req.body;

  if (!serviceId) {
    return fail(res, "Service ID is required");
  }

  const result = await service.getServicePaymentFlagService(serviceId);
  return ok(res, result, "Service payment flag fetched successfully");
});

exports.checkPayment = asyncHandler(async (req, res) => {
  const { serviceId, applicationNo, message } = req.body;

  if (!serviceId) {
    return fail(res, "Service ID is required");
  }

  const result = await service.getServicePaymentFlagService(serviceId);

  let payFlag = "N";
  if (result.success && result.rows.length > 0) {
    payFlag = result.rows[0].VAR_SERVICE_PAYFLAG || "N";
  }

  return ok(
    res,
    {
      payFlag,
      redirectTo: payFlag === "N" ? "FrmMarriageRgstn.aspx" : "FrmAppliFee.aspx",
      message: message || "Application processed successfully",
      applicationNo,
    },
    "Payment check completed"
  );
});

exports.uploadHusbandImages = asyncHandler(async (req, res) => {
  const { mrrgdtlidId, mrrgid } = req.body;
  const photoFile = req.files?.photo?.[0]?.buffer;
  const thumbFile = req.files?.thumb?.[0]?.buffer;

  const result = await service.uploadHusbandImagesService({
    mrrgdtlidId,
    mrrgid,
    photoFile,
    thumbFile,
  });

  return ok(res, result, result.message);
});

exports.uploadWifeImages = asyncHandler(async (req, res) => {
  const { mrrgdtlidId, mrrgid } = req.body;
  const photoFile = req.files?.photo?.[0]?.buffer;
  const thumbFile = req.files?.thumb?.[0]?.buffer;

  const result = await service.uploadWifeImagesService({
    mrrgdtlidId,
    mrrgid,
    photoFile,
    thumbFile,
  });

  return ok(res, result, result.message);
});

exports.uploadWitnessImages = asyncHandler(async (req, res) => {
  const { mrrgdtlidId, mrrgid, witnessNumber } = req.body;
  const photoFile = req.files?.photo?.[0]?.buffer;
  const thumbFile = req.files?.thumb?.[0]?.buffer;

  const result = await service.uploadWitnessImagesService({
    mrrgdtlidId,
    mrrgid,
    witnessNumber,
    photoFile,
    thumbFile,
  });

  return ok(res, result, result.message);
});

exports.uploadBeforeMarriageDoc = asyncHandler(async (req, res) => {
  const { mrrgdtlid, mrrgdocid, flag, mrrgdocflag, userId, ulbId } = req.body;
  const fileBuffer = req.file?.buffer;

  const result = await service.uploadBeforeMarriageDocService({
    mrrgdtlid,
    mrrgdocid,
    mrrgdoc: fileBuffer,
    flag,
    user: userId,
    ulbid: ulbId,
    mrrgdocflag,
  });

  return ok(res, result, result.message);
});

exports.uploadGridDocument = asyncHandler(async (req, res) => {
  const { corpId, serviceId, appNo, docType, documentId } = req.body;
  const fileBuffer = req.file?.buffer;

  const result = await service.uploadGridDocumentService({
    corpId,
    serviceId,
    appNo,
    docType: docType || "S",
    documentId,
    fileBuffer,
  });

  return ok(res, result, result.message);
});