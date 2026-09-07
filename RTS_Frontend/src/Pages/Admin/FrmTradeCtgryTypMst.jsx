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

import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "../../components/ui/input";

const FrmTradeCtgryTypMst = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, token } = useAuth();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const userId = user?.userId;
  const ulbid = user?.ulbId;

  const mode = Number(location.state?.mode || 1);
  const tradeTypeId = Number(location.state?.tradeTypeId);
  const tradeCategoryId = Number(location.state?.tradeCategoryId);

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [autofillLoading, setAutofillLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  const initialValues = {
    businessCategory: "",
    businessCategoryId: "",
    businessCategoryType: "",
    status: "Yes",
  };

  const fetchTradeCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await axios.get(
        `${BASE_URL}/api/FrmTradeCtgrytypListMst/trade-categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Trade Categories Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        const categoryList = response.data?.data?.categories || [];

        setCategories(categoryList);
      } else {
        setCategories([]);

        Swal.fire({
          title: "Error",
          text: response.data?.message || "Failed to fetch trade categories",
        });
      }
    } catch (error) {
      console.error("Trade Categories API Error:", error);

      setCategories([]);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message || "Failed to fetch trade categories",
      });
    } finally {
      setCategoryLoading(false);
    }
  };

  const fetchTradeTypeDetail = async (setFieldValue) => {
    if (mode !== 2 || !tradeTypeId) {
      return;
    }

    try {
      setAutofillLoading(true);

      const payload = {
        tradeTypeId: tradeTypeId,
        tradeCategoryId: tradeCategoryId,
        ulbid: Number(ulbid),
      };

      console.log("Trade Type Detail Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmTradeCtgrytypListMst/trade-type-detail`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Trade Type Detail Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        const details = response.data?.data?.details || [];

        if (details.length > 0) {
          const detail = details[0];

          console.log("Trade Type Detail:", detail);

          setFieldValue("businessCategory", String(detail.tradeCategoryId));

          setFieldValue("businessCategoryId", String(detail.tradeCategoryId));

          setFieldValue("businessCategoryType", detail.tradeCategoryName || "");

          setFieldValue("status", detail.status === "Y" ? "Yes" : "No");
        } else {
          Swal.fire({
            title: "No Data Found",
            text: "Trade type details were not found.",
          });
        }
      } else {
        Swal.fire({
          title: "Error",
          text: response.data?.message || "Failed to fetch trade type details",
        });
      }
    } catch (error) {
      console.error("Trade Type Detail API Error:", error);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message || "Failed to fetch trade type details",
      });
    } finally {
      setAutofillLoading(false);
    }
  };

  const submitTradeCategoryType = async (values, resetForm) => {
    try {
      setLoading(true);

      if (!values.businessCategory) {
        Swal.fire({
          title: "Required",
          text: "Please select Business Category",
        });

        return;
      }

      if (!values.businessCategoryType?.trim()) {
        Swal.fire({
          title: "Required",
          text: "Please enter Business Category Type",
        });

        return;
      }

      if (!values.status) {
        Swal.fire({
          title: "Required",
          text: "Please select Status",
        });

        return;
      }

      const status = values.status === "Yes" ? "Y" : "N";

      const payload = {
        userId: userId,
        category: values.businessCategoryType.trim(),
        categoryId: Number(values.businessCategory),
        status: status,
        ulbid: Number(ulbid),
        mode: Number(mode),
      };

      console.log("Trade Category Type Submit Payload:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmTradeCtgrytypListMst/trade-category-type`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Trade Category Type Submit Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        Swal.fire({
          title: "Success",
          text:
            response.data?.data?.message ||
            response.data?.message ||
            "Business Category Type saved successfully",
        }).then(() => {
          navigate("/App/FrmTradeCtgrytypList")
        });
      } else {
        Swal.fire({
          title: "Error",
          text:
            response.data?.data?.message ||
            response.data?.message ||
            "Failed to save Business Category Type",
        });
      }
    } catch (error) {
      console.error("Trade Category Type Submit API Error:", error);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Failed to save Business Category Type",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradeCategories();
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={false}
      onSubmit={(values, { resetForm }) =>
        submitTradeCategoryType(values, resetForm)
      }
    >
      {({ values, handleChange, setFieldValue }) => {
        useEffect(() => {
          if (mode === 2 && tradeTypeId > 0 && categories.length > 0) {
            fetchTradeTypeDetail(setFieldValue);
          }
        }, [mode, tradeTypeId, categories.length]);

        return (
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
                    Business Category Type
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {autofillLoading && (
                    <div className="text-center text-sm text-gray-500">
                      Loading trade type details...
                    </div>
                  )}

                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 py-3 px-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-48 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label className="text-nowrap">Business Category</Label>

                        <span>:</span>
                      </div>

                      <Select
                        value={values.businessCategory}
                        onValueChange={(value) => {
                          setFieldValue("businessCategory", value);

                          setFieldValue("businessCategoryId", value);
                        }}
                        disabled={
                          mode === 2 || categoryLoading || autofillLoading
                        }
                      >
                        <SelectTrigger className="w-full border rounded-md">
                          <SelectValue
                            placeholder={
                              categoryLoading
                                ? "Loading..."
                                : "-- Select Business Category --"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.tradeCategoryId}
                              value={String(category.tradeCategoryId)}
                            >
                              {category.tradeCategoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-48 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label className="text-nowrap">
                          Business Category Type
                        </Label>

                        <span>:</span>
                      </div>

                      <Input
                        name="businessCategoryType"
                        value={values.businessCategoryType}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                        placeholder="Enter Business Category Type"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 px-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-48 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label className="text-nowrap">Status</Label>

                        <span>:</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <Input
                            type="radio"
                            name="status"
                            checked={values.status === "Yes"}
                            onChange={() => setFieldValue("status", "Yes")}
                            className="h-4 w-4"
                          />
                          Yes
                        </label>

                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <Input
                            type="radio"
                            name="status"
                            checked={values.status === "No"}
                            onChange={() => setFieldValue("status", "No")}
                            className="h-4 w-4"
                          />
                          No
                        </label>
                      </div>
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

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto px-6 h-9 sm:h-10 bg-gray-100 hover:bg-gray-200"
                      onClick={() => navigate(-1)}
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

export default FrmTradeCtgryTypMst;
