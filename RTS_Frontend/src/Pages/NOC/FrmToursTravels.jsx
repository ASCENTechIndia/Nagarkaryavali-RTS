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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import ApplicantDetails from "@/components/ApplicantDetails";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import config from "@/utils/config";
import { toursAndTravelsValidationSchema } from "@/validations/global.validation";

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
  propertyNo: "",
  businessAddress: "",
  applicationDocument: null,
};

const FrmToursTravels = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const location = useLocation();
  const locationState = location.state || {};

  console.log("locationState: ", locationState);

  const ulbId = locationState.ulbId || user?.ulbId;
  const userId = locationState.userId || user?.userId;
  const serviceId = locationState.serviceId;
  const serviceName = locationState.serviceName;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const uploadDocument = async (toursAndTravelsId, doc) => {
    const formData = new FormData();
    formData.append("corpId", user?.corpId);
    formData.append("serviceId", serviceId);
    formData.append("appNo", toursAndTravelsId);
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
        }
      );
      return response.data.ok === true;
    } catch (error) {
      console.error("Error uploading document:", error);
      return false;
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setLoading(true);

    try {
      const validationResult = toursAndTravelsValidationSchema.safeParse({
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        mobileNo: values.mobileNo,
        emailId: values.emailId,
        aadharNo: values.aadharNo,
        residentialAddress: values.residentialAddress,
        propertyNo: values.propertyNo,
        businessAddress: values.businessAddress,
        businessType: values.businessType,
        businessDescription: values.businessDescription,
        applicationDocument: values.applicationDocument,
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0];
        Swal.fire({
          text: firstError.message,
          confirmButtonColor: "#1e3a8a",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
        setLoading(false);
        return;
      }

      if (!values.applicationDocument) {
        Swal.fire({
          text: "Please upload the required document",
          confirmButtonColor: "#1e3a8a",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
        setLoading(false);
        return;
      }

      const loader = Swal.fire({
        title: "Submitting Application...",
        text: "Please wait while we process your application.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      const fullName = [values.firstName, values.middleName, values.lastName]
        .filter(name => name && name.trim() !== "")
        .join(" ");

      let businessTypeValue = null;
      if (values.businessType && values.businessType !== "") {
        businessTypeValue = Number(values.businessType);
        if (isNaN(businessTypeValue)) businessTypeValue = null;
      }

      const payload = {
        userId: user?.userId,
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
        propertyNo: values.propertyNo,
        businessAddress: values.businessAddress,
        appSource: config.source,
      };

      console.log("Submit Payload:", payload);

      const submitResponse = await axios.post(
        `${BASE_URL}/api/FrmToursTravels/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      if (!submitResponse.data.ok) {
        loader.close();
        Swal.fire({
          text: submitResponse.data.message || "Application submission failed",
          confirmButtonColor: "#1e3a8a",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
        setLoading(false);
        return;
      }

      console.log("submitResponse", submitResponse);

      const toursAndTravelsId = submitResponse.data.data?.toursAndTravelsId;
      const message = `${submitResponse.data.message}. Tours And Travels Id: ${submitResponse.data.data?.toursAndTravelsId}` || "Application submitted successfully";

      if (toursAndTravelsId && values.applicationDocument) {
        const docId = 1; 
        
        const docUploadSuccess = await uploadDocument(toursAndTravelsId, {
          docId: docId,
          docName: "Application Document",
          docType: "PDF",
          file: values.applicationDocument,
        });

        if (!docUploadSuccess) {
          loader.close();
          Swal.fire({
            text: "Failed to upload document. Please try again.",
            confirmButtonColor: "#1e3a8a",
            confirmButtonText: "OK",
            allowOutsideClick: false,
          });
          setLoading(false);
          return;
        }
      }

      loader.close();

      Swal.fire({
        text: `${message}`,
        confirmButtonColor: "#1e3a8a",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        resetForm();
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = "";
        }
        setFieldValue("applicationDocument", null);
        navigate("/app/FrmTrackApplication", { 
          state: { applicationNo: toursAndTravelsId } 
        });
      });

    } catch (error) {
      console.error("Error submitting application:", error);
      Swal.fire({
        text: error?.response?.data?.message || "Error submitting application. Please try again.",
        confirmButtonColor: "#1e3a8a",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleReset = (resetForm, setFieldValue) => {
    resetForm();
    setFieldValue("applicationDocument", null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
    Swal.fire({
      text: "Form has been reset successfully",
      confirmButtonColor: "#1e3a8a",
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
        resetForm,
        isSubmitting,
      }) => (
        <Form>
          <div className="space-y-6">
            <ApplicantDetails />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="border shadow-sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">
                    आवश्यक डेटा : NOC for {serviceName}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label
                          required
                          text="मालमत्ता क्रमांक"
                        />
                        <span>:</span>
                      </div>

                      <div className="flex w-full gap-1">
                        <Input
                          name="propertyNo"
                          value={
                            values.propertyNo || ""
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label
                          required
                          text="व्यवसायाचा पत्ता"
                        />
                        <span>:</span>
                      </div>

                      <Input
                        name="businessAddress"
                        value={
                          values.businessAddress ||
                          ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
                            event.target.files?.[0] ||
                            null;

                          setFieldValue(
                            "applicationDocument",
                            file
                          );
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
                {loading
                  ? "Submitting..."
                  : "Submit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200"
                onClick={() => handleReset(resetForm, setFieldValue)}
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

export default FrmToursTravels;