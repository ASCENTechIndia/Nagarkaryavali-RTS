const repo = require("./FrmBusinessTypeListMst.repo");

async function getBusinessTypeByIdService(bustypId) {
  if (!bustypId) throw new Error("Business Type ID is required", 400);

  const rows = await repo.fetchBusinessTypeById(bustypId);

  return {
    success: true,
    businessType: rows.map(r => ({
      id: r.NUM_BUSTYP_ID,
      name: r.VAR_BUSTYP_NAME
    }))
  };
}

async function getAllBusinessTypesService(ulbid) {

  if (!ulbid) throw new Error("ULB ID is required", 400);
  const rows = await repo.fetchAllBusinessTypes(ulbid);

  return {
    success: true,
    businessTypes: rows.map(r => ({
      id: r.NUM_BUSTYP_ID,
      name: r.VAR_BUSTYP_NAME
    }))
  };
}


async function manageBusinessTypeService(payload) {
  const outBinds = await repo.executeBusinessTypeProcedure(payload);

  return {
    success: Number(outBinds.OUT_ERRCODE) === 9999 || Number(outBinds.OUT_ERRCODE) === -100,
    errorCode: outBinds.OUT_ERRCODE,
    message: outBinds.OUT_ERRMSG
  };
}

module.exports = { getBusinessTypeByIdService, getAllBusinessTypesService, manageBusinessTypeService };
