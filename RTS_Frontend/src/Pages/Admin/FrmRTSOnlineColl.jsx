import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { DatePicker } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";


const initialValues = {
  fromDate: new Date(),
  toDate: new Date(),
  department: "",
};

const FrmRTSOnlineColl = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [departments, setDepartments] = useState([]);

  const headers = ["Service Name", "Amount", "App Count"];

  const keyMapping = {
    "Service Name": "serviceName",
    Amount: "amount",
    "App Count": "appCount",
  };

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/api/FrmRTSOnlineColl/departments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Departments API Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        setDepartments(response.data.data.departments || []);
      } else {
        setDepartments([]);

        Swal.fire({
          title: "Error",
          text: response.data?.message || "Failed to fetch departments",
        });
      }
    } catch (error) {
      console.error("Department API Error:", error);

      setDepartments([]);

      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch departments",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsSummary = async (values) => {
    try {
      setIsSearching(true);

      if (!values.fromDate) {
        Swal.fire({
          title: "From Date Required",
          text: "Please select From Date",
        });

        return;
      }

      if (!values.toDate) {
        Swal.fire({
          title: "To Date Required",
          text: "Please select To Date",
        });

        return;
      }

      const payload = {
        fromDate: formatDate(values.fromDate),
        toDate: formatDate(values.toDate),
        deptId: Number(values.department) || -1,
      };

      console.log("Applications Summary Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmRTSOnlineColl/applications-summary`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Applications Summary Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        const summary = response.data?.data?.summary || [];

        setTableData(summary);

        if (summary.length === 0) {
          Swal.fire({
            title: "No Data Found",
            text: "No application summary found for the selected criteria.",
          });
        }
      } else {
        setTableData([]);

        Swal.fire({
          title: "Error",
          text: response.data?.message || "Failed to fetch application summary",
        });
      }
    } catch (error) {
      console.error("Applications Summary API Error:", error);

      setTableData([]);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to fetch application summary",
      });
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (values) => {
    console.log("Form Values:", values);

    await fetchApplicationsSummary(values);
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
                  RTS Online Collection
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 sm:p-6 space-y-6">
                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 py-3 px-3">
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

                  {/* TO DATE */}
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

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label>Department</Label>
                      <span>:</span>
                    </div>

                    <Select
                      value={values.department}
                      onValueChange={(value) =>
                        setFieldValue("department", value)
                      }
                    >
                      <SelectTrigger className="w-full border rounded-md">
                        <SelectValue placeholder="-- Select Department --" />
                      </SelectTrigger>

                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem
                            key={department.deptId}
                            value={String(department.deptId)}
                          >
                            {department.deptName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <hr />

                {tableData.length > 0 && (
                  <div className="overflow-x-auto px-3">
                    <ShadCNTable
                      headers={headers}
                      data={tableData.map((row) => ({
                        ...row,
                        appCount: (
                          <button
                            type="button"
                            onClick={() => {
                              navigate("/app/Reports/FrmRTSOnlineCollDetails", {
                                state: {
                                  fromDate: formatDate(values.fromDate),
                                  toDate: formatDate(values.toDate),
                                  deptId: Number(values.department),
                                  serviceId: row.serviceId,
                                },
                              });
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer"
                          >
                            {row.appCount}
                          </button>
                        ),
                      }))}
                      keyMapping={keyMapping}
                      pagination={false}
                      className="max-md:min-w-380"
                    />
                  </div>
                )}

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

export default FrmRTSOnlineColl;
