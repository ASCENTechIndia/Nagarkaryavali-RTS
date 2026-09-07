import { useEffect, useState } from "react";

import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import { useLocation, useNavigate } from "react-router";

import { Formik, Form } from "formik";

import { useAuth } from "@/context/AuthContext";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const baseUrl = import.meta.env.VITE_BASE_URL;

const FrmTradeCtgMst = () => {
  const { user, token } = useAuth();

  const userId = user?.userId || user?.userid || user?.USERID;

  const ulbid = user?.ulbId || user?.ulbid;

  const navigate = useNavigate();
  const location = useLocation();

  const { mode = 1, categoryId } = location.state || {};

  const [tradeCategoryDetail, setTradeCategoryDetail] = useState({});

  const [detailLoading, setDetailLoading] = useState(false);

  const fetchTradeCategoryDetails = async () => {
    try {
      if (!categoryId || !token) return;

      setDetailLoading(true);

      Swal.fire({
        text: "Loading...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${baseUrl}/api/Tradetypeconfig/tradecategoryby-id`,
        {
          categoryId: Number(categoryId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = response?.data?.data?.data || [];

      if (Array.isArray(data) && data.length > 0) {
        setTradeCategoryDetail(data[0]);
      } else {
        setTradeCategoryDetail({});
      }
    } catch (error) {
      console.error("Trade Category Details Error:", error);

      setTradeCategoryDetail({});

      Swal.fire({
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to fetch Trade Category Details",
        confirmButtonColor: "#083c76",
      });
    } finally {
      setDetailLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    if (Number(mode) === 2 && categoryId && token) {
      fetchTradeCategoryDetails();
    }
  }, [mode, categoryId, token]);

  const initialValues = {
    category: tradeCategoryDetail?.TRADECATEGORYNM || "",

    status: tradeCategoryDetail?.STATUS === "N" ? "N" : "Y",
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      if (!values.category?.trim()) {
        Swal.fire({
          text: "Please Enter Business Category",
          confirmButtonColor: "#083c76",
        });

        return;
      }

      if (!userId || !ulbid) {
        Swal.fire({
          text: "Login information not found",
          confirmButtonColor: "#083c76",
        });

        return;
      }

      const payload = {
        userId: Number(userId),

        categoryTradeId: Number(mode) === 2 ? Number(categoryId) : 0,

        category: values.category.trim(),

        status: values.status,

        ulbId: Number(ulbid),

        mode: Number(mode),
      };

      console.log("Trade Category Save Payload:", payload);

      Swal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${baseUrl}/api/Tradetypeconfig/trade-category-save`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = response?.data?.data;

      if (
        !response?.data?.ok ||
        result?.status === "ERROR" ||
        result?.success === false
      ) {
        throw new Error(
          result?.message ||
            result?.data?.errorMsg ||
            response?.data?.message ||
            "Failed to save Trade Category",
        );
      }

      await Swal.fire({
        text:
          result?.message ||
          result?.data?.errorMsg ||
          "Trade Category saved successfully",
        confirmButtonColor: "#083c76",
      });

      resetForm();

      navigate("/App/FrmTradeCtgryList", {
        state: {
          inApp: true,
        },
      });
    } catch (error) {
      console.error("Save Trade Category Error:", error);

      Swal.fire({
        text:
          error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to save Trade Category",
        confirmButtonColor: "#083c76",
      });
    } finally {
      setSubmitting(false);
      Swal.close();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">
            Trade Category Master
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {detailLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : (
            <Formik
              enableReinitialize
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, setFieldValue, isSubmitting }) => (
                <Form>
                  <div className="w-full">
                    <div className="w-full space-y-5">
                      {/* BUSINESS CATEGORY */}
                      <div className="grid w-full grid-cols-1 items-center gap-3 md:grid-cols-[250px_auto]">
                        <Label
                          text="Business Category :"
                          required
                          className="!w-full"
                        />

                        <Input
                          id="category"
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                          placeholder="Enter Business Category"
                          className="w-full md:w-[350px]"
                        />
                      </div>

                      {/* STATUS */}
                      <div className="grid w-full grid-cols-1 items-center gap-3 md:grid-cols-[250px_1fr]">
                        <Label text="Status :" className="!w-full" required />

                        <div className="flex items-center gap-8">
                          {/* YES */}
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="radio"
                              name="status"
                              value="Y"
                              checked={values.status === "Y"}
                              onChange={() => setFieldValue("status", "Y")}
                              className="h-4 w-4 cursor-pointer"
                            />

                            <span className="text-sm">Yes</span>
                          </label>

                          {/* NO */}
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="radio"
                              name="status"
                              value="N"
                              checked={values.status === "N"}
                              onChange={() => setFieldValue("status", "N")}
                              className="h-4 w-4 cursor-pointer"
                            />

                            <span className="text-sm">No</span>
                          </label>
                        </div>
                      </div>

                      {/* BUTTONS */}
                      <div className="flex w-full flex-col items-center justify-center gap-3 border-t pt-5 sm:flex-row">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting
                            ? "Submitting..."
                            : Number(mode) === 2
                              ? "Update"
                              : "Submit"}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          path="/App/FrmTradeCtgryList"
                        >
                          Back
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FrmTradeCtgMst;
