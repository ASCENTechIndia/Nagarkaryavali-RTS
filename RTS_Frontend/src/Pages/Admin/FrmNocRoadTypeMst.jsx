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
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useFormik } from "formik";

const FrmNocRoadTypeMst = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { token, user } = useAuth();

  const locationState  = location.state || {};
  const mode           = locationState.mode || "1";   
  const selectedData   = locationState.selectedData || null;

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    document.title = mode === "2" ? "Edit Road Type" : "Add Road Type";
  }, [mode]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      roadTypeName:
        mode === "2" && selectedData
          ? selectedData.roadTypeName || selectedData.ROADTYPENAME || ""
          : "",
    },
    onSubmit: async (values, { setSubmitting }) => {
     
      if (!values.roadTypeName.trim()) {
        Swal.fire({
          text: "Please enter Road Type Name.",
          confirmButtonColor: "#1e3a8a",
        });
        setSubmitting(false);
        return;
      }
      try {
        const userId = user?.EmpUserName || user?.userId || user?.userid || user?.USERID || sessionStorage.getItem("userId") || "";
        const ulbId  = user?.ulbId || Number(sessionStorage.getItem("ulbId") || 1);

        const payload = {
          userId:       String(userId),
          roadTypeName: values.roadTypeName.trim(),
          ulbId:        Number(ulbId),
          mode:         mode === "2" ? 2 : 1,
          ipSource:     "WEB",
          ...(mode === "2" && selectedData
            ? { roadTypeId: selectedData.roadTypeId || selectedData.ROADTYPEID || 0 }
            : {}),
        };

        const response = await axios.post(
          `${BASE_URL}/api/FrmNocRoadType/save`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data?.ok) {
          await Swal.fire({
            text: response.data?.data?.message || "Road type saved successfully.",
            confirmButtonColor: "#1e3a8a",
          });
          navigate("/app/FrmNocRoadType");
        } else {
          Swal.fire({
            text: response.data?.message || "Failed to save. Please try again.",
            confirmButtonColor: "#1e3a8a",
          });
        }
      } catch (error) {
        console.error("Error saving road type:", error);
        Swal.fire({
          text:
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            "An error occurred. Please try again.",
          confirmButtonColor: "#1e3a8a",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const handleBack = () => navigate(-1);

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this road type?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setIsDeleting(true);
    try {
      const userId = user?.EmpUserName || user?.userId || user?.userid || user?.USERID || sessionStorage.getItem("userId") || "";
      const ulbId  = user?.ulbId || Number(sessionStorage.getItem("ulbId") || 1);
      const roadTypeId = selectedData?.roadTypeId || selectedData?.ROADTYPEID || selectedData?.NUM_ROADTYPE_ID || 0;

      const payload = {
        userId:       String(userId),
        roadTypeId:   Number(roadTypeId),
        roadTypeName: formik.values.roadTypeName.trim() || selectedData?.roadTypeName || selectedData?.ROADTYPENAME || "Road",
        ulbId:        Number(ulbId),
        mode:         3,
        ipSource:     "WEB",
      };

      const response = await axios.post(
        `${BASE_URL}/api/FrmNocRoadType/save`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.ok) {
        await Swal.fire({
          text: response.data?.data?.message || response.data?.message || "Road type deleted successfully.",
          confirmButtonColor: "#1e3a8a",
        });
        navigate("/app/FrmNocRoadType");
      } else {
        Swal.fire({
          text: response.data?.message || "Failed to delete.",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      console.error("Error deleting road type:", error);
      Swal.fire({
        text:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to delete. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold boxHead">
            {mode === "2" ? "Edit Road Type" : "Add Road Type"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-5 max-w-2xl mx-auto py-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <Label
                htmlFor="road-type-name"
                className="sm:w-48 sm:text-right text-sm font-medium text-gray-700 shrink-0 pt-1"
              >
                Road Type Name&nbsp;
                <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-col gap-1 w-full sm:w-72">
                <Input
                  id="road-type-name"
                  type="text"
                  placeholder="Enter road type name"
                  value={formik.values.roadTypeName}
                  onChange={formik.handleChange("roadTypeName")}
                  onBlur={formik.handleBlur("roadTypeName")}
                  disabled={formik.isSubmitting || isDeleting}
                  className="h-9 w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={formik.isSubmitting || isDeleting}
              >
                {formik.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Saving...
                  </span>
                ) : mode === "2" ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>

              {mode === "2" && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={formik.isSubmitting || isDeleting}
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={formik.isSubmitting || isDeleting}
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

export default FrmNocRoadTypeMst;
