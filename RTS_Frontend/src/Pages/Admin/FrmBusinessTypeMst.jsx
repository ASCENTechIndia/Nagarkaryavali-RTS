import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "../../components/ui/input";

import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import config from "@/utils/config";
import GetIPAddress from "@/utils/ipHelper";

const FrmBusinessTypeMst = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, token } = useAuth();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const userId = user?.userId;
  const ulbid = user?.ulbId;

  const mode = location.state?.mode;
  const businessTypeId = location.state?.businessTypeId;

  const [loading, setLoading] = useState(false);
  const [autofillLoading, setAutofillLoading] = useState(false);

  const initialValues = {
    businessTypeName: "",
  };

  const fetchBusinessTypeDetail = async (setFieldValue) => {
    if (mode !== 2 || !businessTypeId) {
      return;
    }

    try {
      setAutofillLoading(true);

      const payload = {
        bustypId: businessTypeId,
      };

      const response = await axios.post(
        `${BASE_URL}/api/FrmBusinessTypeListMst/business-type`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.ok && response.data?.data?.success) {
        const businessTypes = response.data?.data?.businessType || [];

        if (businessTypes.length > 0) {
          const businessType = businessTypes[0];

          setFieldValue("businessTypeName", businessType.name || "");
        } else {
          Swal.fire({
            text: "Data not found.",
          });
        }
      } else {
        Swal.fire({
          text:
            response.data?.message || "Failed to fetch business type details.",
        });
      }
    } catch (error) {
      console.error("Business Type Detail API Error:", error);

      Swal.fire({
        text:
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Failed to fetch business type details.",
      });
    } finally {
      setAutofillLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (!values.businessTypeName?.trim()) {
        Swal.fire({
          text: "Please enter Business Type Name.",
        });
        return;
      }

      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        userId: userId,
        id: businessTypeId,
        name: values.businessTypeName.trim(),
        ulbid: ulbid,
        mode: Number(mode),
        ipAddress: ip,
        ipSource: config.source,
      };

      const response = await axios.post(
        `${BASE_URL}/api/FrmBusinessTypeListMst/insert-business-type`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.ok && response.data?.data?.success) {
        Swal.fire({
          text:
            response.data?.data?.message ||
            response.data?.message ||
            "Business Type saved successfully.",
        }).then(() => {
          navigate("/App/FrmBusinessTypeList");
        });
      } else {
        Swal.fire({
          text:
            response.data?.data?.message ||
            response.data?.message ||
            "Failed to save Business Type.",
        });
      }
    } catch (error) {
      console.error("Insert Business Type API Error:", error);

      Swal.fire({
        text:
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Failed to save Business Type.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!businessTypeId) {
        Swal.fire({
          text: "Business Type ID is required for delete.",
        });
        return;
      }

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this Business Type?",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      setLoading(true);

      const ip = await GetIPAddress();

      const payload = {
        userId: userId,
        id: businessTypeId,
        ulbid: ulbid,
        mode: 3,
        ipAddress: ip,
        ipSource: config.source,
      };

      const response = await axios.post(
        `${BASE_URL}/api/FrmBusinessTypeListMst/insert-business-type`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.ok && response.data?.data?.success) {
        Swal.fire({
          text:
            response.data?.data?.message ||
            response.data?.message ||
            "Business Type deleted successfully.",
        }).then(() => {
          navigate("/App/FrmBusinessTypeList");
        });
      } else {
        Swal.fire({
          text:
            response.data?.data?.message ||
            response.data?.message ||
            "Failed to delete Business Type.",
        });
      }
    } catch (error) {
      console.error("Delete Business Type API Error:", error);

      Swal.fire({
        text:
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Failed to delete Business Type.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/App/FrmBusinessTypeList");
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={false}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, setFieldValue }) => {
        useEffect(() => {
          if (mode === 2 && businessTypeId > 0) {
            fetchBusinessTypeDetail(setFieldValue);
          }
        }, [mode, businessTypeId]);

        return (
          <Form>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border shadow-sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">
                    Business Type Master
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {autofillLoading && (
                    <div className="text-center text-sm text-gray-500">
                      Loading Business Type details...
                    </div>
                  )}

                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 py-3 px-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-48 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label className="text-nowrap">
                          Business Type Name
                        </Label>

                        <span>:</span>
                      </div>

                      <Input
                        name="businessTypeName"
                        value={values.businessTypeName}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                        placeholder="Enter Business Type Name"
                        disabled={autofillLoading}
                      />
                    </div>
                  </div>

                  <hr />

                  <div className="flex justify-center items-center gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={loading || autofillLoading}
                      className="w-full sm:w-auto px-6 h-9 sm:h-10 text-white"
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </Button>

                    {mode === 2 && (
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={loading || autofillLoading}
                        className="w-full sm:w-auto px-6 h-9 sm:h-10"
                        onClick={() => handleDelete()}
                      >
                        {loading ? "Deleting..." : "Delete"}
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      className="w-full sm:w-auto px-6 h-9 sm:h-10 bg-gray-100 hover:bg-gray-200"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FrmBusinessTypeMst;
