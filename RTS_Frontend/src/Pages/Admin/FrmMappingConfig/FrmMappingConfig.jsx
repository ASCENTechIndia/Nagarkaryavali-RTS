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

const FrmMappingConfig = () => {
  const { user, token } = useAuth();

  const [users, setUsers] = useState([]);
  const [wards, setWards] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);

  const ulbid = user?.ulbId || user?.ulbid;

  const loginUserId = user?.userId || user?.userid || user?.USERID;

  const initialValues = {
    userId: "",
    selectedWards: [],
  };

  const getUserDropdown = async () => {
    const response = await axios.get(
      `${baseUrl}/api/FrmMappingConfig/user-dropdown`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = response?.data?.data?.data || [];

    setUsers(data);
  };

  const getWardDropdown = async () => {
    const response = await axios.get(
      `${baseUrl}/api/FrmMappingConfig/ward-dropdown`,
      {
        params: {
          ulbid,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = response?.data?.data?.data || [];

    setWards(data);
  };

  useEffect(() => {
    if (!ulbid || !token) return;

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
          getWardDropdown(),
        ]);

        const rejected = results.find((result) => result.status === "rejected");

        if (rejected) {
          throw rejected.reason;
        }

        Swal.close();
      } catch (error) {
        console.error("Initial Load Error:", error);

        Swal.fire({
          // icon: "error",
          text: error?.response?.data?.message || "Failed to load page data",
          confirmButtonColor: "#083c76",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, [ulbid, token]);

  const getUserWardConfig = async (selectedUserId, setFieldValue) => {
    if (!selectedUserId) {
      setFieldValue("selectedWards", []);
      return;
    }

    setConfigLoading(true);

    try {
      const response = await axios.get(
        `${baseUrl}/api/FrmMappingConfig/user-ward-config`,
        {
          params: {
            userId: selectedUserId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const configData = response?.data?.data?.data || [];

      const selectedWardIds = configData.map((item) => Number(item.WARDID));

      setFieldValue("selectedWards", selectedWardIds);
    } catch (error) {
      console.error("User Ward Config Error:", error);

      setFieldValue("selectedWards", []);

      if (error?.response?.status !== 404) {
        Swal.fire({
          // icon: "error",
          text:
            error?.response?.data?.message ||
            "Failed to load user configuration",
          confirmButtonColor: "#083c76",
        });
      }
    } finally {
      setConfigLoading(false);
    }
  };

  const handleUserChange = async (value, setFieldValue) => {
    setFieldValue("userId", value);
    setFieldValue("selectedWards", []);

    await getUserWardConfig(value, setFieldValue);
  };

  const handleSelectAll = (checked, setFieldValue) => {
    if (checked) {
      setFieldValue(
        "selectedWards",
        wards.map((item) => Number(item.WARDID)),
      );
    } else {
      setFieldValue("selectedWards", []);
    }
  };

  const handleRowCheckChange = (row, checked, values, setFieldValue) => {
    const wardId = Number(row.WARDID);

    let updatedWards = [...values.selectedWards];

    if (checked) {
      if (!updatedWards.includes(wardId)) {
        updatedWards.push(wardId);
      }
    } else {
      updatedWards = updatedWards.filter((id) => Number(id) !== wardId);
    }

    setFieldValue("selectedWards", updatedWards);
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

      if (values.selectedWards.length === 0) {
        Swal.fire({
          // icon: "warning",
          text: "Please Select At Least One Ward",
          confirmButtonColor: "#083c76",
        });
        return;
      }

      if (!loginUserId || !ulbid) {
        Swal.fire({
          // icon: "warning",
          text: "Login information not found",
          confirmButtonColor: "#083c76",
        });
        return;
      }

      const ipAddress = await getIPAddress();

      const payload = {
        loginUserId: String(loginUserId),
        ulbid: Number(ulbid),
        userId: String(values.userId),
        blockConfigStr: values.selectedWards.join("#"),
        ipAddress,
        source: config.source || "WEB",
      };

      Swal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${baseUrl}/api/FrmMappingConfig/save-user-ward-config`,
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
            "Failed to save configuration",
        );
      }

      Swal.fire({
        // icon: "success",
        text:
          result?.message ||
          response?.data?.message ||
          "User Configuration Detail Saved Successfully.",
        confirmButtonColor: "#083c76",
      });
    } catch (error) {
      console.error("Submit Error:", error);

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
        const tableData = wards.map((item) => ({
          ...item,
          checked: values.selectedWards.includes(Number(item.WARDID)),
        }));

        const allWardsSelected =
          wards.length > 0 &&
          wards.every((item) =>
            values.selectedWards.includes(Number(item.WARDID)),
          );

        const headers = ["Select", "Ward Name"];

        const keyMapping = {
          Select: "checked",
          "Ward Name": "WARDNAME",
        };

        const columnStyles = {
          Select: {
            width: "80px",
          },
          "Ward Name": {
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
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">
                    User Ward Mapping
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-4 sm:p-6">
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
                          Loading configuration...
                        </div>
                      ) : (
                        <ShadCNTable
                          headers={headers}
                          data={tableData}
                          keyMapping={keyMapping}
                          columnStyles={columnStyles}
                          pagination={false}
                          selectAllChecked={allWardsSelected}
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
                          disabled={
                            isSubmitting || initialLoading || configLoading
                          }
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

export default FrmMappingConfig;
