import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import config from "@/utils/config";

const FrmLicenseTypeMst = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    mode,
    licenseId: incomingLicenseId,
    licenseTypeName: incomingLicenseTypeName,
    ulbId: incomingUlbId,
  } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    licenseId: incomingLicenseId || "",
    licenseTypeName: incomingLicenseTypeName || "",
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const modeNumber = parseInt(mode, 10) || 1;
  const isEditMode = modeNumber === 2;

  const ulbId =
    incomingUlbId ||
    user?.ulbId ||
    user?.ulbid ||
    user?.ULBID ||
    user?.ulb_id ||
    1;

  const userId = user?.userId || user?.USERID || "admin";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const callSaveApi = async (payload) => {
    const res = await axios.post(
      `${BASE_URL}/api/FrmLicenseType/license-type-save`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
        timeout: 30000,
      }
    );
    return res.data?.data || res.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.licenseTypeName?.trim()) {
      Swal.fire({
        text: "License Type Name is required",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        userId,
        licenseTypeId: isEditMode ? Number(formData.licenseId) : null,
        licenseTypeName: formData.licenseTypeName.trim(),
        ulbId,
        mode: isEditMode ? 2 : 1,
        ipAddress: "",
        ipSource: config.source,
      };

      const body = await callSaveApi(payload);

      if (body?.success) {
        await Swal.fire({
          text: body.message || "Saved successfully",
          confirmButtonColor: "#1e3a8a",
        });
        navigate("/app/FrmLicenseTypeList");
      } else {
        Swal.fire({
          text: body?.message || "Failed to save",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);

      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error saving data. Please try again.";

      Swal.fire({
        text: msg,
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.licenseId) {
      Swal.fire({
        text: "License Type Id is missing",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    const confirm = await Swal.fire({
      text: `Are you sure you want to delete "${formData.licenseTypeName}"?`,
      showCancelButton: true,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      setIsLoading(true);

      const payload = {
        userId,
        licenseTypeId: Number(formData.licenseId),
        licenseTypeName: formData.licenseTypeName,
        ulbId,
        mode: 3,
        ipAddress: "",
        ipSource: config.source,
      };

      const body = await callSaveApi(payload);

      if (body?.success) {
        await Swal.fire({
          text: body.message || "Deleted successfully",
          confirmButtonColor: "#1e3a8a",
        });
        navigate("/app/FrmLicenseTypeList");
      } else {
        Swal.fire({
          text: body?.message || "Failed to delete",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);

      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error deleting data. Please try again.";

      Swal.fire({
        text: msg,
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/app/FrmLicenseTypeList");
  };

  return (
    <div className="p-2 sm:p-4">
      <Card className="border shadow-sm">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="text-xl font-semibold">
            License Type Master
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center mt-4">
              <div className="grid grid-cols-[auto_1fr] items-center gap-10 w-full max-w-lg">
                <Label className="whitespace-nowrap required">
                  License Type Name:
                </Label>
                <Input
                  name="licenseTypeName"
                  value={formData.licenseTypeName}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : isEditMode ? "Update" : "Submit"}
                </Button>

                {isEditMode && (
                  <Button
                    className="bg-gray-200 text-black hover:bg-gray-300 min-w-[100px]"
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    {isLoading ? "Please wait..." : "Delete"}
                  </Button>
                )}

                <Button
                  className="bg-gray-200 text-black hover:bg-gray-300 min-w-[100px]"
                  type="button"
                  onClick={handleBack}
                >
                  Back
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FrmLicenseTypeMst;