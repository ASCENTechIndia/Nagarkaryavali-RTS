import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ShadCNTable from "@/components/ui/table";

import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const initialValues = {
  serviceId: "",
  fromDate: new Date().toISOString().split("T")[0],
  toDate: new Date().toISOString().split("T")[0],
  zoneId: "",
  appliNo: "",
  mobileNo: "",
};

const formatDateForFormik = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseFormikDate = (dateString) => {
  if (!dateString) return undefined;

  const date = new Date(`${dateString}T00:00:00`);

  return Number.isNaN(date.getTime()) ? undefined : date;
};

const formatApiDate = (dateValue) => {
  if (!dateValue) return "";

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const formatDisplayDate = (value) => {
  if (!value) return "-";

  if (typeof value === "string" && /^\d{2}-[A-Z]{3}-\d{2,4}$/i.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
};

const getMimeType = (extension = "") => {
  const ext = String(extension).toLowerCase();

  const mimeTypes = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".txt": "text/plain",
  };

  return mimeTypes[ext] || "application/octet-stream";
};

const FrmAppliReportEMst = () => {
  const { token } = useAuth();

  const [services, setServices] = useState([]);
  const [zones, setZones] = useState([]);

  const [loadingMasters, setLoadingMasters] = useState(false);

  const [reportData, setReportData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);

  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState(null);

  const [documentData, setDocumentData] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const axiosConfig = useMemo(
    () => ({
      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }),
    [token],
  );

  const fetchServiceList = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/FrmAppliReportEMst/service-list`,
        axiosConfig,
      );

      const data = response?.data?.data?.data || [];

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Service List Error:", error);

      setServices([]);
    }
  };

  const fetchZoneList = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/FrmAppliReportEMst/zone-list`,
        axiosConfig,
      );

      const data = response?.data?.data?.data || [];

      setZones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Zone List Error:", error);

      setZones([]);
    }
  };

  useEffect(() => {
    const loadMasters = async () => {
      setLoadingMasters(true);

      try {
        await Promise.allSettled([fetchServiceList(), fetchZoneList()]);
      } finally {
        setLoadingMasters(false);
      }
    };

    loadMasters();
  }, []);

  const reportHeaders = [
    "Select",
    "Service Name",
    "Application No",
    "Applicant Name",
    "Mobile No.",
    "Applicant Address",
    "Receipt No",
    "Receipt Date",
    "Amount",
    "Department Name",
    "Date",
    "Authorization Date",
    "Service Delivery Time",
    "Service Tat",
  ];

  const reportKeyMapping = {
    Select: "select",
    "Service Name": "serviceName",
    "Application No": "applicationNo",
    "Applicant Name": "applicantName",
    "Mobile No.": "mobileNo",
    "Applicant Address": "applicantAddress",
    "Receipt No": "receiptNo",
    "Receipt Date": "receiptDate",
    Amount: "amount",
    "Department Name": "departmentName",
    Date: "applicationDate",
    "Authorization Date": "authorizationDate",
    "Service Delivery Time": "serviceDeliveryTime",
    "Service Tat": "serviceTat",
  };

  const reportColumnStyles = {
    Select: {
      width: "80px",
      minWidth: "80px",
    },

    "Service Name": {
      width: "170px",
      minWidth: "170px",
    },

    "Application No": {
      width: "180px",
      minWidth: "180px",
    },

    "Applicant Name": {
      width: "180px",
      minWidth: "180px",
    },

    "Mobile No.": {
      width: "130px",
      minWidth: "130px",
    },

    "Applicant Address": {
      width: "180px",
      minWidth: "180px",
    },

    "Receipt No": {
      width: "150px",
      minWidth: "150px",
    },

    "Receipt Date": {
      width: "130px",
      minWidth: "130px",
    },

    Amount: {
      width: "100px",
      minWidth: "100px",
    },

    "Department Name": {
      width: "150px",
      minWidth: "150px",
    },

    Date: {
      width: "120px",
      minWidth: "120px",
    },

    "Authorization Date": {
      width: "170px",
      minWidth: "170px",
    },

    "Service Delivery Time": {
      width: "160px",
      minWidth: "160px",
    },

    "Service Tat": {
      width: "100px",
      minWidth: "100px",
    },
  };

  const documentHeaders = ["Document Name", "Document Upload By", "View"];

  const documentKeyMapping = {
    "Document Name": "documentName",
    "Document Upload By": "documentType",
    View: "view",
  };

  const documentColumnStyles = {
    "Document Name": {
      width: "55%",
    },

    "Document Upload By": {
      width: "25%",
    },

    View: {
      width: "20%",
    },
  };

  const handleSubmit = async (values) => {
    setLoadingReport(true);
    setReportData([]);

    Swal.fire({
      title: "Loading...",
      text: "Please wait while fetching applicant report.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const payload = {
        serviceId: values.serviceId || "",
        fromDate: formatApiDate(values.fromDate),
        toDate: formatApiDate(values.toDate),
        zoneId: values.zoneId || "",
        appliNo: values.appliNo?.trim() || "",
        mobileNo: values.mobileNo?.trim() || "",
      };

      console.log("Applicant Report Payload:", payload);

      const response = await axios.post(
        `${API_BASE_URL}/api/FrmAppliReportEMst/report`,
        payload,
        axiosConfig,
      );

      const responseData = response?.data?.data?.data || [];

      const mappedData = Array.isArray(responseData)
        ? responseData.map((item, index) => ({
            id: `${item.APPNO || index}-${index}`,

            serviceId: item.SERVICEID,

            serviceName: item.SERVICENAME || "-",

            applicationNo: item.APPNO || "-",

            applicantName: item.APLINAME || "-",

            mobileNo: item.MOBILENO || "-",

            applicantAddress: item.ADDRESS || "-",

            receiptNo: item.RECIEPTNO || "-",

            receiptDate: formatDisplayDate(item.RECIEPTDATE),

            amount: item.AMOUNT ?? "-",

            departmentName: item.DEPTNAME || "-",

            applicationDate: item.APPLIDATE || "-",

            authorizationDate: formatDisplayDate(item.AUTHDATE),

            serviceDeliveryTime: item.SERVICE_DELIVERY_TIME ?? "-",

            serviceTat: item.SERVICE_TAT ?? "-",

            select: (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="
                  h-auto
                  px-1
                  py-1
                  font-semibold
                  text-[#083c76]
                  hover:bg-transparent
                  hover:text-blue-900
                "
                onClick={() => handleSelectApplication(item)}
              >
                Select
              </Button>
            ),
          }))
        : [];

      Swal.close();

      setReportData(mappedData);

      if (mappedData.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Records",
          text: "No applicant records found.",
        });
      }
    } catch (error) {
      console.error("Applicant Report Error:", error);

      Swal.close();

      setReportData([]);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message || "Failed to fetch applicant report.",
      });
    } finally {
      setLoadingReport(false);
    }
  };

  const handleExportToExcel = () => {
    if (!reportData || reportData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data Found",
        text: "There is no table data available to export.",
      });

      return;
    }

    const excelData = reportData.map((row, index) => ({
      "Sr. No.": index + 1,
      "Service Name": row.SERVICENAME || "",
      "Application No.": row.APPNO || "",
      "Applicant Name": row.APLINAME || "",
      "Mobile No.": row.MOBILENO || "",
      Address: row.ADDRESS || "",
      "Receipt No.": row.RECIEPTNO || "",
      "Receipt Date": row.RECIEPTDATE || "",
      Amount: row.AMOUNT ?? "",
      Department: row.DEPTNAME || "",
      "Application Date": row.APPLIDATE || "",
      "Authorization Date": row.AUTHDATE
        ? new Date(row.AUTHDATE).toLocaleDateString("en-IN")
        : "",
      "Service Delivery Time": row.SERVICE_DELIVERY_TIME ?? "",
      "Maximum Days": row.NUM_SERVICE_MAXDAYS ?? "",
      Status: row.VAR_APPLICATION_STATUS || "",
      "Service TAT": row.SERVICE_TAT ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 40 },
      { wch: 25 },
      { wch: 35 },
      { wch: 16 },
      { wch: 40 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
      { wch: 25 },
      { wch: 18 },
      { wch: 20 },
      { wch: 22 },
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicant Report");

    XLSX.writeFile(
      workbook,
      `Applicant_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  // ============================================================
  // SELECT APPLICATION

  const handleSelectApplication = async (application) => {
    setSelectedApplication(application);
    setDocumentData([]);
    setShowDocumentModal(true);

    await fetchDocuments(application);
  };

  const fetchDocuments = async (application) => {
    setLoadingDocuments(true);

    try {
      const payload = {
        appliNo: application.APPNO || "",
        authMode: "HO",
      };

      console.log("Document Payload:", payload);

      const response = await axios.post(
        `${API_BASE_URL}/api/FrmAppliReportEMst/documents`,
        payload,
        axiosConfig,
      );

      const responseData = response?.data?.data?.data || [];

      const mappedDocuments = Array.isArray(responseData)
        ? responseData.map((document, index) => ({
            id: document.DOCID || index,

            documentName: document.DOCNAME || document.FILENAME || "-",

            documentType: document.DOCTYPE || "-",

            fileBytes: document.FILEBYTES || "",

            fileExtension: document.FILEEXTENSION || "",

            fileName: document.FILENAME || document.DOCNAME || "document",

            verifyFlag: document.VRFYFLAG || "",

            view: (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="
                  h-auto
                  px-1
                  py-1
                  font-semibold
                  text-[#083c76]
                  hover:bg-transparent
                  hover:text-blue-900
                "
                onClick={() => handleViewDocument(document)}
              >
                View
              </Button>
            ),
          }))
        : [];

      setDocumentData(mappedDocuments);
    } catch (error) {
      console.error("Document Fetch Error:", error);

      setDocumentData([]);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed to fetch application documents.",
      });
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleViewDocument = (document) => {
    try {
      let fileBytes = document.FILEBYTES || document.fileBytes || "";

      const extension =
        document.FILEEXTENSION || document.fileExtension || ".pdf";

      if (!fileBytes) {
        Swal.fire({
          icon: "warning",
          title: "Document Not Available",
          text: "No document data was received from the server.",
        });

        return;
      }

      fileBytes = String(fileBytes)
        .replace(/^data:.*?;base64,/i, "")
        .replace(/[\r\n\s]/g, "")
        .trim();

      if (!fileBytes) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Document",
          text: "Document data is empty.",
        });

        return;
      }

      const newWindow = window.open("", "_blank");

      if (!newWindow) {
        Swal.fire({
          icon: "warning",
          title: "Popup Blocked",
          text: "Please allow popups to view the document.",
        });

        return;
      }

      const binaryString = window.atob(fileBytes);

      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const mimeType = getMimeType(extension);

      const blob = new Blob([bytes], {
        type: mimeType,
      });

      console.log("Document Details:", {
        extension,
        mimeType,
        base64Length: fileBytes.length,
        blobSize: blob.size,
        firstBytes: Array.from(bytes.slice(0, 10)),
      });

      if (extension.toLowerCase() === ".pdf") {
        const pdfHeader = new TextDecoder().decode(bytes.slice(0, 4));

        console.log("PDF Header:", pdfHeader);

        if (pdfHeader !== "%PDF") {
          newWindow.close();

          Swal.fire({
            icon: "error",
            title: "Invalid PDF Data",
            html: `
            The API returned document data, but it is not a valid PDF file.<br/><br/>
            <b>Expected:</b> %PDF<br/>
            <b>Received:</b> ${pdfHeader || "Unknown"}
          `,
          });

          return;
        }
      }

      const documentUrl = URL.createObjectURL(blob);

      // Open actual document
      newWindow.location.href = documentUrl;
    } catch (error) {
      console.error("Document View Error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Open Document",
        text: error?.message || "The document data could not be opened.",
      });
    }
  };

  const handleCloseModal = () => {
    setShowDocumentModal(false);
    setSelectedApplication(null);
    setDocumentData([]);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, handleChange, setFieldValue, resetForm }) => (
        <Form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-3 sm:p-4 md:p-5"
          >
            <Card className="border shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold">
                  Applicant Information / अर्जदाराची माहिती
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {/* SERVICE TYPE */}
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex shrink-0 items-center sm:w-36">
                      <Label text="Service Type:" required />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Select
                        value={
                          values.serviceId ? String(values.serviceId) : "ALL"
                        }
                        onValueChange={(value) =>
                          setFieldValue(
                            "serviceId",
                            value === "ALL" ? "" : value,
                          )
                        }
                        disabled={loadingMasters}
                      >
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue
                            placeholder={
                              loadingMasters
                                ? "Loading services..."
                                : "-- ALL --"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent
                          position="popper"
                          sideOffset={4}
                          showDefaultOption={false}
                          className="
      z-[99999]
      max-h-72
      min-w-[var(--radix-select-trigger-width)]
      w-[var(--radix-select-trigger-width)]
      overflow-y-auto
    "
                        >
                          <SelectItem value="ALL">-- ALL --</SelectItem>

                          {services
                            .filter((service) => {
                              const serviceName = String(
                                service?.SERVICENAME || "",
                              )
                                .replace(/[\s-]+/g, "")
                                .toLowerCase();

                              return (
                                service?.SERVICEID !== undefined &&
                                service?.SERVICEID !== null &&
                                serviceName !== "" &&
                                serviceName !== "selectoption"
                              );
                            })
                            .map((service) => (
                              <SelectItem
                                key={service.SERVICEID}
                                value={String(service.SERVICEID)}
                                className="whitespace-normal break-words py-2"
                              >
                                {service.SERVICENAME}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* FROM DATE */}
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex shrink-0 items-center sm:w-36">
                      <Label text="From Date:" required />
                    </div>

                    <div className="min-w-0 flex-1">
                      <DatePicker
                        value={parseFormikDate(values.fromDate)}
                        onChange={(date) => {
                          setFieldValue("fromDate", formatDateForFormik(date));
                        }}
                        className="h-9 w-full"
                      />
                    </div>
                  </div>

                  {/* TO DATE */}
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex shrink-0 items-center sm:w-36">
                      <Label text="To Date:" required />
                    </div>

                    <div className="min-w-0 flex-1">
                      <DatePicker
                        value={parseFormikDate(values.toDate)}
                        onChange={(date) => {
                          setFieldValue("toDate", formatDateForFormik(date));
                        }}
                        className="h-9 w-full"
                      />
                    </div>
                  </div>

                  {/* MOBILE NUMBER */}
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex shrink-0 items-center sm:w-36">
                      <Label text="Mobile No:" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Input
                        type="text"
                        name="mobileNo"
                        value={values.mobileNo}
                        onChange={(event) => {
                          const numericValue = event.target.value.replace(
                            /\D/g,
                            "",
                          );

                          setFieldValue("mobileNo", numericValue);
                        }}
                        maxLength={10}
                        placeholder="Enter Mobile Number"
                        className="h-9 w-full"
                      />
                    </div>
                  </div>

                  {/* APPLICATION NUMBER */}
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex shrink-0 items-center sm:w-36">
                      <Label text="Application No:" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Input
                        type="text"
                        name="appliNo"
                        value={values.appliNo}
                        onChange={handleChange}
                        placeholder="Enter Application No"
                        className="h-9 w-full"
                      />
                    </div>
                  </div>

                  {/* ZONE */}
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex shrink-0 items-center sm:w-36">
                      <Label text="Zone:" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Select
                        value={values.zoneId ? String(values.zoneId) : "ALL"}
                        onValueChange={(value) =>
                          setFieldValue("zoneId", value === "ALL" ? "" : value)
                        }
                        disabled={loadingMasters}
                      >
                        <SelectTrigger className="w-full  h-9">
                          <SelectValue
                            placeholder={
                              loadingMasters ? "Loading zones..." : "ALL"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent showDefaultOption={false}>
                          <SelectItem value="ALL">--ALL--</SelectItem>

                          {zones.map((zone) => (
                            <SelectItem
                              key={zone.ZONEID}
                              value={String(zone.ZONEID)}
                            >
                              {zone.ZONENAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col items-center justify-center gap-3 border-t pt-5 sm:flex-row">
                  <Button
                    type="submit"
                    disabled={loadingReport || loadingMasters}
                  >
                    {loadingReport ? "Loading..." : "Submit"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={loadingReport}
                    onClick={() => {
                      resetForm();
                      setReportData([]);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {reportData.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-end">
                  <Button
                    type="button"
                    onClick={handleExportToExcel}
                    className="flex h-9 items-center gap-2"
                  >
                    Export to Excel
                  </Button>
                </div>

                {/* Existing Table */}
                <div className="overflow-x-auto rounded-md border">
                  {/* Your existing table component */}
                </div>
              </div>
            )}

            <AnimatePresence>
              {reportData.length > 0 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="mt-5"
                >
                  <ShadCNTable
                    headers={reportHeaders}
                    data={reportData}
                    keyMapping={reportKeyMapping}
                    columnStyles={reportColumnStyles}
                    pagination={true}
                    rowsPerPage={10}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showDocumentModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="
                    fixed
                    inset-0
                    z-50
                    flex
                    items-center
                    justify-center
                    bg-black/50
                    p-4
                  "
                  onClick={handleCloseModal}
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.96,
                      y: 15,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="w-full max-w-5xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Card
                      className="
                        max-h-[85vh]
                        overflow-hidden
                        border
                        shadow-2xl
                      "
                    >
                      {/* MODAL HEADER */}

                      <CardHeader
                        className="
                          flex
                          flex-row
                          items-center
                          justify-between
                          border-b
                          bg-[#083c76]
                          px-4
                          py-3
                        "
                      >
                        <div>
                          <CardTitle className="text-base font-semibold text-white">
                            Application Documents
                          </CardTitle>

                          {selectedApplication && (
                            <p className="mt-1 text-xs text-blue-100">
                              Application No : {selectedApplication.APPNO}
                            </p>
                          )}
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleCloseModal}
                          className="
                            text-lg
                            text-white
                            hover:bg-white/20
                            hover:text-white
                          "
                        >
                          ✕
                        </Button>
                      </CardHeader>

                      {/* MODAL CONTENT */}

                      <CardContent className="max-h-[70vh] overflow-auto p-4">
                        {loadingDocuments ? (
                          <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                              <div
                                className="
                                  mx-auto
                                  h-9
                                  w-9
                                  animate-spin
                                  rounded-full
                                  border-2
                                  border-gray-300
                                  border-t-[#083c76]
                                "
                              />

                              <p className="mt-3 text-sm text-gray-500">
                                Loading documents...
                              </p>
                            </div>
                          </div>
                        ) : (
                          <ShadCNTable
                            headers={documentHeaders}
                            data={documentData}
                            keyMapping={documentKeyMapping}
                            columnStyles={documentColumnStyles}
                            pagination={false}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmAppliReportEMst;
