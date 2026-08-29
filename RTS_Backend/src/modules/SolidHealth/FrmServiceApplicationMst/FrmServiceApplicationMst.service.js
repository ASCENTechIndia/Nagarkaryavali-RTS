const repo = require("./FrmServiceApplicationMst.repo");

// ============================================================
// GET WARD LIST
// ============================================================
const getWardListService = async (ulbId) => {
  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  const result = await repo.getWardListRepo(ulbId);

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch ward list.");
  }

  return {
    status: "SUCCESS",
    data: result.rows,
  };
};

// ============================================================
// GET SECTOR LIST
// ============================================================
const getSectorListService = async (serviceId) => {
  if (!serviceId) {
    throw new Error("Service ID is required.");
  }

  // .NET condition:
  // if ServiceId is 62 or 60
  if (!["60", "62"].includes(String(serviceId))) {
    return {
      status: "SUCCESS",
      data: [],
    };
  }

  const result = await repo.getSectorListRepo();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch sector list.");
  }

  return {
    status: "SUCCESS",
    data: result.rows,
  };
};

// ============================================================
// GET DOCUMENT LIST
// ============================================================
const getDocumentListService = async (serviceId, ulbId) => {
  if (!serviceId) {
    throw new Error("Service ID is required.");
  }

  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  const result = await repo.getDocumentListRepo(serviceId, ulbId);

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch document list.");
  }

  return {
    status: "SUCCESS",
    data: result.rows,
  };
};

const saveServiceApplicationService = async (data) => {
  const result = await repo.insertServiceApplicationRepo(data);

  if (result.errCode !== 9999) {
    return {
      success: false,
      message: result.errMsg || "Application insertion failed.",
      errCode: result.errCode,
    };
  }

  return {
    success: true,
    message: result.errMsg,
    applicationNo: result.applicationNo,
    errCode: result.errCode,
  };
};

// ============================================================
// SAVE DOCUMENT
// ============================================================
const uploadServiceDocumentsService = async ({ corpid, serviceId, appNo, documents }) => {
  if (!corpid) {
    throw new Error("ULB ID is required.");
  }

  if (!serviceId) {
    throw new Error("Service ID is required.");
  }

  if (!appNo) {
    throw new Error("Application No is required.");
  }

  if (!documents || documents.length === 0) {
    throw new Error("Please upload at least one document.");
  }

  for (const document of documents) {
    if (!document.documentId) {
      throw new Error("Document ID is required.");
    }

    if (!document.docType) {
      throw new Error(`Document Type is required for Document ID ${document.documentId}`);
    }

    if (!document.buffer || document.buffer.length === 0) {
      throw new Error(`Uploaded file is empty for Document ID ${document.documentId}`);
    }
  }

  const result = await repo.uploadServiceDocumentsRepo({
    corpid,
    serviceId,
    appNo,
    documents,
  });

  if (!result || result.status !== "SUCCESS") {
    throw new Error(result?.message || "Document upload failed.");
  }

  return result;
};

// ============================================================
// GET VILLAGE LIST BY SECTOR
// ============================================================
const getVillageListService = async (sectorId) => {
  if (!sectorId) {
    throw new Error("Sector ID is required.");
  }

  const result = await repo.getVillageListRepo(sectorId);

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch village list.");
  }

  return {
    status: "SUCCESS",
    message: "Village list fetched successfully.",
    data: result.rows,
  };
};


module.exports = {
  getWardListService,
  getSectorListService,
  getDocumentListService,
  saveServiceApplicationService,
  uploadServiceDocumentsService,
  getVillageListService,
};
