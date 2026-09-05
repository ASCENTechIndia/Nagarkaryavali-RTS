import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import * as XLSX from "xlsx";

const initialValues = {};

const FrmRTSOnlineCollDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useAuth();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const locationState = location.state || {};

  const toDate = locationState.toDate;
  const fromDate = locationState.fromDate;
  const deptId = locationState.deptId;
  const serviceId = locationState.serviceId;

  console.log(toDate, fromDate, deptId, serviceId);

  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [tableData, setTableData] = useState([]);

  const headers = [
    "Application No",
    "Name",
    "No. Of copy",
    "Amount",
    "Status",
    "Receipt No",
    "Online Ref No",
    "Receipt date",
    "Email Id",
    "Mobile No",
  ];

  const keyMapping = {
    "Application No": "appliNo",
    Name: "name",
    "No. Of copy": "noOfCopy",
    Amount: "amount",
    Status: "status",
    "Receipt No": "recNo",
    "Online Ref No": "onlineRefNo",
    "Receipt date": "receiptDate",
    "Email Id": "email",
    "Mobile No": "mobile",
  };

  const fetchApplicationDetails = async () => {
    try {
      setIsSearching(true);

      if (!fromDate || !toDate || !serviceId) {
        Swal.fire({
          title: "Missing Information",
          text: "From Date, To Date, Service ID are required.",
        });

        return;
      }

      const payload = {
        fromDate,
        toDate,
        serviceId: Number(serviceId),
        deptId: Number(deptId),
      };

      console.log("Applications Detail Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmRTSOnlineColl/applications-detail`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Applications Detail Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        const apiData = response.data?.data?.data || [];

        const formattedData = apiData.map((row) => ({
          appliNo: row.APPNO,
          name: row.NAME,
          noOfCopy: row.NOOFCOPY,
          amount: row.AMOUNT,
          status: row.STATUS,
          recNo: row.RECNO,
          onlineRefNo: row.BILLDESK_REFNO,
          receiptDate: row.RECDATE ? formatDateTime(row.RECDATE) : "",
          email: row.EMAILID,
          mobile: row.MOBNO,
        }));

        setTableData(formattedData);

        if (formattedData.length === 0) {
          Swal.fire({
            title: "No Data Found",
            text: "No application details found for the selected criteria.",
          });
        }
      } else {
        setTableData([]);

        Swal.fire({
          title: "Error",
          text:
            response.data?.message || "Failed to fetch application details.",
        });
      }
    } catch (error) {
      console.error("Applications Detail API Error:", error);

      setTableData([]);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to fetch application details.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return dateValue;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");

    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, []);

  const exportToExcel = () => {
    if (!tableData || tableData.length === 0) {
      Swal.fire({
        title: "No Data",
        text: "There is no data available to export.",
      });

      return;
    }

    const excelData = tableData.map((row) => ({
      "Application No": row.appliNo || "",
      Name: row.name || "",
      "No. Of copy": row.noOfCopy || "",
      Amount: row.amount || "",
      Status: row.status || "",
      "Receipt No": row.recNo || "",
      "Online Ref No": row.onlineRefNo || "",
      "Receipt date": row.receiptDate || "",
      "Email Id": row.email || "",
      "Mobile No": row.mobile || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 25 },
      { wch: 12 },
      { wch: 12 },
      { wch: 18 },
      { wch: 22 },
      { wch: 22 },
      { wch: 22 },
      { wch: 35 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "RTS Online Collection");

    XLSX.writeFile(
      workbook,
      `RTS_Online_Collection_Details_${fromDate}_${toDate}.xlsx`,
    );
  };

  const exportToPDF = async () => {
    try {
      setLoading(true);

      if (!fromDate || !toDate || !deptId || !serviceId) {
        Swal.fire({
          title: "Missing Information",
          text: "From Date, To Date, Service ID and Department ID are required.",
        });

        return;
      }

      const payload = {
        fromDate,
        toDate,
        serviceId: Number(serviceId),
        deptId: Number(deptId),
      };

      console.log("PDF Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmRTSOnlineColl/generate-applications-detail-pdf`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("PDF API Response:", response.data);

      if (response.data?.success) {
        const pdfUrl = response.data?.pdfUrl;

        if (pdfUrl) {
          const finalPdfUrl = `${pdfUrl}`;

          console.log("Final PDF URL:", finalPdfUrl);

          window.open(finalPdfUrl, "_blank");
        } else {
          Swal.fire({
            title: "PDF Error",
            text: "PDF URL was not returned by the server.",
          });
        }
      } else {
        Swal.fire({
          title: "PDF Generation Failed",
          text: response.data?.message || "Failed to generate PDF.",
        });
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);

      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to generate PDF.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    console.log("submit");
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {() => (
        <Form>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >
            <Card className="border shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold">
                  RTS Online Collection Details
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex justify-end items-center gap-3 px-3">
                  <Button
                    type="button"
                    onClick={exportToExcel}
                    disabled={isSearching || tableData.length === 0}
                    className="text-white"
                  >
                    {isSearching ? "Loading..." : "Export to Excel"}
                  </Button>

                  <Button
                    type="button"
                    onClick={exportToPDF}
                    disabled={loading}
                    className="text-white"
                  >
                    {loading ? "Generating..." : "Export to PDF"}
                  </Button>
                </div>

                <div className="overflow-x-auto px-3">
                  <ShadCNTable
                    headers={headers}
                    data={tableData}
                    keyMapping={keyMapping}
                    pagination={false}
                    className="max-md:min-w-380"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmRTSOnlineCollDetails;
