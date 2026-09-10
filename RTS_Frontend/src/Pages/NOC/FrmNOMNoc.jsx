import React, { useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

import ApplicantDetails from "@/components/ApplicantDetails";
import { DatePicker } from "@/components/ui/calendar";

import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import config from "@/utils/config";

const initialValues = {
  // Applicant Details
  firstName: "",
  middleName: "",
  lastName: "",
  countryCode: "+91",
  mobileNo: "",
  emailId: "",
  aadharNo: "",
  residentialAddress: "",
  panCard: "",
  organizationName: "",
  organizationAddress: "",
  businessType: "",
  businessDescription: "",

  // NOC Details
  permissionFromDate: null,
  permissionToDate: null,
  propertyNo: "",
  businessAddress: "",
  mandapRequestedArea: "",

  // Document
  applicationDocument: null,
};

const FrmNOMNoc = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const { user, token } = useAuth();

  const locationState = location.state || {};

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const ulbId = locationState.ulbId || user?.ulbId;

  const userId = locationState.userId || user?.userId;

  const serviceId = locationState.serviceId;

  const serviceName = locationState.serviceName || "NOC for Mandap";

  console.log("Location State:", locationState);

  console.log("ULB ID:", ulbId);

  console.log("User ID:", userId);

  console.log("Service ID:", serviceId);

  // ============================================================
  // DATE FORMATTER
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return "";
    }

    const year = selectedDate.getFullYear();

    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");

    const day = String(selectedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ============================================================
  // DOCUMENT UPLOAD
  // ============================================================

  const uploadDocument = async (mandapStallId, doc) => {
    const formData = new FormData();

    formData.append("corpId", user?.corpId);

    formData.append("serviceId", serviceId);

    formData.append("appNo", mandapStallId);

    formData.append("docType", doc.docType || "PDF");

    formData.append("documentId", String(doc.docId || "1"));

    formData.append("document", doc.file);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmAssessmentCerti/upload-document`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data.ok === true;
    } catch (error) {
      console.error("Error uploading Mandap document:", error);

      return false;
    }
  };

  const handleSubmit = async (
    values,
    { resetForm, setSubmitting, setFieldValue },
  ) => {
    setLoading(true);

    let loader;

    try {
 
      if (!values.permissionFromDate) {
        Swal.fire({
          icon: "warning",
          text: "परवानगी या दिनांकापासून निवडा",
          confirmButtonColor: "#1e3a8a",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        return;
      }

      if (!values.permissionToDate) {
        Swal.fire({
          icon: "warning",
          text: "परवानगी या दिनांकापर्यंत निवडा",
          confirmButtonColor: "#1e3a8a",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        return;
      }

      if (!values.propertyNo?.trim()) {
        Swal.fire({
          icon: "warning",
          text: "मालमत्ता क्रमांक आवश्यक आहे",
          confirmButtonColor: "#1e3a8a",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        return;
      }

      if (!values.businessAddress?.trim()) {
        Swal.fire({
          icon: "warning",
          text: "व्यवसायचा पत्ता आवश्यक आहे",
          confirmButtonColor: "#1e3a8a",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        return;
      }

      if (!values.mandapRequestedArea) {
        Swal.fire({
          icon: "warning",
          text: "मंडपसाठी विनंती केलेले क्षेत्र आवश्यक आहे",
          confirmButtonColor: "#1e3a8a",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        return;
      }

      const permissionFrom = formatDate(values.permissionFromDate);

      const permissionTo = formatDate(values.permissionToDate);

      if (!permissionFrom) {
        Swal.fire({
          icon: "warning",
          text: "Invalid Permission From date",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }

      if (!permissionTo) {
        Swal.fire({
          icon: "warning",
          text: "Invalid Permission To date",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }

      if (new Date(permissionFrom) > new Date(permissionTo)) {
        Swal.fire({
          icon: "warning",
          text: "Permission From date cannot be greater than Permission To date",
          confirmButtonColor: "#1e3a8a",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        return;
      }

      if (!values.applicationDocument) {
        Swal.fire({
          icon: "warning",
          text: "Please upload the required document",
          confirmButtonColor: "#1e3a8a",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        return;
      }

      let businessTypeValue = null;

      if (
        values.businessType !== undefined &&
        values.businessType !== null &&
        values.businessType !== ""
      ) {
        businessTypeValue = Number(values.businessType);

        if (Number.isNaN(businessTypeValue)) {
          Swal.fire({
            icon: "warning",
            text: "Invalid Business Type",
            confirmButtonColor: "#1e3a8a",
            confirmButtonText: "OK",
          });

          return;
        }
      }

      const fullName = [values.firstName, values.middleName, values.lastName]
        .filter((name) => name && name.trim() !== "")
        .join(" ");

      const payload = {
        userId: userId,

        applicantName: fullName,

        mobileNo: values.mobileNo,

        emailId: values.emailId,

        aadhaarNo: values.aadharNo || "",

        residentialAddress: values.residentialAddress || "",

        panCardNo: values.panCard || "",

        orgName: values.organizationName || "",

        orgAddress: values.organizationAddress || "",

        businessType: businessTypeValue,

        businessDescription: values.businessDescription || "",

        permissionFrom: permissionFrom,

        permissionTo: permissionTo,

        propertyNo: values.propertyNo,

        businessAddress: values.businessAddress,

        mandapArea: values.mandapRequestedArea,
      };


      loader = Swal.fire({
        title: "Submitting Application...",
        text: "Please wait while we process your application.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const submitResponse = await axios.post(
        `${BASE_URL}/api/FrmMandapStall/submit-mandap`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        },
      );

    
      if (!submitResponse.data?.ok) {
        if (loader) {
          loader.close();
        }

        Swal.fire({
          icon: "error",
          text: submitResponse.data?.message || "Application submission failed",
          confirmButtonColor: "#1e3a8a",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        return;
      }



      const mandapStallId = submitResponse.data?.data?.mandapStallId;

      const successMessage =
        submitResponse.data?.message ||
        submitResponse.data?.data?.message ||
        "Mandap / Stall application submitted successfully";


      if (mandapStallId && values.applicationDocument) {
        const docUploadSuccess = await uploadDocument(mandapStallId, {
          docId: 1,

          docName: "Application Document",

          docType: "PDF",

          file: values.applicationDocument,
        });

        if (!docUploadSuccess) {
          if (loader) {
            loader.close();
          }

          Swal.fire({
            icon: "warning",
            text: "Application submitted, but document upload failed. Please try again.",
            confirmButtonColor: "#1e3a8a",
            confirmButtonText: "OK",
            allowOutsideClick: false,
          });

          return;
        }
      }


      if (loader) {
        loader.close();
      }

    

      await Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: `${successMessage}. Mandap / Stall ID: ${mandapStallId}`,
        confirmButtonColor: "#1e3a8a",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });

    
      resetForm();

      const fileInput = document.querySelector('input[type="file"]');

      if (fileInput) {
        fileInput.value = "";
      }

      setFieldValue("applicationDocument", null);


      navigate("/app/FrmTrackApplication", {
        state: {
          applicationNo: mandapStallId,
        },
      });
    } catch (error) {
      console.error("Error submitting Mandap / Stall application:", error);

      if (loader) {
        loader.close();
      }

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Error submitting application. Please try again.",
        confirmButtonColor: "#1e3a8a",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };


  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={false}
    >
      {({
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        resetForm,
        isSubmitting,
      }) => (
        <Form>
          <div className="space-y-6">
          
            <ApplicantDetails />

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
                    आवश्यक डेटा : NOC for Mandap
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PERMISSION FROM */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="परवानगी या दिनांकापासून" />

                        <span>:</span>
                      </div>

                      <DatePicker
                        value={values.permissionFromDate}
                        onChange={(date) =>
                          setFieldValue("permissionFromDate", date)
                        }
                        className="w-full"
                      />
                    </div>

                    {/* PERMISSION TO */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="परवानगी या दिनांकापर्यंत" />

                        <span>:</span>
                      </div>

                      <DatePicker
                        value={values.permissionToDate}
                        onChange={(date) =>
                          setFieldValue("permissionToDate", date)
                        }
                        className="w-full"
                      />
                    </div>

                    {/* PROPERTY NUMBER */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="मालमत्ता क्रमांक" />

                        <span>:</span>
                      </div>

                      <Input
                        name="propertyNo"
                        value={values.propertyNo || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    {/* BUSINESS ADDRESS */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="व्यवसायचा पत्ता" />

                        <span>:</span>
                      </div>

                      <Input
                        name="businessAddress"
                        value={values.businessAddress || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    {/* MANDAP AREA */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="मंडपसाठी विनंती केलेले क्षेत्र" />

                        <span>:</span>
                      </div>

                      <Input
                        type="number"
                        name="mandapRequestedArea"
                        value={values.mandapRequestedArea || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        step="any"
                        className="w-full h-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>


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
                    कागदपत्रे अपलोड करा
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-6">
                  <div className="flex justify-end">
                    <span className="text-xs text-red-500">
                      (अनुमान फाईल स्वरूप: jpg, jpeg, gif, png, pdf)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-56 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="विहीत नमुन्यातील अर्ज" />

                        <span>:</span>
                      </div>

                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.gif,.png,.pdf"
                        className="w-full h-9 p-1"
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null;

                          setFieldValue("applicationDocument", file);
                        }}
                      />
                    </div>

                    <div className="flex items-center">
                      {values.applicationDocument ? (
                        <span className="text-sm text-gray-600">
                          Selected file:{" "}
                          <strong>{values.applicationDocument.name}</strong>
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No file selected
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>


            <div className="flex justify-center items-center gap-3 pt-4 pb-6">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200"
                path="/"
              >
                मागे जा
              </Button>

              <Button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white"
                disabled={loading || isSubmitting}
              >
                {loading ? "Submitting..." : "अर्ज सादर करा"}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmNOMNoc;
