import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { DatePicker } from "@/components/ui/calendar";
import { Input } from "@base-ui/react";

const initialValues = { hearingDate: new Date() };

const FrmHearingDateAssign = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { token, user } = useAuth();

  const userId = user?.username;
  const ulbId = Number(user?.ulbId);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const locationState = location.state || {};

  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [tableData, setTableData] = useState([]);

  const fetchHearingProcessList = async () => {
    try {
      setIsSearching(true);

      const response = await axios.post(
        `${BASE_URL}/api/FrmHearingDateAssign/hearing-process-list`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Hearing Process List Response:", response.data);

      if (response.data?.success && response.data?.data) {
        const apiData = response.data.data || [];

        const formattedData = apiData.map((row) => ({
          appliNo: row.APPNO,
          appealNo: row.APPEALNO,
          appealType: row.APPEALTYPE,
          briefDetails: row.BRIEFDETAILS,
          appellant: row.APPELLANT,
          respondent: row.RESPONDENT,
          appealDate: row.APPEALDATE,
          appealId: row.APPEALID,
          selected: false,
          hearingDate: null,
        }));

        setTableData(formattedData);

        if (formattedData.length === 0) {
          Swal.fire({
            title: "No Data Found",
            text: "No hearing process records found.",
          });
        }
      } else {
        setTableData([]);

        Swal.fire({
          title: "Error",
          text:
            response.data?.message || "Failed to fetch hearing process list.",
        });
      }
    } catch (error) {
      console.error("Hearing Process List API Error:", error);

      setTableData([]);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to fetch hearing process list.",
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
    fetchHearingProcessList();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const selectedRows = tableData.filter((row) => row.selected);

      if (selectedRows.length === 0) {
        Swal.fire({
          title: "Select Record",
          text: "Please select at least one application.",
        });
        return;
      }

      const rowsWithoutHearingDate = selectedRows.filter(
        (row) => !row.hearingDate,
      );

      if (rowsWithoutHearingDate.length > 0) {
        Swal.fire({
          title: "Hearing Date Required",
          text: "Please select hearing date for all selected applications.",
        });
        return;
      }

      const formatDateForProcedure = (dateValue) => {
        if (!dateValue) return "";

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
          return "";
        }

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
      };

      const inStr = selectedRows
        .map((row) => {
          const appealDate = formatDateForProcedure(row.appealDate);
          const hearingDate = formatDateForProcedure(row.hearingDate);

          return [
            appealDate,
            row.appliNo || "",
            row.appealNo || "",
            row.appealType || "",
            row.briefDetails || "",
            hearingDate,
            row.appealId || "",
          ].join("$");
        })
        .join("#");

      const payload = {
        userId: userId,
        ulbId: ulbId,
        in_str: inStr,
      };

      console.log("Assign Hearing Date Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmHearingDateAssign/assign-hearing-date`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Assign Hearing Date Response:", response.data);

      if (response.data?.success) {
        await Swal.fire({
          title: "Success",
          text: response.data?.message || "Hearing date assigned successfully.",
        });

        setTableData((prev) => prev.filter((row) => !row.selected));

        navigate("/App/FrmHearingDateAssign");
      } else {
        Swal.fire({
          title: "Error",
          text: response.data?.message,
        });
      }
    } catch (error) {
      console.error("Assign Hearing Date API Error:", error);

      Swal.fire({
        title: "Error",
        text: error.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
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
                  Hearing Date Assign
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="overflow-x-auto px-3">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#0d4f91] text-white">
                        <th className="border border-gray-400 px-2 py-2 text-center font-semibold">
                          Select
                        </th>

                        <th className="border border-gray-400 px-2 py-2 text-left font-semibold">
                          Application No
                        </th>

                        <th className="border border-gray-400 px-2 py-2 text-left font-semibold">
                          Appeal Date
                        </th>

                        <th className="border border-gray-400 px-2 py-2 text-left font-semibold">
                          Objection Type
                        </th>

                        <th className="border border-gray-400 px-2 py-2 text-left font-semibold">
                          Brief Details
                        </th>

                        <th className="border border-gray-400 px-2 py-2 text-left font-semibold">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {tableData.length > 0 ? (
                        tableData.map((row, index) => (
                          <tr
                            key={row.appealId || row.appliNo || index}
                            className="bg-white"
                          >
                            <td className="border border-gray-400 px-2 py-2 text-center">
                              <Input
                                type="checkbox"
                                checked={row.selected || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;

                                  setTableData((prev) =>
                                    prev.map((item, i) =>
                                      i === index
                                        ? {
                                            ...item,
                                            selected: checked,
                                          }
                                        : item,
                                    ),
                                  );
                                }}
                                className="h-4 w-4 cursor-pointer"
                              />
                            </td>

                            <td className="border border-gray-400 px-2 py-2">
                              {row.appliNo}
                            </td>

                            <td className="border border-gray-400 px-2 py-2 whitespace-nowrap">
                              {formatDateTime(row.appealDate)}
                            </td>

                            <td className="border border-gray-400 px-2 py-2">
                              {row.appealType || ""}
                            </td>

                            <td className="border border-gray-400 px-2 py-2">
                              {row.briefDetails || ""}
                            </td>

                            <td className="border border-gray-400 px-2 py-2 min-w-[180px]">
                              <DatePicker
                                value={row.hearingDate}
                                onChange={(date) => {
                                  setTableData((prev) =>
                                    prev.map((item, i) =>
                                      i === index
                                        ? {
                                            ...item,
                                            hearingDate: date,
                                          }
                                        : item,
                                    ),
                                  );
                                }}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={9}
                            className="border border-gray-400 px-3 py-5 text-center text-gray-500"
                          >
                            {isSearching ? "Loading..." : "No data found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white"
                    disabled={loading || isSearching}
                  >
                    {isSearching ? "Searching..." : "Submit"}
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

export default FrmHearingDateAssign;
