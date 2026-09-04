const repo = require("./frmDocList.repo");

const getServiceDocumentCountService = async () => {
  return await repo.getServiceDocumentCountRepo();
};



const getAllServicesService = async () => {
  return await repo.getAllServicesRepo();
};



const getDocumentsByServiceService = async (
  serviceId
) => {
  if (!serviceId) {
    throw new Error("Service ID is required.");
  }

  return await repo.getDocumentsByServiceRepo(
    serviceId
  );
};


const getActiveServicesService = async () => {
  return await repo.getActiveServicesRepo();
};


const getServiceDocumentsService = async (
  serviceId
) => {
  if (!serviceId) {
    throw new Error("Service ID is required.");
  }

  return await repo.getServiceDocumentsRepo(
    serviceId
  );
};


const getServiceDocumentConfigService = async ({
  ulbId,
  serviceId,
}) => {
  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  if (!serviceId) {
    throw new Error("Service ID is required.");
  }

  return await repo.getServiceDocumentConfigRepo({
    ulbId,
    serviceId,
  });
};


const saveServiceDocumentConfigService = async ({
  userId,
  ulbId,
  serviceId,
  servDocConfigCgStr,
  ipAddress,
  source,
}) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  if (!serviceId) {
    throw new Error("Service ID is required.");
  }

  if (!servDocConfigCgStr) {
    throw new Error(
      "Service document configuration is required."
    );
  }

  return await repo.saveServiceDocumentConfigRepo({
    userId,
    ulbId,
    serviceId,
    servDocConfigCgStr,
    ipAddress,
    source,
  });
};

const saveDocumentService = async ({
  userId,
  mode,
  docSerId,
  docSerStr,
  ipAddress,
  source,
}) => {

  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (mode === undefined || mode === null) {
    throw new Error("Mode is required.");
  }

  if (![1, 2].includes(Number(mode))) {
    throw new Error("Mode must be 1 or 2.");
  }

  if (!docSerId) {
    throw new Error("Document Service ID is required.");
  }

  if (!docSerStr) {
    throw new Error("Document service string is required.");
  }

  return await repo.saveDocumentRepo({
    userId,
    mode: Number(mode),
    docSerId: Number(docSerId),
    docSerStr,
    ipAddress,
    source,
  });
};

module.exports = {
 
  getServiceDocumentCountService,
  getAllServicesService,
  getDocumentsByServiceService,
  getActiveServicesService,
  getServiceDocumentsService,
  getServiceDocumentConfigService,
  saveServiceDocumentConfigService,
  saveDocumentService,
};