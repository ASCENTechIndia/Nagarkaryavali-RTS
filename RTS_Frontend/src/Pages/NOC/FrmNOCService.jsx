import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/calendar";
import Swal from "sweetalert2";
import ApplicantDetails from "@/components/ApplicantDetails";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import config from "@/utils/config";
import { toursAndTravelsValidationSchema, validateDynamicFields, documentValidationSchema } from "@/validations/global.validation";
import ShadCNTable from "@/components/ui/table"; 

const ROAD_TYPES = [
  { id: "200023793", name: "सिमेंट रोड" },
  { id: "200023795", name: "Gravel Road" },
  { id: "200023794", name: "हार्ड मिक्स रोड" },
  { id: "200023792", name: "मेटल रोड" },
  { id: "200023797", name: "जुना सिमेंट रोड" },
  { id: "200023796", name: "जुना तार रोड" },
  { id: "200023790", name: "साधा रस्ता" },
  { id: "200023791", name: "तार / डांबर रोड" },
];

const YES_NO_OPTIONS = [
  { id: "yes", name: "होय" },
  { id: "no", name: "नाही" },
];

const HOARDING_TYPES = [
  { id: "normal", name: "सामान्य होर्डिंग" },
  { id: "digital", name: "डिजिटल होर्डिंग" },
  { id: "temporary", name: "तात्पुरते होर्डिंग" },
];

const HOARDING_SUB_TYPES = [
  { id: "1", name: "सामान्य" },
  { id: "2", name: "प्रकाशित" },
  { id: "3", name: "अप्रकाशित" },
  { id: "4", name: "डिजिटल" },
  { id: "5", name: "इतर" },
];

const FIELD_KEY_MAP = {
  11: "permitFromDate",
  12: "permitToDate",
  13: "propertyNo",
  14: "businessAddress",
  15: "waterConnectionNo",
  16: "businessLicenseNo",
  17: "licenseType",
  18: "buildingPermissionProposalNo",
  19: "occupancyCertificateNo",
  20: "roadType",
  21: "roadLength",
  22: "roadWidth",
  23: "roadLengthWidth",
  24: "excavationArea",
  25: "excavationStartPoint",
  26: "excavationEndPoint",
  27: "latitude",
  28: "longitude",
  29: "hospitalName",
  30: "healthAgencyNo",
  31: "fixedArea",
  32: "newHoarding",
  33: "hoardingNumber",
  34: "advertisingArea",
  35: "numberOfLights",
  36: "hoardingType",
  37: "hoardingSubType",
};

const initialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  countryCode: "+91",
  mobileNo: "",
  emailId: "",
  aadharNo: "",
  residentialAddress: "",
  panCard: "",
  organizationName: "",
  organizationAddress: "",
  businessType: "",
  businessDescription: "",
  zoneId: "",

  permitFromDate: null,
  permitToDate: null,
  propertyNo: "",
  businessAddress: "",
  waterConnectionNo: "",
  businessLicenseNo: "",
  licenseType: "",
  buildingPermissionProposalNo: "",
  occupancyCertificateNo: "",
  roadType: "",
  roadLength: "",
  roadWidth: "",
  roadLengthWidth: "",
  excavationArea: "",
  excavationStartPoint: "",
  excavationEndPoint: "",
  latitude: "",
  longitude: "",
  hospitalName: "",
  healthAgencyNo: "",
  fixedArea: "",
  newHoarding: "",
  hoardingNumber: "",
  advertisingArea: "",
  numberOfLights: "",
  hoardingType: "",
  hoardingSubType: "",
};

