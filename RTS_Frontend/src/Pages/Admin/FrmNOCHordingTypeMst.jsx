import React, { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "../../components/ui/input";

import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import config from "@/utils/config";
import getIPAddress from "@/utils/ipHelper";

const FrmNOCHordingTypeMst = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { token, user } = useAuth();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const mode = Number(location.state?.mode || 1);
  const hordingTypeId = Number(location.state?.hordingTypeId || 0);

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const [autofillLoading, setAutofillLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const valuesRef = useRef({});

  const initialValues = {
    hordingTypeName: location.state?.hordingTypeName || "",
  };

  const fetchHordingTypeDetail = async (setFieldValue) => {
    if (mode !== 2 || !hordingTypeId) {
      return;
    }

    try {
      setAutofillLoading(true);

      const payload = { hordId: hordingTypeId };

      console.log("Hoarding Type Detail Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmNOCHordingType/hodType`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Hoarding Type Detail Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        const list = response.data?.data?.rows || [];

        if (list.length > 0) {
          const row = list[0];

          setFieldValue("hordingTypeName", row.HORDINGTYPENAME || "");
        } else {
          Swal.fire({
            title: "No Data Found",
            text: "Hoarding type details were not found.",
          });
        }
      } else {
        Swal.fire({
          text:
            response.data?.message ||
            "Failed to fetch hoarding type details.",
        });
      }
    } catch (error) {
      console.error("Hoarding Type Detail API Error:", error);

      Swal.fire({
        text:
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Failed to fetch hoarding type details.",
      });
    } finally {
      setAutofillLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsSubmitting(true);
      
      const ipAddress = await getIPAddress();
      const payload = {
        userId,
        hordingTypeId: mode === 2 ? hordingTypeId : null,
        name: values.hordingTypeName?.trim(),
        ulbId,
        mode,
        ipAddress: ipAddress,
        ipSource: config.source,
      };

      console.log("Save Hoarding Type Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmNOCHordingType/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Save Hoarding Type Response:", response.data);

      const errorCode = response.data?.data?.errorCode;
      const message =
        response.data?.data?.message ||
        response.data?.message ||
        "Saved successfully.";

      if (response.data?.ok && errorCode === 9999) {
        Swal.fire({
          text: message,
        }).then(() => {
          navigate("/App/FrmNOCHordingTypeList");
        });
      } else {
        Swal.fire({
          text: message,
        });
      }
    } catch (error) {
      console.error("Save Hoarding Type API Error:", error);

      Swal.fire({
        text:
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Failed to save hoarding type.",
      });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!hordingTypeId) {
        Swal.fire({ text: "Hoarding Type ID is missing." });
        return;
    }

    const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this Hoarding Type?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
        setIsSubmitting(true);

        const ipAddress = await getIPAddress();

        const payload = {
        userId,
        hordingTypeId,
        name: valuesRef.current?.hordingTypeName?.trim() || "",
        ulbId,
        mode: 3,
        ipAddress: ipAddress,
        ipSource: config.source,
        };

        console.log("Delete Hoarding Type Payload:", payload);

        const response = await axios.post(
        `${BASE_URL}/api/FrmNOCHordingType/submit`,
        payload,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
        }
        );

        console.log("Delete Hoarding Type Response:", response.data);

        const errorCode = response.data?.data?.errorCode;
        const message =
        response.data?.data?.message ||
        response.data?.message ||
        "Deleted successfully.";

        if (response.data?.ok && errorCode === 9999) {
        Swal.fire({ text: message }).then(() => {
            navigate("/App/FrmNOCHordingTypeList");
        });
        } else {
        Swal.fire({ text: message });
        }
    } catch (error) {
        console.error("Delete Hoarding Type API Error:", error);

        Swal.fire({
        text:
            error.response?.data?.message ||
            error.response?.data?.data?.message ||
            "Failed to delete hoarding type.",
        });
    } finally {
        setIsSubmitting(false);
    }
    };

  const handleBack = () => {
    navigate("/App/FrmNOCHordingTypeList");
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={false}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, setFieldValue }) => {
        valuesRef.current = values;
        
        useEffect(() => {
          if (mode === 2 && hordingTypeId > 0) {
            fetchHordingTypeDetail(setFieldValue);
          }
        }, [mode, hordingTypeId]);

        return (
          <Form>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border shadow-sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">
                    NOC Hoarding Type
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 py-3 px-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-48 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label className="text-nowrap">
                          Hoarding Type Name
                        </Label>
                        <span>:</span>
                      </div>

                      <Input
                        name="hordingTypeName"
                        value={values.hordingTypeName}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                        placeholder="Enter Hoarding Type Name"
                      />
                    </div>
                  </div>

                  <hr />

                  <div className="flex justify-center items-center gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={autofillLoading || isSubmitting}
                      className="w-full sm:w-auto px-6 h-9 sm:h-10 text-white"
                    >
                      {isSubmitting ? "Saving..." : "Submit"}
                    </Button>

                    {mode === 2 && hordingTypeId > 0 && (
                        <Button
                        type="button"
                        variant="destructive"
                        disabled={isSubmitting}
                        onClick={handleDelete}
                        className="w-full sm:w-auto px-6 h-9 sm:h-10"
                        >
                        Delete
                        </Button>
                    )}

                    <Button
                      type="button"
                      variant="outline"
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

export default FrmNOCHordingTypeMst;