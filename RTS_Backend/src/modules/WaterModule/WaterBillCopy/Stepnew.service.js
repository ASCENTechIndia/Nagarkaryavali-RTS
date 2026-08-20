const repo = require("./Stepnew.repo");


const getServiceNameService = async (payload) => {
    console.log("Service: Fetch Service Name", payload);

    const data = await repo.getServiceNameRepo(payload);

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No service found",
            data: null,
        };
    }

    return {
        success: true,
        count: data.length,
        data,
    };
};


const getNocPurposeService = async (payload) => {
    console.log("Service: Fetch NOC Purpose", payload);

    const data = await repo.getNocPurposeRepo();

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No NOC purpose found",
            data: [],
        };
    }

    return {
        success: true,
        count: data.length,
        data,
    };
};


const getWardsService = async () => {
    console.log("Service: Fetch Wards", );

    const data = await repo.getWardsRepo();

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No wards found",
            data: [],
        };
    }

    return {
        success: true,
        count: data.length,
        data,
    };
};


const getUserMobileService = async (payload) => {
    console.log("Service: Fetch User Mobile", payload);

    const data = await repo.getUserMobileRepo(payload);

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No user mobile number found",
            data: [],
        };
    }

    return {
        success: true,
        count: data.length,
        data,
    };
};


const getWaterSewerageTypesService = async (payload) => {
    console.log("Service: Fetch Water Sewerage Types", payload);

    const data = await repo.getWaterSewerageTypesRepo();

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No water sewerage types found",
            data: [],
        };
    }

    return {
        success: true,
        count: data.length,
        data,
    };
};


const getWaterConsumerTypesService = async (payload) => {
    console.log("Service: Fetch Water Consumer Types", payload);

    const data = await repo.getWaterConsumerTypesRepo();

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No water consumer types found",
            data: [],
        };
    }

    return {
        success: true,
        count: data.length,
        data,
    };
};


const getWaterMeterTypesService = async (payload) => {
    console.log("Service: Fetch Water Meter Types", payload);

    const data = await repo.getWaterMeterTypesRepo();

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No water meter types found",
            data: [],
        };
    }

    return {
        success: true,
        count: data.length,
        data,
    };
};


const getServiceDocumentsService = async (payload) => {
    console.log("Service: Fetch Service Documents", payload);

    const data = await repo.getServiceDocumentsRepo(payload);

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No service documents found",
            data: [],
        };
    }

    return {
        success: true,
        count: data.length,
        data,
    };
};
const saveApplicantInfoService = async (payload) => {

    console.log(
        "Service: Save Applicant Information",
        {
            ulbid: payload.in_ulbid,
            corpid: payload.in_corpid,
            serviceid: payload.in_serviceid,
            userid: payload.in_userid,
            mode: payload.in_mode,
        }
    );

    const data = await repo.saveApplicantInfoRepo(payload);

    console.log("Service: Procedure Result:", data);

    if (!data) {
        return {
            success: false,
            message: "Application could not be processed",
            data: null,
        };
    }

    /*
     * Procedure returns:
     * out_errcode
     * out_ErrMsg
     * out_AppNo
     *
     * Success code = 9999
     */

    if (Number(data.out_errcode) !== 9999) {

        return {
            success: false,
            message:
                data.out_ErrMsg ||
                "Application could not be processed",

            data: {
                appNo: data.out_AppNo || null,
                errorCode: data.out_errcode,
            },
        };
    }

    return {
        success: true,

        message:
            data.out_ErrMsg ||
            "Application details processed successfully",

        data: {
            appNo: data.out_AppNo,
            errorCode: data.out_errcode,
        },
    };
};

async function uploadAppDocument({
  CorpId,
  ServiceId,
  AppNo,
  DocType,
  DocumentId,
  file,
}) {

  if (!CorpId) {
    throw new AppError("CorpId is required", 400);
  }

  if (!ServiceId) {
    throw new AppError("ServiceId is required", 400);
  }

  if (!AppNo) {
    throw new AppError("AppNo is required", 400);
  }

  if (!DocType) {
    throw new AppError("DocType is required", 400);
  }

  if (!DocumentId) {
    throw new AppError("DocumentId is required", 400);
  }

  if (!file) {
    throw new AppError("file is required", 400);
  }

  const out = await repo.insertAppDocument({
    CorpId,
    ServiceId,
    AppNo,
    DocType,
    DocumentId,
    fileBuffer: file.buffer,
  });

  if (!out || out.out_errorcode !== 0) {
    throw new AppError(
      out?.out_errormsg || "Document upload failed",
      500
    );
  }

  return {
    appNo: out.app_no,
    docId: out.doc_id,
    rowsAffected: out.rows_affected,
  };
}



module.exports = {
    getServiceNameService,
    getNocPurposeService,
    getWardsService,
    getUserMobileService,
    getWaterSewerageTypesService,
    getWaterConsumerTypesService,
    getWaterMeterTypesService,
    getServiceDocumentsService,
    saveApplicantInfoService,
    uploadAppDocument,
};