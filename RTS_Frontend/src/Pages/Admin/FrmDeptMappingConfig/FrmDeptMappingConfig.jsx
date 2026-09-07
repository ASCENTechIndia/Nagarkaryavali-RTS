import React, { useEffect, useState } from "react";

import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import config from "@/utils/config";
import getIPAddress from "@/utils/ipHelper";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ShadCNTable from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";

const baseUrl = import.meta.env.VITE_BASE_URL;

const FrmDeptMappingConfig = () => {
  const { user, token } = useAuth();

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [initialLoading, setInitialLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);

  const ulbid = user?.ulbId || user?.ulbid;

  const loginUserId = user?.userId || user?.userid || user?.USERID;

  const initialValues = {
    userId: "",
    selectedDepartments: [],
  };

  const getUserDropdown = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/FrmMappingConfig/user-dropdown`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(response?.data?.data?.data || []);
    } catch (error) {
      console.error("User Dropdown Error:", error);

      setUsers([]);

      throw error;
    }
  };

  const getDepartmentDropdown = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/FrmDeptMappingConfig/department-dropdown`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDepartments(response?.data?.data?.data || []);
    } catch (error) {
      console.error("Department Dropdown Error:", error);

      setDepartments([]);

      throw error;
    }
  };

  useEffect(() => {
    if (!token) return;

    const loadInitialData = async () => {
      setInitialLoading(true);

      Swal.fire({
       
        text: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const results = await Promise.allSettled([
          getUserDropdown(),
          getDepartmentDropdown(),
        ]);

        const rejected = results.find((result) => result.status === "rejected");

        if (rejected) {
          console.error("Initial Load Error:", rejected.reason);

          Swal.fire({
            // icon: "error",
            text:
              rejected.reason?.response?.data?.message ||
              "Failed to load page data",
            confirmButtonColor: "#083c76",
          });
        } else {
          Swal.close();
        }
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, [token]);

  const getUserDepartmentConfig = async (selectedUserId, setFieldValue) => {
    if (!selectedUserId) {
      setFieldValue("selectedDepartments", []);
      return;
    }

    setConfigLoading(true);

    try {
      const response = await axios.get(
        `${baseUrl}/api/FrmDeptMappingConfig/user-department-config`,
        {
          params: {
            userId: selectedUserId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const configData = response?.data?.data?.data || [];

      const selectedDepartmentIds = configData
        .map((item) => Number(item.DEPTID))
        .filter(Boolean);

      setFieldValue("selectedDepartments", selectedDepartmentIds);
    } catch (error) {
      console.error("User Department Config Error:", error);

      setFieldValue("selectedDepartments", []);

      // If no configuration exists, keep all unchecked.
      if (error?.response?.status !== 404) {
        Swal.fire({
          // icon: "error",
          text:
            error?.response?.data?.message ||
            "Failed to load user department configuration",
          confirmButtonColor: "#083c76",
        });
      }
    } finally {
      setConfigLoading(false);
    }
  };

  const handleUserChange = async (value, setFieldValue) => {
    setFieldValue("userId", value);

    // Clear previous user configuration
    setFieldValue("selectedDepartments", []);

    await getUserDepartmentConfig(value, setFieldValue);
  };

  const handleSelectAll = (checked, setFieldValue) => {
    if (checked) {
      setFieldValue(
        "selectedDepartments",
        departments.map((item) => Number(item.DEPTID)),
      );
    } else {
      setFieldValue("selectedDepartments", []);
    }
  };

  const handleRowCheckChange = (row, checked, values, setFieldValue) => {
    const departmentId = Number(row.DEPTID);

    let updatedDepartments = [...values.selectedDepartments];

    if (checked) {
      if (!updatedDepartments.includes(departmentId)) {
        updatedDepartments.push(departmentId);
      }
    } else {
      updatedDepartments = updatedDepartments.filter(
        (id) => Number(id) !== departmentId,
      );
    }

    setFieldValue("selectedDepartments", updatedDepartments);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!values.userId) {
        Swal.fire({
          // icon: "warning",
          text: "Please Select User",
          confirmButtonColor: "#083c76",
        });

        return;
      }

      if (
        !values.selectedDepartments ||
        values.selectedDepartments.length === 0
      ) {
        Swal.fire({
          // icon: "warning",
          text: "Please Select At Least One Department",
          confirmButtonColor: "#083c76",
        });

        return;
      }

      if (!loginUserId) {
        Swal.fire({
          // icon: "warning",
          text: "Login User ID not found",
          confirmButtonColor: "#083c76",
        });

        return;
      }

      if (!ulbid) {
        Swal.fire({
          // icon: "warning",
          text: "ULB ID not found",
          confirmButtonColor: "#083c76",
        });

        return;
      }

      /* ============================
     PAYLOAD
  ============================ */
      const ipAddress = await getIPAddress();
      const payload = {
        loginUserId: String(loginUserId),
        ulbid: Number(ulbid),

        // Selected user from dropdown
        userId: String(values.userId),

        // Example: 1#2#5#7
        deptConfigStr: values.selectedDepartments.join("#"),

        ipAddress: ipAddress,
        source: config.source,
      };

      console.log("Save User Department Configuration Payload:", payload);

      Swal.fire({
        title: "Saving...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${baseUrl}/api/FrmDeptMappingConfig/save-user-department-config`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = response?.data?.data;

      if (!response?.data?.ok || result?.success === false) {
        throw new Error(
          result?.message ||
            response?.data?.message ||
            "Failed to save department configuration",
        );
      }

      Swal.fire({
        // icon: "success",
        text:
          result?.message ||
          response?.data?.message ||
          "User Department Configuration Detail Saved Successfully.",
        confirmButtonColor: "#083c76",
      });

      // Reload configuration after successful save
      await getUserDepartmentConfig(values.userId, () => {});
    } catch (error) {
      console.error("Submit Department Configuration Error:", error);

      Swal.fire({
        // icon: "error",
        text:
          error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
        confirmButtonColor: "#083c76",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue, isSubmitting }) => {
        const tableData = departments.map((item) => ({
          ...item,
          checked: values.selectedDepartments.includes(Number(item.DEPTID)),
        }));

        const headers = ["Select", "Department Name"];

        const keyMapping = {
          Select: "checked",
          "Department Name": "DEPTNAME",
        };

        const columnStyles = {
          Select: {
            width: "80px",
          },

          "Department Name": {
            width: "auto",
          },
        };

        return (
          <Form>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border shadow-sm">
                {/* ================= HEADER ================= */}

                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">
                    User Department Mapping
                  </CardTitle>
                </CardHeader>

                {/* ================= CONTENT ================= */}

                <CardContent className="space-y-4 p-4 sm:p-6">
                  {/* ================= USER DROPDOWN ================= */}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex w-full shrink-0 items-center whitespace-nowrap sm:w-36">
                        <Label required text="User" />
                      </div>

                      <Select
                        value={values.userId}
                        onValueChange={(value) =>
                          handleUserChange(value, setFieldValue)
                        }
                        disabled={initialLoading || configLoading}
                      >
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder="-- Select User --" />
                        </SelectTrigger>

                        <SelectContent>
                          {users.map((item) => (
                            <SelectItem
                              key={String(item.USERID)}
                              value={String(item.USERID)}
                            >
                              {item.USERNAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* ================= DEPARTMENT TABLE ================= */}

                  {values.userId && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="pt-2"
                    >
                      {configLoading ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                          Loading user department configuration...
                        </div>
                      ) : (
                        <ShadCNTable
                          headers={headers}
                          data={tableData}
                          keyMapping={keyMapping}
                          columnStyles={columnStyles}
                          pagination={false}
                          className="max-h-95 rounded-md border"
                          tableClassName="w-full"
                          onSelectAllChange={(checked) =>
                            handleSelectAll(checked, setFieldValue)
                          }
                          onRowCheckChange={(row, checked) =>
                            handleRowCheckChange(
                              row,
                              checked,
                              values,
                              setFieldValue,
                            )
                          }
                        />
                      )}

                        <div className="mt-4 flex flex-col items-center justify-center gap-3 border-t pt-4 sm:flex-row">
                    <Button
                      type="submit"
                      disabled={isSubmitting || initialLoading || configLoading}
                      className="min-w-28"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>

                    <Button type="button" variant="outline" path="/">
                      Back
                    </Button>
                  </div>
                    </motion.div>
                  )}

                
                </CardContent>
              </Card>
            </motion.div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FrmDeptMappingConfig;
