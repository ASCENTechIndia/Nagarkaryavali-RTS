import React, { useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import config from "@/utils/config";
import ApplicantDetails from "@/components/ApplicantDetails";

const initialValues = {
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
  propertyNumber: "",
  businessAddress: "",
  waterConnectionNo: "",
  buildingPermitNo: "",
  occupancyCertificateNo: "",
  applicationDocument: null,
};

const FrmMeatShopNOC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  const locationState = location.state || {};
  const ulbId = locationState.ulbId || user?.ulbId;
  const userId = locationState.userId || user?.userId;
  const serviceId =
    locationState.serviceId || sessionStorage.getItem("ServiceId");

  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const validateFields = (values) => {
    if (!values.firstName?.trim()) {
      Swal.fire({
        text: "कृपया पहिले नाव प्रविष्ट करा",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (!values.middleName?.trim()) {
      Swal.fire({
        text: "कृपया मधले नाव प्रविष्ट करा",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (!values.lastName?.trim()) {
      Swal.fire({
        text: "कृपया आडनाव प्रविष्ट करा",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (!values.mobileNo?.trim()) {
      Swal.fire({
        text: "कृपया मोबाइल क्रमांक प्रविष्ट करा",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (values.mobileNo.length !== 10 || !/^\d+$/.test(values.mobileNo)) {
      Swal.fire({
        text: "अवैध मोबाइल क्रमांक - 10 अंक असणे आवश्यक आहे",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (!values.emailId?.trim()) {
      Swal.fire({
        text: "कृपया ई-मेल आयडी प्रविष्ट करा",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    const emailRegex = /^([\w\.\-\+]+)@([\w\-]+)((\.(\w){2,3})+)$/;
    if (!emailRegex.test(values.emailId)) {
      Swal.fire({
        text: "अवैध ई-मेल पत्ता",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (!values.aadharNo?.trim()) {
      Swal.fire({
        text: "कृपया आधार क्रमांक प्रविष्ट करा",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (values.aadharNo.length !== 12 || !/^\d+$/.test(values.aadharNo)) {
      Swal.fire({
        text: "अवैध आधार क्रमांक - 12 अंक असणे आवश्यक आहे",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (!values.residentialAddress?.trim()) {
      Swal.fire({
        text: "कृपया निवासी पत्ता प्रविष्ट करा",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (
      !values.businessType ||
      values.businessType === "0" ||
      values.businessType === ""
    ) {
      Swal.fire({
        text: "कृपया व्यवसायाचा प्रकार निवडा",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (!values.businessDescription?.trim()) {
      Swal.fire({
        text: "कृपया व्यवसायाचे वर्णन प्रविष्ट करा",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (!values.propertyNumber?.trim()) {
      Swal.fire({
        text: "कृपया मालमत्ता क्रमांक प्रविष्ट करा",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    if (!values.businessAddress?.trim()) {
      Swal.fire({
        text: "कृपया व्यवसायाचा पत्ता प्रविष्ट करा",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  setLoading(true);

  try {
    if (!validateFields(values)) {
      setLoading(false);
      setSubmitting(false);
      return;
    }

    const loader = Swal.fire({
      text: "अर्ज सबमिट केला जात आहे...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    const payload = {
      userId: String(userId),
      serviceId: String(serviceId || "MEAT001"),
      ulbId: Number(ulbId),
      firstName: values.firstName?.trim() || "",
      middleName: values.middleName?.trim() || "",
      lastName: values.lastName?.trim() || "",
      mobileNo: values.mobileNo?.trim() || "",
      emailId: values.emailId?.trim() || "",
      aadharNo: values.aadharNo?.trim() || "",
      residentialAddress: values.residentialAddress?.trim() || "",
      panCard: values.panCard?.trim() || "",
      organizationName: values.organizationName?.trim() || "",
      organizationAddress: values.organizationAddress?.trim() || "",
      businessType: values.businessType,
      businessDescription: values.businessDescription?.trim() || "",
      propertyNumber: values.propertyNumber?.trim() || "",
      businessAddress: values.businessAddress?.trim() || "",
      waterConnectionNo: values.waterConnectionNo?.trim() || "",
      buildingPermitNo: values.buildingPermitNo?.trim() || "",
      occupancyCertificateNo: values.occupancyCertificateNo?.trim() || "",
      source: config.source,
    };

    console.log("Submit Payload:", payload);

    const response = await axios.post(
      `${BASE_URL}/api/FrmMeatShopNOC/submit`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${
            token || localStorage.getItem("token")
          }`,
          "Content-Type": "application/json",
        },
      }
    );

    loader.close();

    console.log("Submit Response:", response.data);

    const responseData = response.data;
    const isSuccess =
      responseData?.ok === true &&
      responseData?.data?.success === true;

    if (isSuccess) {
      const applicationNo =
        responseData.data?.applicationNo ||
        responseData.data?.meatShopId ||
        "";

      const message = applicationNo
        ? `अर्ज यशस्वीरित्या सबमिट केला गेला. तुमचा अर्ज क्रमांक ${applicationNo} आहे.`
        : "अर्ज यशस्वीरित्या सबमिट केला गेला.";

      Swal.fire({
        text: message,
        confirmButtonText: "OK",
        confirmButtonColor: "#1e3a8a",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/app/FrmTrackApplication", {
            state: {
              applicationNo,
              serviceName: "नाहरकत दाखला",
              ulbId,
            },
          });
        }
      });
    } else {
      const errorMessage =
        responseData?.data?.message ||
        responseData?.message ||
        "अर्ज सबमिट करण्यात अयशस्वी";

      Swal.fire({
        text: errorMessage,
        confirmButtonText: "OK",
        confirmButtonColor: "#1e3a8a",
      });
    }
  } catch (error) {
    console.error("Submit Error:", error);
    if (error.response) {
      console.error("Submit Error Response Data:", error.response.data);
    }

    let errorMessage =
      "अर्ज सबमिट करताना त्रुटी. कृपया पुन्हा प्रयत्न करा.";

    if (error.response) {
      errorMessage =
        error.response.data?.data?.message ||
        error.response.data?.message ||
        error.response.data?.error ||
        errorMessage;
    } else if (error.request) {
      errorMessage =
        "सर्व्हरकडून प्रतिसाद नाही. कृपया तुमचे कनेक्शन तपासा.";
    } else {
      errorMessage = error.message;
    }

    Swal.fire({
      text: errorMessage,
      confirmButtonText: "OK",
      confirmButtonColor: "#1e3a8a",
    });
  } finally {
    setLoading(false);
    setSubmitting(false);
  }
};

  const handleReset = (resetForm) => {
    Swal.fire({
      text: "रिसेट करायचे?",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      confirmButtonText: "होय",
      cancelButtonText: "रद्द करा",
    }).then((result) => {
      if (result.isConfirmed) {
        resetForm();
      }
    });
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
        isSubmitting,
        resetForm,
      }) => (
        <Form>
          <div className="space-y-6">
            <ApplicantDetails />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border shadow-sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">
                    आवश्यक डेटा : Meat Shop NOC
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="मालमत्ता क्रमांक" />
                        <span>:</span>
                      </div>
                      <Input
                        name="propertyNumber"
                        value={values.propertyNumber || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="व्यवसायाचा पत्ता" />
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

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="नळ जोडणी क्र." />
                        <span>:</span>
                      </div>
                      <Input
                        name="waterConnectionNo"
                        value={values.waterConnectionNo || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="बांधकाम परवानगी प्रस्ताव क्र" />
                        <span>:</span>
                      </div>
                      <Input
                        name="buildingPermitNo"
                        value={values.buildingPermitNo || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="भोगावटा प्रमाणपत्र क्र" />
                        <span>:</span>
                      </div>
                      <Input
                        name="occupancyCertificateNo"
                        value={values.occupancyCertificateNo || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                        <Label
                          required
                          text="विहीत नमुन्यातील अर्ज आणि बॅनर होर्डिंग्ज फोटो"
                        />
                        <span>:</span>
                      </div>

                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.gif,.png,.pdf"
                        className="w-full h-9 p-1"
                        onChange={(event) => {
                          const file =
                            event.target.files?.[0] || null;
                          setFieldValue("applicationDocument", file);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="flex justify-center items-center gap-3 pt-4 pb-6">

              <Button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white"
                disabled={loading || isSubmitting}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200"
                onClick={() => handleReset(resetForm)}
              >
                Reset
              </Button>


            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmMeatShopNOC;