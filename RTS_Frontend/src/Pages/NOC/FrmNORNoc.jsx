import React, { useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/calendar";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import ApplicantDetails from "@/components/ApplicantDetails";
import { useAuth } from "@/context/AuthContext";

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

  permissionFromDate: null,
  permissionToDate: null,

  propertyNo: "",
  businessAddress: "",

  roadType: "",
  roadLength: "",
  roadWidth: "",
  roadLengthWidth: "",

  excavationSize: "",
  excavationStartPoint: "",
  excavationEndPoint: "",

  latitude: "",
  longitude: "",



  applicationDocument: null,
};

const ROAD_TYPES = [
  {
    id: "tar",
    name: "डांबरी",
  },
  {
    id: "concrete",
    name: "सिमेंट काँक्रीट",
  },
  {
    id: "soil",
    name: "मातीचा रस्ता",
  },
  {
    id: "other",
    name: "इतर",
  },
];

const FrmNORNoc = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, token } = useAuth();

  const locationState = location.state || {};

  const ulbId = locationState.ulbId || user?.ulbId;

  const userId = locationState.userId || user?.userId;

  const serviceId = locationState.serviceId;

  const serviceName = locationState.serviceName;

  const BASE_URL = import.meta.env.VITE_BASE_URL;



  const formatDateForApi = (date) => {
    if (!date) {
      return null;
    }

    if (!(date instanceof Date) || isNaN(date)) {
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

const uploadDocument = async (
  applicationNo,
  doc
) => {
  if (!applicationNo || !doc?.file) {
    return false;
  }

  try {
    const formData = new FormData();

    if (user?.corpId) {
      formData.append(
        "corpId",
        String(user.corpId)
      );
    }

    if (serviceId) {
      formData.append(
        "serviceId",
        String(serviceId)
      );
    }

    formData.append(
      "appNo",
      String(applicationNo)
    );

    // DB column VAR_APPDOC_DOCTYPE supports max 4 chars
    formData.append(
      "docType",
      "PDF"
    );

    formData.append(
      "documentId",
      String(doc.docId || "1")
    );

    formData.append(
      "document",
      doc.file
    );

    const response = await axios.post(
      `${BASE_URL}/api/FrmAssessmentCerti/upload-document`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${
            token ||
            user?.token ||
            localStorage.getItem("token")
          }`,
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    console.log(
      "Document Upload Response:",
      response.data
    );

    return (
      response.data?.ok === true ||
      response.data?.success === true
    );
  } catch (error) {
    console.error(
      "Electrical document upload error:",
      error
    );

    return false;
  }
};

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);

    let loader;

    try {

      if (!userId) {
        await Swal.fire({
          icon: "warning",
          text: "User ID is not available.",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }

      if (!values.permissionFromDate) {
        await Swal.fire({
          icon: "warning",
          text: "परवानगी या दिनांकापासून निवडा.",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }

      if (!values.permissionToDate) {
        await Swal.fire({
          icon: "warning",
          text: "परवानगी या दिनांकापर्यंत निवडा.",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }

      const permissionFrom = formatDateForApi(values.permissionFromDate);

      const permissionTo = formatDateForApi(values.permissionToDate);

      if (!permissionFrom || !permissionTo) {
        await Swal.fire({
          icon: "warning",
          text: "Please select valid permission dates.",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }

      if (new Date(permissionFrom) > new Date(permissionTo)) {
        await Swal.fire({
          icon: "warning",
          text: "Permission From Date cannot be greater than Permission To Date.",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }

      if (!values.propertyNo?.trim()) {
        await Swal.fire({
          icon: "warning",
          text: "मालमत्ता क्रमांक आवश्यक आहे.",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }

      if (!values.businessAddress?.trim()) {
        await Swal.fire({
          icon: "warning",
          text: "व्यवसायचा पत्ता आवश्यक आहे.",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }

      if (!values.applicationDocument) {
        await Swal.fire({
          icon: "warning",
          text: "Please upload the required application document.",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }


      const fullName = [values.firstName, values.middleName, values.lastName]
        .filter((name) => name && name.trim() !== "")
        .join(" ");

    
      let businessTypeValue = null;

      if (values.businessType && values.businessType !== "") {
        businessTypeValue = Number(values.businessType);

        if (Number.isNaN(businessTypeValue)) {
          businessTypeValue = null;
        }
      }

    
      const payload = {
        userId: userId,

        applicantName: fullName,

        mobileNo: values.mobileNo || "",

        emailId: values.emailId || "",

        aadhaarNo: values.aadharNo || "",

        residentialAddress: values.residentialAddress || "",

        panCardNo: values.panCard || "",

        orgName: values.organizationName || "",

        orgAddress: values.organizationAddress || "",

        businessType: businessTypeValue,

        businessDescription: values.businessDescription || "",

        permissionFrom: permissionFrom,

        permissionTo: permissionTo,

        propertyNo: values.propertyNo || "",

        businessAddress: values.businessAddress || "",

        roadType: values.roadType || "",

        roadLength: values.roadLength || "",

        roadWidth: values.roadWidth || "",

        // IMPORTANT:
        // Backend expects roadLengthWidth
        roadLengthWidth: values.roadLengthWidth || "",

        excavationSize: values.excavationSize || "",

        excavationStartPoint: values.excavationStartPoint || "",

        excavationEndPoint: values.excavationEndPoint || "",

        latitude: values.latitude || "",

        longitude: values.longitude || "",
      };


      loader = Swal.fire({
        title: "Submitting Application...",
        text: "Please wait while we process your application.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const submitResponse = await axios.post(
        `${BASE_URL}/api/FrmElectrical/submit-electrical`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${
              token || user?.token || localStorage.getItem("token")
            }`,
          },
        },
      );

      console.log("Electrical Submit Response:", submitResponse.data);

      if (!submitResponse.data?.ok) {
        if (loader) {
          loader.close();
        }

        await Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            submitResponse.data?.message ||
            "Electrical application submission failed.",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }

 
      const electricalId = submitResponse.data?.data?.electricalId;

      const successMessage =
        submitResponse.data?.message ||
        submitResponse.data?.data?.message ||
        "Electrical details successfully inserted";

      console.log("Electrical ID:", electricalId);

      if (!electricalId) {
        if (loader) {
          loader.close();
        }

        await Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "Application was submitted but Electrical ID was not returned.",
          confirmButtonColor: "#1e3a8a",
        });

        return;
      }


      if (values.applicationDocument) {
      const uploadSuccess =
  await uploadDocument(
    electricalId,
    {
      docId: 1,
      docName: "Application Document",
      docType: "PDF",
      file: values.applicationDocument,
    }
  );

        if (!uploadSuccess) {
          if (loader) {
            loader.close();
          }

          await Swal.fire({
            icon: "error",
            title: "Document Upload Failed",
            text: "Electrical application was submitted, but the document could not be uploaded.",
            confirmButtonColor: "#1e3a8a",
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
        text: `${successMessage}. Application No: ${electricalId}`,
        confirmButtonColor: "#1e3a8a",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });


      resetForm();

      const fileInput = document.querySelector('input[type="file"]');

      if (fileInput) {
        fileInput.value = "";
      }


      navigate("/app/FrmTrackApplication", {
        state: {
          applicationNo: electricalId,
        },
      });
    } catch (error) {
      console.error("Electrical Application Submit Error:", error);

      if (loader) {
        loader.close();
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Error submitting Electrical application. Please try again.";

      await Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: errorMessage,
        confirmButtonColor: "#1e3a8a",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={false}
    >
      {({ values, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          {" "}
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
                    आवश्यक डेटा : NOC for Road Digging
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

                    {/* PROPERTY NO */}

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

                    {/* ROAD TYPE */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="रस्त्याचे प्रकार" />

                        <span>:</span>
                      </div>

                      <Select
                        value={values.roadType || ""}
                        onValueChange={(value) =>
                          setFieldValue("roadType", value)
                        }
                      >
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="कृपया निवडा" />
                        </SelectTrigger>

                        <SelectContent showDefaultOption={false}>
                          {ROAD_TYPES.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ROAD LENGTH */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="रस्त्याची लांबी" />

                        <span>:</span>
                      </div>

                      <Input
                        type="number"
                        name="roadLength"
                        value={values.roadLength || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        step="any"
                        className="w-full h-9"
                      />
                    </div>

                    {/* ROAD WIDTH */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="रस्त्याची रुंदी" />

                        <span>:</span>
                      </div>

                      <Input
                        type="number"
                        name="roadWidth"
                        value={values.roadWidth || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        step="any"
                        className="w-full h-9"
                      />
                    </div>

                    {/* ROAD LENGTH WIDTH */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="रस्त्याची लांबी रुंदी" />

                        <span>:</span>
                      </div>

                      <Input
                        type="number"
                        name="roadLengthWidth"
                        value={values.roadLengthWidth || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        step="any"
                        className="w-full h-9"
                      />
                    </div>

                    {/* EXCAVATION SIZE */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="खोदण्याचे आकार" />

                        <span>:</span>
                      </div>

                      <Input
                        type="number"
                        name="excavationSize"
                        value={values.excavationSize || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        step="any"
                        className="w-full h-9"
                      />
                    </div>

                    {/* START POINT */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="खोदाईचे प्रारंभिक बिंदू" />

                        <span>:</span>
                      </div>

                      <Input
                        name="excavationStartPoint"
                        value={values.excavationStartPoint || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    {/* END POINT */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="खोदाईचे शेवटी बिंदू" />

                        <span>:</span>
                      </div>

                      <Input
                        name="excavationEndPoint"
                        value={values.excavationEndPoint || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    {/* LATITUDE */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="अक्षांश" />

                        <span>:</span>
                      </div>

                      <Input
                        type="number"
                        name="latitude"
                        value={values.latitude || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        step="any"
                        className="w-full h-9"
                      />
                    </div>

                    {/* LONGITUDE */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="रेखांश" />

                        <span>:</span>
                      </div>

                      <Input
                        type="number"
                        name="longitude"
                        value={values.longitude || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                disabled={loading}
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

export default FrmNORNoc;
