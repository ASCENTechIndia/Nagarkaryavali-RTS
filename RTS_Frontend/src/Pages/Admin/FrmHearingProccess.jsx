import React, { useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/calendar";
import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const FrmHearingProcess = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [isSearching, setIsSearching] = useState(false);
  const [hearingData, setHearingData] = useState([]);
  const [showGrid, setShowGrid] = useState(false);

  const formatDateForApi = (date) => {
    if (!date) return "";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const headers = [
    "Application No",
    "Appeal Type",
    "Brief Details",
    "Appellant",
    "Respondent",
    "Select",
  ];

  const keyMapping = {
    "Application No": "APPNO",
    "Appeal Type": "APPEALTYPE",
    "Brief Details": "BRIEFDETAILS",
    "Appellant": "APPELLANT",
    "Respondent": "RESPONDENT",
    "Select": "action",
  };

  const columnStyles = {
    "Application No": { width: "12%" },
    "Appeal Type": { width: "15%" },
    "Brief Details": { width: "25%" },
    "Appellant": { width: "15%" },
    "Respondent": { width: "15%" },
    "Select": { width: "18%" },
  };

  const handleSubmit = async (values) => {
    try {
      setIsSearching(true);

      if (!values.fromDate || !values.toDate) {
        Swal.fire({
          text: "Please select From Date and To Date.",
        });
        setIsSearching(false);
        return;
      }

      const fromDate = new Date(values.fromDate);
      const toDate = new Date(values.toDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (fromDate > toDate) {
        Swal.fire({
          text: "To date should be greater than from date.",
        });
        setIsSearching(false);
        return;
      }

      if (fromDate > today) {
        Swal.fire({
          text: "From Date cannot be greater than System Date.",
        });
        setIsSearching(false);
        return;
      }

      const requestData = {
        fromDate: formatDateForApi(values.fromDate),
        toDate: formatDateForApi(values.toDate),
      };

      const API_URL = `${BASE_URL}/api/FrmHearingProccess/hearing-list`;

      const response = await axios.post(
        API_URL,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.ok && response.data?.data?.rows) {
        const rows = response.data.data.rows;
        
        if (rows.length > 0) {
          
          const formattedData = rows.map((item) => ({
            APPNO: item.APPNO || "-",
            APPEALNO: item.APPEALNO || "-",
            APPEALTYPE: item.APPEALTYPE || "-",
            BRIEFDETAILS: item.BRIEFDETAILS || item.BriefDetails || "-",
            APPELLANT: item.APPELLANT || "-",
            RESPONDENT: item.RESPONDENT || "-",
            APPEALID: item.APPEALID || item.appealid || "",
            HEARINGDT: item.HEARINGDT || item.hearingdt || "",
          }));
          
          setHearingData(formattedData);
          setShowGrid(true);
        } else {
          setHearingData([]);
          setShowGrid(false);
          Swal.fire({
            text: "Record Not Found",
          });
        }
      } else {
        setHearingData([]);
        setShowGrid(false);
        Swal.fire({
          text: response.data?.message || "Record Not Found",
        });
      }
    } catch (error) {
      console.error("Error fetching hearing data:", error);
      console.error("Error response:", error.response);

      setHearingData([]);
      setShowGrid(false);

      if (error.code === "ERR_NETWORK") {
        Swal.fire({
          text: "Cannot connect to server. Please check if the server is running.",
          confirmButtonColor: "#1e3a8a",
        });
      } else if (error.response?.status === 401) {
        Swal.fire({
          text: "Your session has expired. Please login again.",
          confirmButtonColor: "#1e3a8a",
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          text: error.response?.data?.message || error.response?.data?.error || "Something went wrong while fetching data.",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectClick = (row) => {
    
    localStorage.setItem("Appno", row.APPNO);
    localStorage.setItem("AppealNo", row.APPEALNO);
    localStorage.setItem("AppealTypeId", row.APPEALID || "");
    localStorage.setItem("AppealDate", row.HEARINGDT || "");
    
    navigate("/App/FrmAppealHearing_New");
  };

  const prepareTableData = () => {
    if (!hearingData || hearingData.length === 0) {
      return [];
    }
    
    return hearingData.map((row) => ({
      action: (
        <Button
          variant="link"
          size="sm"
          className="text-blue-700 hover:text-blue-900 px-0 font-medium"
          onClick={() => handleSelectClick(row)}
        >
          Select
        </Button>
      ),
      APPNO: row.APPNO || "-",
      APPEALTYPE: row.APPEALTYPE || "-",
      BRIEFDETAILS: row.BRIEFDETAILS || "-",
      APPELLANT: row.APPELLANT || "-",
      RESPONDENT: row.RESPONDENT || "-",
    }));
  };

  const tableRows = prepareTableData();

  return (
    <Formik
      initialValues={{
        fromDate: new Date(),
        toDate: new Date(),
      }}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold">
                  Hearing Process
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 sm:p-6 space-y-6">

                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label>From Date : </Label>
                    </div>
                    <DatePicker
                      value={values.fromDate}
                      onChange={(date) => setFieldValue("fromDate", date)}
                      className="w-full h-9"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label>To Date : </Label>
                    </div>
                    <DatePicker
                      value={values.toDate}
                      onChange={(date) => setFieldValue("toDate", date)}
                      className="w-full h-9"
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center gap-3">
                  <Button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white"
                    disabled={isSearching}
                  >
                    {isSearching ? "Searching..." : "Submit"}
                  </Button>
                </div>

                {showGrid && tableRows.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6"
                  >
                    <Card className="border">
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <ShadCNTable
                            headers={headers}
                            data={tableRows}
                            keyMapping={keyMapping}
                            columnStyles={columnStyles}
                            pagination={true}
                            rowsPerPage={10}
                            className="max-h-96"
                            tableClassName="min-w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmHearingProcess;