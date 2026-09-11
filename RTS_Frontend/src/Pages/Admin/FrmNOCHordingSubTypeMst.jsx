import React, { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import config from "@/utils/config";
import getIPAddress from "@/utils/ipHelper";

const FrmNOCHordingSubTypeMst = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { token, user } = useAuth();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const mode = Number(location.state?.mode || 1);
  const hordSubTypeId = Number(location.state?.hordSubTypeId || 0);
  const initialHordId = Number(location.state?.hordId || 0);

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const [autofillLoading, setAutofillLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hordingTypes, setHordingTypes] = useState([]);

  const valuesRef = useRef({});

  const initialValues = {
    hordId: initialHordId ? String(initialHordId) : "",
    hordSubTypeName: location.state?.hordSubTypeName || "",
  };

  const fetchHordingTypeDropdown = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmNOCHordingType/list`,
        { ulbId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.ok && response.data?.data?.success) {
        setHordingTypes(response.data?.data?.rows || []);
      } else {
        setHordingTypes([]);
      }
    } catch (error) {
      console.error("Hoarding Type Dropdown Error:", error);
      setHordingTypes([]);
    }
  };

  const fetchSubTypeDetail = async (setFieldValue) => {
    if (mode !== 2 || !hordSubTypeId) {
      return;
    }

    try {
      setAutofillLoading(true);

      const payload = { subTypeId: hordSubTypeId };

      console.log("Hoarding Sub Type Detail Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmNOCHordingSubType/subType`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Hoarding Sub Type Detail Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        const list = response.data?.data?.rows || [];

        if (list.length > 0) {
          const row = list[0];

          setFieldValue("hordSubTypeName", row.HORDSUBTYPENAME || "");
          setFieldValue("hordId", row.HORDID ? String(row.HORDID) : "");
        } else {
          Swal.fire({
            text: "Hoarding sub type details were not found.",
          });
        }
      } else {
        Swal.fire({
          text:
            response.data?.message ||
            "Failed to fetch hoarding sub type details.",
        });
      }
    } catch (error) {
      console.error("Hoarding Sub Type Detail API Error:", error);

      Swal.fire({
        text:
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Failed to fetch hoarding sub type details.",
      });
    } finally {
      setAutofillLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!values.hordId) {
        Swal.fire({ text: "Please select Hoarding Type." });
        setSubmitting(false);
        return;
      }

      if (!values.hordSubTypeName?.trim()) {
        Swal.fire({ text: "Please enter Hoarding Sub Type Name." });
        setSubmitting(false);
        return;
      }

      setIsSubmitting(true);

      const ipAddress = await getIPAddress();

      const payload = {
        userId,
        subTypeId: mode === 2 ? hordSubTypeId : null,
        hordId: Number(values.hordId),
        name: values.hordSubTypeName.trim(),
        ulbId,
        mode,
        ipAddress: ipAddress,
        ipSource: config.source,
      };

      console.log("Save Hoarding Sub Type Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmNOCHordingSubType/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Save Hoarding Sub Type Response:", response.data);

      const errorCode = response.data?.data?.errorCode;
      const message =
        response.data?.data?.message ||
        response.data?.message ||
        "Saved successfully.";

      if (response.data?.ok && errorCode === 9999) {
        Swal.fire({ text: message }).then(() => {
          navigate("/App/FrmNOCHordingSubTypeList");
        });
      } else {
        Swal.fire({ text: message });
      }
    } catch (error) {
      console.error("Save Hoarding Sub Type API Error:", error);

      Swal.fire({
        text:
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Failed to save hoarding sub type.",
      });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!hordSubTypeId) {
      Swal.fire({ text: "Hoarding Sub Type ID is missing." });
      return;
    }

    const confirm = await Swal.fire({
      text: "Do you want to delete this Hoarding Sub Type?",
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
        subTypeId: hordSubTypeId,
        hordId: Number(valuesRef.current?.hordId || initialHordId || 0),
        name: valuesRef.current?.hordSubTypeName?.trim() || "",
        ulbId,
        mode: 3,
        ipAddress: ipAddress,
        ipSource: config.source,
      };

      console.log("Delete Hoarding Sub Type Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmNOCHordingSubType/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Delete Hoarding Sub Type Response:", response.data);

      const errorCode = response.data?.data?.errorCode;
      const message =
        response.data?.data?.message ||
        response.data?.message ||
        "Deleted successfully.";

      if (response.data?.ok && errorCode === 9999) {
        Swal.fire({ text: message }).then(() => {
          navigate("/App/FrmNOCHordingSubTypeList");
        });
      } else {
        Swal.fire({ text: message });
      }
    } catch (error) {
      console.error("Delete Hoarding Sub Type API Error:", error);

      Swal.fire({
        text:
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Failed to delete hoarding sub type.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/App/FrmNOCHordingSubTypeList");
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
          fetchHordingTypeDropdown();

          if (mode === 2 && hordSubTypeId > 0) {
            fetchSubTypeDetail(setFieldValue);
          }
        }, [mode, hordSubTypeId]);

        return (
          <Form>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border shadow-sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">
                    NOC Hoarding Sub Type
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 py-3 px-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-48 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label className="text-nowrap">Hoarding Type</Label>
                        <span>:</span>
                      </div>

                      <Select
                        value={values.hordId ? String(values.hordId) : ""}
                        onValueChange={(value) => {
                          setFieldValue("hordId", value);
                        }}
                      >
                        <SelectTrigger className="w-full h-9 sm:h-10">
                          <SelectValue placeholder="-- Select Hoarding Type --" />
                        </SelectTrigger>
                        <SelectContent>
                          {hordingTypes.map((h) => (
                            <SelectItem
                              key={h.HORDINGTYPEID}
                              value={String(h.HORDINGTYPEID)}
                            >
                              {h.HORDINGTYPENAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-48 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label className="text-nowrap">
                          Hoarding Sub Type Name
                        </Label>
                        <span>:</span>
                      </div>

                      <Input
                        name="hordSubTypeName"
                        value={values.hordSubTypeName}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                        placeholder="Enter Hoarding Sub Type Name"
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

                    {mode === 2 && hordSubTypeId > 0 && (
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

export default FrmNOCHordingSubTypeMst;
