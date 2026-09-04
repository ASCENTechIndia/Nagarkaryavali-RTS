import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useFormik } from "formik";

const FrmTradeCategoryConfigMst = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const locationState = location.state || {};
  const mode = locationState.mode || "1"; // "1" = Add, "2" = Edit
  const selectedData = locationState.selectedData || null;

  const [loadingBizCat, setLoadingBizCat] = useState(false);
  const [businessCategoryList, setBusinessCategoryList] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ── On Mount ───────────────────────────────────────────────────────────────
  useEffect(() => {
    document.title = "Trade Category Configuration Master";
    fetchBusinessCategoryList();
  }, []);

  // ── API: Business Category List ────────────────────────────────────────────
  const fetchBusinessCategoryList = async () => {
    setLoadingBizCat(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/FrmTradeCategoryConfig/business-category-list`,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.ok && response.data?.data) {
        const data = response.data.data?.data || response.data.data || [];
        const arr = Array.isArray(data) ? data : [];
        setBusinessCategoryList(
          arr.filter(
            (c) => !(c.BUSINESSCATNAME || c.name || "").includes("Select Option")
          )
        );
      }
    } catch (error) {
      console.error("Error fetching business category list:", error);
    } finally {
      setLoadingBizCat(false);
    }
  };

  // ── Formik Setup ───────────────────────────────────────────────────────────
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      businessCategoryId:
        mode === "2" && selectedData
          ? String(selectedData.TRADECATID || selectedData.businessCategoryId || "")
          : "",
      type:
        mode === "2" && selectedData
          ? selectedData.TYPE || selectedData.type || "Trade"
          : "Trade",
      inflammable:
        mode === "2" && selectedData
          ? selectedData.INFLAMMABLE || selectedData.inflammable || "Yes"
          : "Yes",
      status:
        mode === "2" && selectedData
          ? selectedData.STATUS || selectedData.status || "Yes"
          : "Yes",
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!values.businessCategoryId) {
        Swal.fire({
          text: "Please select a Business Category.",
          icon: "warning",
          confirmButtonColor: "#1e3a8a",
        });
        setSubmitting(false);
        return;
      }

      try {
        const payload = {
          businessCategoryId: values.businessCategoryId,
          type: values.type,
          inflammable: values.inflammable,
          status: values.status,
          ...(mode === "2" && selectedData
            ? { tradeCatId: selectedData.TRADECATID || selectedData.id }
            : {}),
        };

        const response = await axios.post(
          `${BASE_URL}/api/FrmTradeCategoryConfig/save`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data?.ok) {
          await Swal.fire({
            text: "Trade category saved successfully.",
            icon: "success",
            confirmButtonColor: "#1e3a8a",
          });
          navigate("/app/FrmTradeCategoryConfigList");
        } else {
          Swal.fire({
            text: response.data?.message || "Failed to save. Please try again.",
            icon: "error",
            confirmButtonColor: "#1e3a8a",
          });
        }
      } catch (error) {
        console.error("Error saving trade category:", error);
        Swal.fire({
          text:
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            "An error occurred. Please try again.",
          icon: "error",
          confirmButtonColor: "#1e3a8a",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleBack = () => navigate(-1);

  // ── Radio group component ──────────────────────────────────────────────────
  const RadioGroup = ({ name, options, value, onChange, disabled }) => (
    <div className="flex items-center gap-6">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-1.5 cursor-pointer select-none"
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            disabled={disabled}
            className="accent-blue-700 w-4 h-4 cursor-pointer"
          />
          <span className="text-sm text-gray-700">{opt}</span>
        </label>
      ))}
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border shadow-sm">
        {/* ── Header ── */}
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold boxHead">
            Trade Category Configuration Master
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 max-w-2xl mx-auto py-4">
            
            {/* ── Business Category ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <Label
                htmlFor="business-category"
                className="sm:w-48 sm:text-right text-sm font-medium text-gray-700 shrink-0"
                text="Business Category :"
                required={true}
              />
              <Select
                value={formik.values.businessCategoryId}
                onValueChange={(val) =>
                  formik.setFieldValue("businessCategoryId", val)
                }
                disabled={loadingBizCat || formik.isSubmitting}
              >
                <SelectTrigger
                  id="business-category"
                  className="w-full sm:w-72 h-9"
                >
                  <SelectValue placeholder="-- Select Option --" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {loadingBizCat ? (
                    <SelectItem value="__loading__" disabled>
                      Loading...
                    </SelectItem>
                  ) : businessCategoryList.length === 0 ? (
                    <SelectItem value="__empty__" disabled>
                      No categories available
                    </SelectItem>
                  ) : (
                    businessCategoryList.map((cat) => (
                      <SelectItem
                        key={cat.BUSINESSCATID || cat.id}
                        value={String(cat.BUSINESSCATID || cat.id)}
                      >
                        {cat.BUSINESSCATNAME || cat.name || cat.BUSINESSCATID}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* ── Type ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <Label 
                className="sm:w-48 sm:text-right text-sm font-medium text-gray-700 shrink-0"
                text="Type :"
                required={true}
              />
              <RadioGroup
                name="type"
                options={["Trade", "Storage"]}
                value={formik.values.type}
                onChange={(val) => formik.setFieldValue("type", val)}
                disabled={formik.isSubmitting}
              />
            </div>

            {/* ── ज्वलनशील पदार्थाचा ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <Label 
                className="sm:w-48 sm:text-right text-sm font-medium text-gray-700 shrink-0"
                text="ज्वलनशील पदार्थाचा :"
                required={true}
              />
              <RadioGroup
                name="inflammable"
                options={["Yes", "No"]}
                value={formik.values.inflammable}
                onChange={(val) => formik.setFieldValue("inflammable", val)}
                disabled={formik.isSubmitting}
              />
            </div>

            {/* ── Status ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <Label 
                className="sm:w-48 sm:text-right text-sm font-medium text-gray-700 shrink-0"
                text="Status :"
                required={true}
              />
              <RadioGroup
                name="status"
                options={["Yes", "No"]}
                value={formik.values.status}
                onChange={(val) => formik.setFieldValue("status", val)}
                disabled={formik.isSubmitting}
              />
            </div>

            {/* ── Buttons ── */}
            <div className="flex justify-center gap-3 pt-2">
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="bg-blue-900 hover:bg-blue-800 text-white px-6"
                disabled={formik.isSubmitting || loadingBizCat}
              >
                {formik.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Saving...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="px-6"
                onClick={handleBack}
                disabled={formik.isSubmitting}
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FrmTradeCategoryConfigMst;
