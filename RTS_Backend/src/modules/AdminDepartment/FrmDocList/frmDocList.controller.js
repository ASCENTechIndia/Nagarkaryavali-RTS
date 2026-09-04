const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const { AppError } = require("../../../libs/errors");
const service = require("./frmDocList.service");

const getServiceDocumentCount = asyncHandler(
  async (req, res) => {
    const result =
      await service.getServiceDocumentCountService();

    if (!result.success) {
      throw new AppError(
        result.error ||
          "Failed to get service document count.",
        500
      );
    }

    return ok(res, {
      status: "SUCCESS",
      message:
        "Service document count fetched successfully.",
      rowCount: result.rowCount,
      data: result.rows,
    });
  }
);

const getAllServices = asyncHandler(
  async (req, res) => {
    const result =
      await service.getAllServicesService();

    if (!result.success) {
      throw new AppError(
        result.error ||
          "Failed to get services.",
        500
      );
    }

    return ok(res, {
      status: "SUCCESS",
      message: "Services fetched successfully.",
      rowCount: result.rowCount,
      data: result.rows,
    });
  }
);

const getDocumentsByService = asyncHandler(
  async (req, res) => {
    const { serviceId } = req.body;

    if (!serviceId) {
      throw new AppError(
        "serviceId is required",
        400
      );
    }

    const result =
      await service.getDocumentsByServiceService(
        serviceId
      );

    if (!result.success) {
      throw new AppError(
        result.error ||
          "Failed to get documents.",
        500
      );
    }

    return ok(res, {
      status: "SUCCESS",
      message: "Documents fetched successfully.",
      serviceId,
      rowCount: result.rowCount,
      data: result.rows,
    });
  }
);

const getActiveServices = asyncHandler(
  async (req, res) => {
    const result =
      await service.getActiveServicesService();

    if (!result.success) {
      throw new AppError(
        result.error ||
          "Failed to get active services.",
        500
      );
    }

    return ok(res, {
      status: "SUCCESS",
      message:
        "Active services fetched successfully.",
      rowCount: result.rowCount,
      data: result.rows,
    });
  }
);

const getServiceDocuments = asyncHandler(
  async (req, res) => {
    const { serviceId } = req.body;

    if (!serviceId) {
      throw new AppError(
        "serviceId is required",
        400
      );
    }

    const result =
      await service.getServiceDocumentsService(
        serviceId
      );

    if (!result.success) {
      throw new AppError(
        result.error ||
          "Failed to get service documents.",
        500
      );
    }

    return ok(res, {
      status: "SUCCESS",
      message:
        "Service documents fetched successfully.",
      serviceId,
      rowCount: result.rowCount,
      data: result.rows,
    });
  }
);

const getServiceDocumentConfig = asyncHandler(
  async (req, res) => {
    const {
      ulbId,
      serviceId,
    } = req.body;

    if (!ulbId) {
      throw new AppError(
        "ulbId is required",
        400
      );
    }

    if (!serviceId) {
      throw new AppError(
        "serviceId is required",
        400
      );
    }

    const result =
      await service.getServiceDocumentConfigService({
        ulbId,
        serviceId,
      });

    if (!result.success) {
      throw new AppError(
        result.error ||
          "Failed to get service document configuration.",
        500
      );
    }

    return ok(res, {
      status: "SUCCESS",
      message:
        "Service document configuration fetched successfully.",
      ulbId,
      serviceId,
      rowCount: result.rowCount,
      data: result.rows,
    });
  }
);

const saveServiceDocumentConfig = asyncHandler(
  async (req, res) => {
    console.log("================================================");
    console.log(
      "Request: Save Service Document Configuration"
    );
    console.log("Request Body:", req.body);
    console.log("================================================");

    const {
      userId,
      ulbId,
      serviceId,
      servDocConfigCgStr,
      ipAddress,
      source,
    } = req.body;

    if (!userId) {
      throw new AppError(
        "userId is required",
        400
      );
    }

    if (!ulbId) {
      throw new AppError(
        "ulbId is required",
        400
      );
    }

    if (!serviceId) {
      throw new AppError(
        "serviceId is required",
        400
      );
    }

    if (!servDocConfigCgStr) {
      throw new AppError(
        "servDocConfigCgStr is required",
        400
      );
    }

    const result =
      await service.saveServiceDocumentConfigService({
        userId,
        ulbId,
        serviceId,
        servDocConfigCgStr,
        ipAddress: ipAddress || "",
        source: source || "RTS",
      });

    if (!result.success) {
      throw new AppError(
        result.errorMsg ||
          "Failed to save service document configuration.",
        500
      );
    }

    return ok(res, {
      status: "SUCCESS",
      message:
        result.errorMsg ||
        "Data inserted successfully.",
      errorCode: result.errorCode,
      data: result,
    });
  }
);

const saveDocument = asyncHandler(async (req, res) => {

  const {
    userId,
    mode,
    docSerId,
    docSerStr,
    ipAddress,
    source,
  } = req.body;

  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  if (mode === undefined || mode === null) {
    throw new AppError("mode is required", 400);
  }

  if (![1, 2].includes(Number(mode))) {
    throw new AppError("mode must be 1 or 2", 400);
  }

  if (!docSerId) {
    throw new AppError("docSerId is required", 400);
  }

  if (!docSerStr) {
    throw new AppError("docSerStr is required", 400);
  }

  const result = await service.saveDocumentService({
    userId,
    mode: Number(mode),
    docSerId: Number(docSerId),
    docSerStr,
    ipAddress: ipAddress || "",
    source: source || "RTS",
  });

  if (!result.success) {
    throw new AppError(
      result.errorMsg || "Failed to save document.",
      500
    );
  }

  return ok(res, {
    status: "SUCCESS",
    message: result.errorMsg || "Document saved successfully.",
    errorCode: result.errorCode,
    data: result,
  });
});

module.exports = {
 
  getServiceDocumentCount,
  getAllServices,
  getDocumentsByService,
  getActiveServices,
  getServiceDocuments,
  getServiceDocumentConfig,
  saveServiceDocumentConfig,
  saveDocument,
};