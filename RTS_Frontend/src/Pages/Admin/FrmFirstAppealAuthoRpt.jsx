import React, { useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { DatePicker } from "@/components/ui/calendar";

const initialValues = {
  fromDate: new Date(),
  toDate: new Date(),
};

const FrmFirstAppealAuthoRpt = () => {
  const { token } = useAuth();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const formatDateForApi = (date) => {
    if (!date) return "";

    const d = new Date(date);

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

    const day = String(d.getDate()).padStart(2, "0");
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (values) => {
    try {
      setIsSearching(true);

      if (!values.fromDate || !values.toDate) {
        Swal.fire({
          title: "Required",
          text: "Please select From Date and To Date.",
        });
        return;
      }

      const fromDate = new Date(values.fromDate);
      const toDate = new Date(values.toDate);

      if (fromDate > toDate) {
        Swal.fire({
          title: "Invalid Date",
          text: "From Date cannot be greater than To Date.",
        });
        return;
      }

      const requestData = {
        fromDate: formatDateForApi(values.fromDate),
        toDate: formatDateForApi(values.toDate),
      };

      console.log("PDF API Request:", requestData);

      const response = await axios.post(
        `${BASE_URL}/api/FrmFirstAppealAuthoRpt/appeal-report-pdf`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("PDF API Response:", response.data);

      if (response.data?.success && response.data?.pdfUrl) {
        // Convert localhost PDF URL to BASE_URL if required
        let pdfUrl = response.data.pdfUrl;

        window.open(pdfUrl, "_blank");

        Swal.fire({
          title: "Success",
          text: response.data.message || "PDF Generated Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "PDF Generation Failed",
          text: response.data?.message || "Unable to generate PDF.",
        });
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong while generating the PDF.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
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
                   First Appeal Authority Report
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 sm:p-6 space-y-6">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label>From Date</Label>
                      <span>:</span>
                    </div>

                    <DatePicker
                      value={values.fromDate}
                      onChange={(date) => setFieldValue("fromDate", date)}
                      className="w-full h-9"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label>To Date</Label>
                      <span>:</span>
                    </div>

                    <DatePicker
                      value={values.toDate}
                      onChange={(date) => setFieldValue("toDate", date)}
                      className="w-full h-9"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex justify-center items-center gap-3">
                  <Button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white"
                    disabled={loading || isSearching}
                  >
                    {isSearching ? "Generating PDF..." : "Submit"}
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

export default FrmFirstAppealAuthoRpt;
