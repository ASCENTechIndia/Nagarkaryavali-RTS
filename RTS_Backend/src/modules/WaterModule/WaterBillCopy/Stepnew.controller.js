const asyncHandler = require("../../../libs/asyncHandler");
const { fail, ok } = require("../../../libs/response");
const service = require("./Stepnew.service");


exports.getServiceNameController = asyncHandler(
    async (req, res) => {

        console.log("Service Name Request:", req.query);

        const { serviceId } = req.query;

        if (!serviceId) {
            return fail(res, "serviceId is required");
        }

        const data = await service.getServiceNameService({
            serviceId,
        });

        if (!data.success) {
            return fail(res, data.message);
        }

        return ok(
            res,
            data,
            data.message || "Service name fetched successfully"
        );
    }
);


exports.getNocPurposeController = asyncHandler(
    async (req, res) => {

        console.log("NOC Purpose Request:", req.query);

        const data = await service.getNocPurposeService({});

        if (!data.success) {
            return fail(res, data.message);
        }

        return ok(
            res,
            data,
            data.message || "NOC purpose fetched successfully"
        );
    }
);


exports.getWardsController = asyncHandler(
    async (req, res) => {

        

      

      
        const data = await service.getWardsService({
            
        });

        if (!data.success) {
            return fail(res, data.message);
        }

        return ok(
            res,
            data,
            data.message || "Wards fetched successfully"
        );
    }
);


exports.getUserMobileController = asyncHandler(
    async (req, res) => {

        console.log("User Mobile Request:", req.query);

        const {
            userUniqueId,
            ulbid,
        } = req.query;

        if (!userUniqueId) {
            return fail(res, "userUniqueId is required");
        }

        if (!ulbid) {
            return fail(res, "ulbid is required");
        }

        const data = await service.getUserMobileService({
            userUniqueId,
            ulbid,
        });

        if (!data.success) {
            return fail(res, data.message);
        }

        return ok(
            res,
            data,
            data.message || "User mobile fetched successfully"
        );
    }
);


exports.getWaterSewerageTypesController = asyncHandler(
    async (req, res) => {

        console.log(
            "Water Sewerage Types Request:",
            req.query
        );

        const data =
            await service.getWaterSewerageTypesService({});

        if (!data.success) {
            return fail(res, data.message);
        }

        return ok(
            res,
            data,
            data.message ||
            "Water sewerage types fetched successfully"
        );
    }
);


exports.getWaterConsumerTypesController = asyncHandler(
    async (req, res) => {

        console.log(
            "Water Consumer Types Request:",
            req.query
        );

        const data =
            await service.getWaterConsumerTypesService({});

        if (!data.success) {
            return fail(res, data.message);
        }

        return ok(
            res,
            data,
            data.message ||
            "Water consumer types fetched successfully"
        );
    }
);


exports.getWaterMeterTypesController = asyncHandler(
    async (req, res) => {

        console.log(
            "Water Meter Types Request:",
            req.query
        );

        const data =
            await service.getWaterMeterTypesService({});

        if (!data.success) {
            return fail(res, data.message);
        }

        return ok(
            res,
            data,
            data.message ||
            "Water meter types fetched successfully"
        );
    }
);


exports.getServiceDocumentsController = asyncHandler(
    async (req, res) => {

        console.log(
            "Service Documents Request:",
            req.query
        );

        const {
            serviceId,
            ulbid,
        } = req.query;

        if (!serviceId) {
            return fail(res, "serviceId is required");
        }

        if (!ulbid) {
            return fail(res, "ulbid is required");
        }

        const data =
            await service.getServiceDocumentsService({
                serviceId,
                ulbid,
            });

        if (!data.success) {
            return fail(res, data.message);
        }

        return ok(
            res,
            data,
            data.message ||
            "Service documents fetched successfully"
        );
    }
);

exports.saveApplicantInfoController = asyncHandler(
    async (req, res) => {

        console.log(
            "Applicant Information Request:",
            req.body
        );

        const {
            in_ulbid,
            in_corpid,
            in_serviceid,
            in_userid,
            in_firstname,
            in_firstnameM,
            in_middlename,
            in_middlenameM,
            in_lastname,
            in_lastnameM,
            in_mobileno,
            in_adharno,
            in_email,
            in_address,
            in_addressM,
            in_purpose,
            in_purposeM,
            in_zoneid,
            in_wardno,
            in_propertyno,
            in_mode,
            in_PropertyUsage,
            in_SellerName,
            in_TransferToWhom,
            in_AgreementDate,
            in_AppNo,
            in_wtsewrgtypeid,
            in_nocpurposeid,
            in_RegiNo,
            in_UniqueNo,
            in_appsource,
            in_deliveryflag,
            in_consumertypeid,
            in_metertypeid,
        } = req.body;


        // ==========================================
        // REQUIRED PARAMETERS
        // ==========================================

        if (!in_ulbid) {
            return fail(res, "in_ulbid is required");
        }

        if (!in_corpid) {
            return fail(res, "in_corpid is required");
        }

        if (!in_serviceid) {
            return fail(res, "in_serviceid is required");
        }

        if (!in_userid) {
            return fail(res, "in_userid is required");
        }

        if (
            in_mode === undefined ||
            in_mode === null ||
            in_mode === ""
        ) {
            return fail(res, "in_mode is required");
        }


        // ==========================================
        // PROCEDURE PAYLOAD
        // ==========================================

        const payload = {
            in_ulbid,
            in_corpid,
            in_serviceid,
            in_userid,

            in_firstname,
            in_firstnameM,

            in_middlename,
            in_middlenameM,

            in_lastname,
            in_lastnameM,

            in_mobileno,
            in_adharno,
            in_email,

            in_address,
            in_addressM,

            in_purpose,
            in_purposeM,

            in_zoneid,
            in_wardno,
            in_propertyno,

            in_mode,

            in_PropertyUsage,
            in_SellerName,
            in_TransferToWhom,
            in_AgreementDate,

            in_AppNo,

            in_wtsewrgtypeid,
            in_nocpurposeid,

            in_RegiNo,
            in_UniqueNo,

            in_appsource,
            in_deliveryflag,

            in_consumertypeid,
            in_metertypeid,
        };


        const data =
            await service.saveApplicantInfoService(payload);


        if (!data.success) {
            return fail(res, data.message);
        }


        return ok(
            res,
            data,
            data.message ||
            "Application details processed successfully"
        );
    }
);

exports.uploadAppDocument = asyncHandler(
  async (req, res) => {

    console.log(
      "Upload Application Document Request:",
      {
        body: req.body,
        file: req.file?.originalname,
      }
    );

    const {
      CorpId,
      ServiceId,
      AppNo,
      DocType,
      DocumentId,
    } = req.body;

    const file = req.file;

    if (!CorpId) {
      return fail(res, "CorpId is required");
    }

    if (!ServiceId) {
      return fail(res, "ServiceId is required");
    }

    if (!AppNo) {
      return fail(res, "AppNo is required");
    }

    if (!DocType) {
      return fail(res, "DocType is required");
    }

    if (!DocumentId) {
      return fail(res, "DocumentId is required");
    }

    if (!file) {
      return fail(res, "file is required");
    }

    const data =
      await service.uploadAppDocument({
        CorpId,
        ServiceId,
        AppNo,
        DocType,
        DocumentId,
        file,
      });

    return ok(
      res,
      data,
      "Document uploaded successfully"
    );
  }
);