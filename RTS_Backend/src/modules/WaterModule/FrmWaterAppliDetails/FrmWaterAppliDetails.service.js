const repo = require("./FrmWaterAppliDetails.repo");

const getWardListService = async (payload) => {
  console.log("Service: Fetch Water Ward List", payload);
  const data = await repo.getWardListRepo(payload);

  if (!data || data.length === 0) {
    return { success: false, message: "No data Found", data: [] };
  }

  return { success: true, count: data.length, data };
};

const getDocumentListService = async (payload) => {
  console.log("Service: Fetch Water Document List", payload);

  const data = await repo.getDocumentListRepo(payload);

  if (!data || data.length === 0) {
    return { success: false, message: "No data Found", data: [], };
  }

  return { success: true, count: data.length, data };
};

const getWaterApplicationDetailsService = async (payload) => {
  console.log("Service: Fetch Water Application Details", payload);
  const data = await repo.getWaterApplicationDetailsRepo(payload);

  if (!data || data.length === 0) {
    return { success: false, message: "No application details found", data: [] };
  }

  return { success: true, count: data.length, data };
};

const getWaterApplicationDocumentsService = async (payload) => {
  console.log("Service: Fetch Water Application Documents", payload);
  const data = await repo.getWaterApplicationDocumentsRepo(payload);

  if (!data || data.length === 0) {
    return { success: false, message: "No application documents found", data: [] };
  }

  return { success: true, count: data.length, data };
};

const saveWaterApplicationService = async (payload) => {
  console.log("Service: Save Water Application", payload);
  const result = await repo.saveWaterApplicationRepo(payload);

  const errorCode = Number(result.out_errcode);

  if (errorCode !== 9999) {
    return {
      success: false,
      errorCode,
      message: result.out_ErrMsg || "Unable to save water application",
      applicationNo: result.out_AppliNo || null,
      outDocStr: result.Out_DocStr || null,
    };
  }

  return {
    success: true,
    errorCode,
    message: result.out_ErrMsg || "Water application saved successfully",
    applicationNo: result.out_AppliNo || null,
    outDocStr: result.Out_DocStr || null,
  };
};

const uploadWaterApplicationDocumentService = async (payload) => {
  console.log("Service: Upload Water Application Document");
  const result = await repo.uploadWaterApplicationDocumentRepo(payload);

  if (!result.success) {
    return { success: false, message: "Unable to upload application document" };
  }

  return { success: true, rowsAffected: result.rowsAffected, message: "Application document uploaded successfully" };
};

module.exports = {
  getWardListService,
  getDocumentListService,
  getWaterApplicationDetailsService,
  getWaterApplicationDocumentsService,
  saveWaterApplicationService,
  uploadWaterApplicationDocumentService,
};