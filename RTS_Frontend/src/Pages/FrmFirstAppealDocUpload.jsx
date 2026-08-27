import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { DatePicker } from "@/components/ui/calendar";

const initialValues = {
  applicationDate: "",
  acknowledgementDate: "",
  documentProductionDate: "",
  publicServiceRequired: "",
  designatedOfficerDecision: "",
  stipulatedTimeLimit: "",
  rejectionIntimationDate: "",
  reliefSought: "",
  otherInformation: "",
  declaration: false,
};

const FrmFirstAppealDocUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const locationState = location.state || {};
  const firstAppealData = locationState.firstAppealData || {};
  const ulbId = locationState.ulbId || user?.ulbId;
  const userId = locationState.userId || user?.userId;
  const serviceId = locationState.serviceId || user?.serviceId || 290; // hardcode becoz currently i navigate page by url

  const [loading, setLoading] = useState(false);
  const [documentDefs, setDocumentDefs] = useState([]);
  const [tableData, setTableData] = useState([]);

  const headers = [
    "Select",
    "Document Name",
    "Image(jpg,png,pdf)",
    "Upload Document",
  ];

  const keyMapping = {
    Select: "select",
    "Document Name": "documentName",
    "Image(jpg,png,pdf)": "preview",
    "Upload Document": "fileUpload",
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/api/FrmAssessmentCerti/documents`,
        {
          serviceId: Number(serviceId),
          ulbId: Number(ulbId),
        },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Document Response:", response.data);

      if (
        response.data?.ok &&
        response.data?.data?.success &&
        Array.isArray(response.data?.data?.rows)
      ) {
        const documents = response.data.data.rows.map((doc, index) => ({
          id: doc.DOCID,
          docId: doc.DOCID,
          documentName: doc.DOCNAME,
          docType: doc.DOCTYPE,
          selected: false,
          file: null,
          fileName: "",
        }));

        setDocumentDefs(documents);
        setTableData(documents);
      } else {
        setDocumentDefs([]);
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);

      setDocumentDefs([]);
      setTableData([]);

      Swal.fire({
        text: error?.response?.data?.message || "Error fetching document list.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [serviceId, ulbId]);

  const handleDocumentSelect = (id, checked) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, selected: checked } : row)),
    );
  };

  const handleSelectAll = (checked) => {
    setTableData((prev) =>
      prev.map((row) => ({
        ...row,
        selected: checked,
      })),
    );
  };

  const handleFileChange = (id, event) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setTableData((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, file: file, fileName: file.name } : row,
        ),
      );
    }
  };

  const uploadDocument = async (applicationNo, appealNo, appealTypeId, doc) => {
    const formData = new FormData();

    formData.append("corpId", String(ulbId));
    formData.append("serviceId", String(serviceId));
    formData.append("appNo", applicationNo);
    formData.append("appealNo", appealNo);
    formData.append("docType", doc.docType || "PDF");
    formData.append("documentId", String(doc.docId));
    formData.append("appealTypeId", String(appealTypeId));
    formData.append("document", doc.file);

    console.log("Uploading Document:", {
      corpId: ulbId,
      serviceId,
      appNo: applicationNo,
      appealNo,
      docType: doc.docType || "PDF",
      documentId: doc.docId,
      appealTypeId,
      file: doc.file?.name,
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmFirstAppealDocUpload/upload-appeal-document`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Upload Response:", response.data);

      return response.data?.ok === true;
    } catch (error) {
      console.error("Error uploading document:", error);

      console.error("Upload Error Response:", error?.response?.data);

      return false;
    }
  };

  const transformedTableData = tableData.map((item) => ({
    ...item,

    select: (
      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={item.selected || false}
          onChange={(e) => handleDocumentSelect(item.id, e.target.checked)}
          className="h-4 w-4 cursor-pointer"
        />
      </div>
    ),

    preview: (
      <div className="flex items-center justify-center">
        {item.file ? (
          item.file.type?.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(item.file)}
              alt="Preview"
              className="h-10 w-14 object-cover rounded border"
            />
          ) : (
            <span className="text-xs text-gray-600">PDF</span>
          )
        ) : (
          <span className="text-xs text-gray-400">No File</span>
        )}
      </div>
    ),

    fileUpload: (
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={(e) => handleFileChange(item.id, e)}
          className="h-9 text-sm p-1 w-full"
        />

        {item.fileName && item.fileName !== "No file chosen" && (
          <span className="text-xs text-gray-500 truncate max-w-[150px]">
            {item.fileName}
          </span>
        )}
      </div>
    ),
  }));

  const formatDateForApi = (date) => {
    if (!date) return "";
    if (typeof date === "string") {
      return date.split("T")[0];
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return "";

    return d.toISOString().split("T")[0];
  };

  const handleSubmit = async (values) => {
    try {
      const {
        firstAppellateAuthorityDesignation = "",
        firstAppellateAuthorityOfficeAddress = "",
        nameOfEligiblePerson = "",
        addressOfEligiblePerson = "",
        nameOfDesignatedOfficer = "",
        addressOfDesignatedOfficer = "",
        appealType = "",
        applicationNo = "",
      } = firstAppealData;

      if (!applicationNo) {
        Swal.fire({
          text: "Application Number is missing.",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      if (!appealType) {
        Swal.fire({
          text: "Appeal Type is missing.",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      setLoading(true);

      const payload = {
        appUserId: String(userId),
        ulbId: Number(ulbId),
        app1stAppAuthDesi: firstAppellateAuthorityDesignation,
        app1stAppAuthOffAdd: firstAppellateAuthorityOfficeAddress,
        nameEligPerson: nameOfEligiblePerson,
        addEligPerson: addressOfEligiblePerson,
        nameDesiOfficer: nameOfDesignatedOfficer,
        addDesiOfficer: addressOfDesignatedOfficer,
        appealType: Number(appealType),
        appNo: applicationNo,
        dtAProduceBefDesiOffiProvisRvi: formatDateForApi(
          values.applicationDate,
        ),
        dtAcknowegmt: formatDateForApi(values.acknowledgementDate),
        dtProdDoc: formatDateForApi(values.documentProductionDate),
        detPubServiceReq: values.publicServiceRequired,
        descIsionDesiOffi: values.designatedOfficerDecision,
        stipTimeLimit: values.stipulatedTimeLimit,
        dtIntiRejAppliRecieEligPer: formatDateForApi(
          values.rejectionIntimationDate,
        ),
        reliefSought: values.reliefSought,
        firstOtherInfo: values.otherInformation,
        name1stAppealAuth: "",
        add1stAppealAuth: "",
        appealNo: "",
        dtAppliDesiOffi: "",
        desi1stAppealAuth: "",
        dt1stAppeal: "",
        dtReciOrder1stAppealAuth: "",
        secondOtherInfo: "",
        hearingDt: "",
        refAppealType: Number(appealType),
        mode: 1,
      };

      console.log("Submit Appeal Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmFirstAppealDocUpload/submit-appeal`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Submit Appeal Response:", response.data);

      if (!response.data?.ok || !response.data?.data?.success) {
        throw new Error(
          response.data?.data?.message ||
            response.data?.message ||
            "Failed to submit appeal.",
        );
      }

      const generatedAppealNo = response.data?.data?.appealNo;

      if (!generatedAppealNo) {
        throw new Error("Appeal Number was not generated.");
      }

      console.log("Generated Appeal Number:", generatedAppealNo);

      const selectedDocuments = tableData.filter(
        (doc) => doc.selected && doc.file,
      );

      if (selectedDocuments.length > 0) {
        const uploadResults = await Promise.all(
          selectedDocuments.map((doc) =>
            uploadDocument(
              applicationNo,
              generatedAppealNo,
              Number(appealType),
              doc,
            ),
          ),
        );

        const failedUploads = uploadResults.filter(
          (result) => result === false,
        ).length;

        if (failedUploads > 0) {
          throw new Error(`${failedUploads} document(s) failed to upload.`);
        }
      }

      await Swal.fire({
        title: "Success",
        text: `First Appeal submitted successfully. Appeal No: ${generatedAppealNo}`,
        confirmButtonColor: "#1e3a8a",
      });

      navigate("/app/FrmFirstAppeal", {
        state: {
          appealNo: generatedAppealNo,
          appNo: applicationNo,
        },
      });
    } catch (error) {
      console.error("Submit Appeal Error:", error);

      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Error while submitting First Appeal.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 lg:py-6"
          >
            <Card className="w-full border shadow-sm">
              <CardHeader className="border-b px-3 sm:px-5 md:px-6 py-3 sm:py-4">
                <CardTitle className="text-base sm:text-lg md:text-xl">
                  First Appeal Document Upload
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 sm:p-5 md:p-6 lg:p-7">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-5 lg:gap-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-150 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base sm:text-nowrap"
                          text="Date of application produced before Designated Officer for providing service"
                          required
                        />
                        <span className="hidden md:block">:</span>
                      </div>

                      <DatePicker
                        value={values.applicationDate}
                        onChange={(date) =>
                          setFieldValue("applicationDate", date)
                        }
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base text-nowrap"
                          text="Date of acknowledgement"
                          required
                        />

                        <span className="hidden md:block">:</span>
                      </div>

                      <DatePicker
                        value={values.acknowledgementDate}
                        onChange={(date) =>
                          setFieldValue("acknowledgementDate", date)
                        }
                        className="w-full h-9 sm:h-10"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base text-nowrap"
                          text="Date of production of document, if any"
                          required
                        />

                        <span className="hidden md:block">:</span>
                      </div>

                      <DatePicker
                        value={values.documentProductionDate}
                        onChange={(date) =>
                          setFieldValue("documentProductionDate", date)
                        }
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base text-nowrap"
                          text="Details of public service required"
                          required
                        />

                        <span className="hidden md:block">:</span>
                      </div>

                      <Input
                        name="publicServiceRequired"
                        value={values.publicServiceRequired}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base text-nowrap"
                          text="Decision of the Designated officer"
                          required
                        />

                        <span className="hidden md:block">:</span>
                      </div>

                      <Input
                        name="designatedOfficerDecision"
                        value={values.designatedOfficerDecision}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base text-nowrap"
                          text="Stipulated time limit"
                          required
                        />

                        <span className="hidden md:block">:</span>
                      </div>

                      <Input
                        name="stipulatedTimeLimit"
                        value={values.stipulatedTimeLimit}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base text-nowrap"
                          text="Relief sought"
                          required
                        />

                        <span className="hidden md:block">:</span>
                      </div>

                      <Input
                        name="reliefSought"
                        value={values.reliefSought}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-5 lg:gap-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-150 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base sm:text-nowrap"
                          text="Date of intimation of rejection of application received by the eligible person"
                          required
                        />

                        <span className="hidden md:block">:</span>
                      </div>

                      <DatePicker
                        value={values.rejectionIntimationDate}
                        onChange={(date) =>
                          setFieldValue("rejectionIntimationDate", date)
                        }
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-5 lg:gap-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-150 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base sm:text-nowrap"
                          text="Any other information necessary for filling appeal"
                          required
                        />

                        <span className="hidden md:block">:</span>
                      </div>

                      <Input
                        name="otherInformation"
                        value={values.otherInformation}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t mt-6 sm:mt-7 pt-5 sm:pt-6">
                  <ShadCNTable
                    headers={headers}
                    data={transformedTableData}
                    keyMapping={keyMapping}
                    pagination={false}
                    className="max-md:min-w-340"
                  />
                </div>

                <div className="mt-5">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <Input
                      type="checkbox"
                      name="declaration"
                      checked={values.declaration}
                      onChange={(e) =>
                        setFieldValue("declaration", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 cursor-pointer"
                    />

                    <span className="text-sm sm:text-base sm:text-nowrap">
                      The Particulars given above are true and correct to the
                      best of my knowledge, information and belief.
                    </span>
                  </label>
                </div>

                <div className="flex justify-center items-center gap-3 pt-6">
                  <Button
                    type="submit"
                    disabled={!values.declaration || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-100 hover:bg-gray-200 px-5"
                    onClick={() => navigate("/app/FrmFirstAppeal")}
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmFirstAppealDocUpload;