const FrmNOCService = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const location = useLocation();
  const locationState = location.state || {};

  const ulbId = locationState.ulbId || user?.ulbId;
  const serviceId = locationState.serviceId;
  const deptId = locationState.deptId || user?.deptId;
  const serviceName = locationState.serviceName || "NOC";

  const [loading, setLoading] = useState(false);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [visibleFieldIds, setVisibleFieldIds] = useState(new Set());
  const [documentDefs, setDocumentDefs] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const originalDocumentDefs = useRef([]);


  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const DOC_HEADERS = ["Sr No.", "Document Name", "Image(jpg,png,pdf)"];
  const DOC_KEY_MAPPING = {
    "Sr No.": "srNo",
    "Document Name": "documentName",
    "Image(jpg,png,pdf)": "fileUpload",
  };

  const isVisible = (fieldId) => visibleFieldIds.has(fieldId);

  const fetchDocumentDefinitions = async () => {
    try {
      setDocsLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/FrmAssessmentCerti/documents`,
        {
          serviceId: serviceId,
          ulbId: ulbId,
        },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        },
      );

      if (response?.data?.ok && response?.data?.data?.rows) {
        const docs = response.data.data.rows;
        setDocumentDefs(docs);
        originalDocumentDefs.current = docs;
        const tableRows = docs.map((doc, index) => ({
          id: doc.DOCID || index + 1,
          srNo: index + 1,
          documentName: doc.DOCNAME || doc.ENGDOCDESC || "",
          docId: doc.DOCID,
          docType: doc.DOCTYPE || "PDF",
          file: null,
          fileName: "No file chosen",
          fileBuffer: null,
        }));

        setTableData(tableRows);
      }
    } catch (error) {
      console.error("Error fetching document definitions:", error);
      Swal.fire({
        text:
          error?.response?.data?.error ||
          "Failed to load document definitions",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setDocsLoading(false);
    }
  };

  useEffect(() => {
    const fetchServiceFields = async () => {
      if (!serviceId || !deptId || !ulbId) {
        console.warn("Missing serviceId/deptId/ulbId, skipping field fetch");
        setFieldsLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          `${BASE_URL}/api/FrmToursTravels/service-fields`,
          { serviceId, deptId, ulbId },
          {
            headers: {
              Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            },
          },
        );

        let ids = [];

        if (res.data.ok && res.data.data?.fields?.rows?.length > 0) {
          const apiFields = res.data.data.fields.rows.map((row) => ({
            fieldId: Number(row.fieldId ?? row.FIELDID),
          }));

          ids = apiFields
            .map((f) => f.fieldId)
            .filter((id) => FIELD_KEY_MAP[id]);
        }

        setVisibleFieldIds(new Set(ids));
      } catch (err) {
        console.error("Error fetching service fields:", err);
        setVisibleFieldIds(new Set());
      } finally {
        setFieldsLoading(false);
      }
    };

    fetchServiceFields();
    if (ulbId && serviceId) fetchDocumentDefinitions();
  }, [serviceId, deptId, ulbId]);

  const uploadDocument = async (applicationNo, doc) => {
    const formData = new FormData();
    formData.append("corpId", user?.corpId);
    formData.append("serviceId", serviceId);
    formData.append("appNo", String(applicationNo));
    formData.append("docType", doc.docType || "PDF");
    formData.append("documentId", String(doc.docId));
    formData.append("document", doc.file);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmAssessmentCerti/upload-document`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data.ok === true;
    } catch (error) {
      console.error("Error uploading document:", error);
      return false;
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setLoading(true);

    try {
      const validationResult = toursAndTravelsValidationSchema.safeParse({
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        mobileNo: values.mobileNo,
        emailId: values.emailId,
        aadharNo: values.aadharNo,
        residentialAddress: values.residentialAddress,
        businessType: values.businessType,
        businessDescription: values.businessDescription,
        zoneId: values.zoneId,
      });

      if (!validationResult.success) {
        Swal.fire({
          text: validationResult.error.issues[0].message,
          confirmButtonColor: "#1e3a8a",
          allowOutsideClick: false,
        });
        setLoading(false);
        return;
      }

      const dynamicErrors = validateDynamicFields(values, visibleFieldIds);
      const firstDynamicKey = Object.keys(dynamicErrors)[0];
      if (firstDynamicKey) {
        Swal.fire({
          text: dynamicErrors[firstDynamicKey],
          confirmButtonColor: "#1e3a8a",
          allowOutsideClick: false,
        });
        setLoading(false);
        return;
      }

      if (tableData.length > 0) {
        const docValidation = documentValidationSchema.safeParse(tableData);
        if (!docValidation.success) {
          Swal.fire({
            text: docValidation.error.issues[0].message,
            confirmButtonColor: "#1e3a8a",
            allowOutsideClick: false,
          });
          setLoading(false);
          return;
        }
      }

      const documents = tableData
        .filter((row) => row.file)
        .map((row) => ({
          docId: row.docId,
          docName: row.documentName,
          docType: row.docType || "PDF",
          file: row.file,
        }));

      const loader = Swal.fire({
        title: "Submitting Application...",
        text: "Please wait while we process your application.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      const toDateStr = (v) =>
        v instanceof Date && !isNaN(v.getTime())
          ? v.toISOString().split("T")[0]
          : "";

      let businessTypeValue = null;
      if (values.businessType && values.businessType !== "") {
        const n = Number(values.businessType);
        if (!isNaN(n)) businessTypeValue = n;
      }

      const payload = {
        userId: user?.userId,
        ulbId,
        serviceId,
        deptId,
        zoneId: values.zoneId || null,

        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        address: values.residentialAddress,
        mobileNo: values.mobileNo,
        aadhaarNo: values.aadharNo,
        panCardNo: values.panCard,
        emailId: values.emailId,
        orgName: values.organizationName,
        orgAddress: values.organizationAddress,

        businessType: businessTypeValue,
        businessDescription: values.businessDescription,

        propertyNo: values.propertyNo,
        businessAddress: values.businessAddress,
        waterConnectionNo: values.waterConnectionNo,
        permitFromDate: toDateStr(values.permitFromDate),
        permitToDate: toDateStr(values.permitToDate),
        businessLicenseNo: values.businessLicenseNo,
        buildingPermissionProposalNo: values.buildingPermissionProposalNo,
        licenseType: values.licenseType,

        occupancyCertificateNo: values.occupancyCertificateNo,
        roadType: values.roadType,
        roadLength: values.roadLength,
        roadWidth: values.roadWidth,
        roadLengthWidth: values.roadLengthWidth,
        excavationArea: values.excavationArea,
        excavationStartPoint: values.excavationStartPoint,
        excavationEndPoint: values.excavationEndPoint,
        latitude: values.latitude,
        longitude: values.longitude,
        hospitalName: values.hospitalName,
        healthAgencyNo: values.healthAgencyNo,
        fixedArea: values.fixedArea,
        newHoarding: values.newHoarding,
        hoardingNumber: values.hoardingNumber,
        advertisingArea: values.advertisingArea,
        numberOfDays: values.numberOfLights,
        hoardingType: values.hoardingType,
        hoardingSubType: values.hoardingSubType,
      };

      const submitResponse = await axios.post(
        `${BASE_URL}/api/FrmToursTravels/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        },
      );

      if (!submitResponse.data.ok) {
        loader.close();
        Swal.fire({
          text: submitResponse.data.message || "Application submission failed",
          confirmButtonColor: "#1e3a8a",
          allowOutsideClick: false,
        });
        setLoading(false);
        return;
      }

      const applicationNo = submitResponse.data.data?.applicationNo;
      const message = `${submitResponse.data.message}. Application No: ${applicationNo}` || "Application submitted successfully";

      if (applicationNo && documents.length > 0) {
        for (const doc of documents) {
          const ok = await uploadDocument(applicationNo, doc);
          if (!ok) {
            loader.close();
            Swal.fire({
              text: `Failed to upload document: ${doc.docName}`,
              confirmButtonColor: "#1e3a8a",
              allowOutsideClick: false,
            });
            setLoading(false);
            return;
          }
        }
      }

      loader.close();

      Swal.fire({
        text: message,
        confirmButtonColor: "#1e3a8a",
        allowOutsideClick: false,
      }).then(() => {
        resetForm();
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
        navigate("/app/FrmTrackApplication", {
          state: { applicationNo },
        });
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      Swal.fire({
        text:
          error?.response?.data?.message ||
          "Error submitting application. Please try again.",
        confirmButtonColor: "#1e3a8a",
        allowOutsideClick: false,
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleReset = (resetForm, setFieldValue) => {
    resetForm();
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
    Swal.fire({
      text: "Form has been reset successfully",
      confirmButtonColor: "#1e3a8a",
    });
  };

  const handleFileChange = (id, event) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setTableData((prev) =>
        prev.map((row) =>
          row.id === id
            ? { ...row, file: file, fileName: file.name }
            : row
        )
      );
    }
  };

  const transformedTableData = tableData.map((item) => ({
    ...item,
    fileUpload: (
      <div className="flex items-center justify-center gap-2">
        <Input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileChange(item.id, e)}
          className="h-9 text-sm p-1 w-[50%]"
        />
      </div>
    ),
  }));

  if (fieldsLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-gray-500">Loading form fields...</p>
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={false}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        resetForm,
        isSubmitting,
      }) => (
        <Form>
          <div className="space-y-6">
            <ApplicantDetails />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border shadow-sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">
                    आवश्यक डेटा : NOC for {serviceName}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isVisible(11) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="परवानगी या दिनांकापासून" />
                          <span>:</span>
                        </div>
                        <DatePicker
                          value={values.permitFromDate || undefined}
                          onChange={(date) => setFieldValue("permitFromDate", date || null)}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(12) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="परवानगी या दिनांकापर्यंत" />
                          <span>:</span>
                        </div>
                        <DatePicker
                          value={values.permitToDate || undefined}
                          onChange={(date) => setFieldValue("permitToDate", date || null)}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(13) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="मालमत्ता क्रमांक" />
                          <span>:</span>
                        </div>
                        <Input
                          name="propertyNo"
                          value={values.propertyNo || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(14) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="व्यवसायाचा पत्ता" />
                          <span>:</span>
                        </div>
                        <Input
                          name="businessAddress"
                          value={values.businessAddress || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(15) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="नळ जोडणी क्र." />
                          <span>:</span>
                        </div>
                        <Input
                          name="waterConnectionNo"
                          value={values.waterConnectionNo || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(16) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="व्यवसाय परवाना क्रमांक" />
                          <span>:</span>
                        </div>
                        <Input
                          name="businessLicenseNo"
                          value={values.businessLicenseNo || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(17) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="परवाना प्रकार" />
                          <span>:</span>
                        </div>
                        <Input
                          name="licenseType"
                          value={values.licenseType || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(18) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="बांधकाम परवानगी प्रस्ताव क्रमांक" />
                          <span>:</span>
                        </div>
                        <Input
                          name="buildingPermissionProposalNo"
                          value={values.buildingPermissionProposalNo || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(19) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="भोगावटा प्रमाणपत्र क्रमांक" />
                          <span>:</span>
                        </div>
                        <Input
                          name="occupancyCertificateNo"
                          value={values.occupancyCertificateNo || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(20) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="रस्त्याचे प्रकार" />
                          <span>:</span>
                        </div>
                        <Select
                          value={values.roadType || ""}
                          onValueChange={(value) =>
                            setFieldValue("roadType", value)
                          }
                        >
                          <SelectTrigger className={`w-full h-9`}>
                            <SelectValue placeholder="--Select Option--" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROAD_TYPES.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {isVisible(21) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="रस्त्याची लांबी (मीटर)" />
                          <span>:</span>
                        </div>
                        <Input
                          type="number"
                          name="roadLength"
                          value={values.roadLength || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(22) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="रस्त्याची रुंदी (मीटर)" />
                          <span>:</span>
                        </div>
                        <Input
                          type="number"
                          name="roadWidth"
                          value={values.roadWidth || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(23) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="रस्त्याची लांबीरुंदी" />
                          <span>:</span>
                        </div>
                        <Input
                          type="number"
                          name="roadLengthWidth"
                          value={values.roadLengthWidth || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(24) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="खोदण्याचे आकार" />
                          <span>:</span>
                        </div>
                        <Input
                          type="number"
                          name="excavationArea"
                          value={values.excavationArea || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(25) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="खोदाईचे प्रारंभिक बिंदू" />
                          <span>:</span>
                        </div>
                        <Input
                          name="excavationStartPoint"
                          value={values.excavationStartPoint || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(26) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="खोदाईचे शेवटी बिंदू" />
                          <span>:</span>
                        </div>
                        <Input
                          name="excavationEndPoint"
                          value={values.excavationEndPoint || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(27) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="अक्षांश" />
                          <span>:</span>
                        </div>
                        <Input
                          name="latitude"
                          value={values.latitude || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(28) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="रेखांश" />
                          <span>:</span>
                        </div>
                        <Input
                          name="longitude"
                          value={values.longitude || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(29) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="रुग्णालयाचे नाव" />
                          <span>:</span>
                        </div>
                        <Input
                          name="hospitalName"
                          value={values.hospitalName || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(30) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="आरोग्य एनओसी क्रमांक" />
                          <span>:</span>
                        </div>
                        <Input
                          name="healthAgencyNo"
                          value={values.healthAgencyNo || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(31) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="मंडपसाठी विनंती केलेले क्षेत्र" />
                          <span>:</span>
                        </div>
                        <Input
                          type="number"
                          name="fixedArea"
                          value={values.fixedArea || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(32) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="नवीन होर्डिंग" />
                          <span>:</span>
                        </div>
                        <Select
                          value={values.newHoarding || ""}
                          onValueChange={(value) =>
                            setFieldValue("newHoarding", value)
                          }
                        >
                          <SelectTrigger className={`w-full h-9`}>
                            <SelectValue placeholder="--Select Option--" />
                          </SelectTrigger>
                          <SelectContent>
                            {YES_NO_OPTIONS.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {isVisible(33) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="होर्डिंगची संख्या" />
                          <span>:</span>
                        </div>
                        <Input
                          type="number"
                          name="hoardingNumber"
                          value={values.hoardingNumber || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(34) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="जाहिरातीसाठी विनंती केलेले क्षेत्र" />
                          <span>:</span>
                        </div>
                        <Input
                          type="number"
                          name="advertisingArea"
                          value={values.advertisingArea || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(35) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="दिवसांची संख्या" />
                          <span>:</span>
                        </div>
                        <Input
                          type="number"
                          name="numberOfLights"
                          value={values.numberOfLights || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    )}

                    {isVisible(36) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="होर्डिंगचे प्रकार" />
                          <span>:</span>
                        </div>
                        <Select
                          value={values.hoardingType || ""}
                          onValueChange={(value) =>
                            setFieldValue("hoardingType", value)
                          }
                        >
                          <SelectTrigger className={`w-full h-9`}>
                            <SelectValue placeholder="--Select Option--" />
                          </SelectTrigger>
                          <SelectContent>
                            {HOARDING_TYPES.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {isVisible(37) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="होर्डिंगचे उप प्रकार" />
                          <span>:</span>
                        </div>
                        <Select
                          value={values.hoardingSubType || ""}
                          onValueChange={(value) =>
                            setFieldValue("hoardingSubType", value)
                          }
                        >
                          <SelectTrigger className={`w-full h-9`}>
                            <SelectValue placeholder="--Select Option--" />
                          </SelectTrigger>
                          <SelectContent>
                            {HOARDING_SUB_TYPES.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {tableData.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="border shadow-sm">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg font-semibold">
                      कागदपत्रे अपलोड करा
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6">
                    {docsLoading ? (
                      <div className="text-center py-4">Loading documents...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <ShadCNTable
                          headers={DOC_HEADERS}
                          data={transformedTableData}
                          keyMapping={DOC_KEY_MAPPING}
                          pagination={false}
                          className="max-md:min-w-380"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <div className="flex justify-center items-center gap-3 pt-4 pb-6">
              <Button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white"
                disabled={loading || isSubmitting}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200"
                onClick={() => handleReset(resetForm, setFieldValue)}
              >
                Reset
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmNOCService;
