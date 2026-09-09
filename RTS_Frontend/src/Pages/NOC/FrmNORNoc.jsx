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
import { DatePicker } from "@/components/ui/calendar";
import Swal from "sweetalert2";

import ApplicantDetails from "@/components/ApplicantDetails";

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

  // Business Details
  businessType: "",
  businessDescription: "",

  // Road Digging Details
  permissionFromDate: null,
  permissionToDate: null,
  propertyNo: "",
  businessAddress: "",
  roadType: "",
  roadLength: "",
  roadWidth: "",
  roadArea: "",
  excavationSize: "",
  excavationStartPoint: "",
  excavationEndPoint: "",
  latitude: "",
  longitude: "",

  // Document
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

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      console.log(
        "================================================"
      );

      console.log("ROAD DIGGING FORM VALUES");

      console.log(
        "================================================"
      );

      console.log(values);

      const payload = {
        service: {
          serviceId: "1",
          serviceName: "NOC for Road Digging",
        },

        applicantDetails: {
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,

          mobileCountryCode: values.countryCode,
          mobileNo: values.mobileNo,

          emailId: values.emailId,
          aadharNo: values.aadharNo,

          residentialAddress:
            values.residentialAddress,

          panCard: values.panCard,

          organizationName:
            values.organizationName,

          organizationAddress:
            values.organizationAddress,

          businessType:
            values.businessType,

          businessDescription:
            values.businessDescription,
        },

        roadDigging: {
          permissionFromDate:
            values.permissionFromDate,

          permissionToDate:
            values.permissionToDate,

          propertyNo:
            values.propertyNo,

          businessAddress:
            values.businessAddress,

          roadType:
            values.roadType,

          roadLength:
            values.roadLength,

          roadWidth:
            values.roadWidth,

          roadArea:
            values.roadArea,

          excavationSize:
            values.excavationSize,

          excavationStartPoint:
            values.excavationStartPoint,

          excavationEndPoint:
            values.excavationEndPoint,

          latitude:
            values.latitude,

          longitude:
            values.longitude,
        },

        documents: {
          applicationDocument:
            values.applicationDocument
              ? {
                  name:
                    values.applicationDocument.name,

                  type:
                    values.applicationDocument.type,

                  size:
                    values.applicationDocument.size,
                }
              : null,
        },
      };

      console.log("FINAL PAYLOAD");
      console.log(payload);

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      Swal.fire({
        icon: "success",
        title: "UI Submission Successful",
        text:
          "All form values have been collected successfully.",
        confirmButtonColor: "#1e3a8a",
      });
    } catch (error) {
      console.error(
        "Submission error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "Something went wrong while collecting form values.",
        confirmButtonColor: "#1e3a8a",
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
      {({
        values,
        handleChange,
        handleBlur,
        setFieldValue,
      }) => (
        <Form>
          <div className="space-y-6">

            {/* =====================================================
                APPLICANT DETAILS
            ====================================================== */}

            <ApplicantDetails />

            {/* =====================================================
                ROAD DIGGING DETAILS
            ====================================================== */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="border shadow-sm">

                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">
                    आवश्यक डेटा : NOC for Road Digging
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* =================================================
                        परवानगी या दिनांकापासून
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          required
                          text="परवानगी या दिनांकापासून"
                        />

                        <span>:</span>

                      </div>

                      <DatePicker
                        value={
                          values.permissionFromDate
                        }
                        onChange={(date) =>
                          setFieldValue(
                            "permissionFromDate",
                            date
                          )
                        }
                        className="w-full"
                      />

                    </div>

                    {/* =================================================
                        परवानगी या दिनांकापर्यंत
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          required
                          text="परवानगी या दिनांकापर्यंत"
                        />

                        <span>:</span>

                      </div>

                      <DatePicker
                        value={
                          values.permissionToDate
                        }
                        onChange={(date) =>
                          setFieldValue(
                            "permissionToDate",
                            date
                          )
                        }
                        className="w-full"
                      />

                    </div>

                    {/* =================================================
                        मालमत्ता क्रमांक
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          required
                          text="मालमत्ता क्रमांक"
                        />

                        <span>:</span>

                      </div>

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

                    {/* =================================================
                        व्यवसायचा पत्ता
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          required
                          text="व्यवसायचा पत्ता"
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

                    {/* =================================================
                        रस्त्याचे प्रकार
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          text="रस्त्याचे प्रकार"
                        />

                        <span>:</span>

                      </div>

                      <Select
                        value={
                          values.roadType || ""
                        }
                        onValueChange={(value) =>
                          setFieldValue(
                            "roadType",
                            value
                          )
                        }
                      >

                        <SelectTrigger className="w-full h-9">

                          <SelectValue placeholder="कृपया निवडा" />

                        </SelectTrigger>

                        <SelectContent
                          showDefaultOption={false}
                        >

                          {ROAD_TYPES.map(
                            (item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id}
                              >
                                {item.name}
                              </SelectItem>
                            )
                          )}

                        </SelectContent>

                      </Select>

                    </div>

                    {/* =================================================
                        रस्त्याची लांबी
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          text="रस्त्याची लांबी"
                        />

                        <span>:</span>

                      </div>

                      <Input
                        type="number"
                        name="roadLength"
                        value={
                          values.roadLength || ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />

                    </div>

                    {/* =================================================
                        रस्त्याची रुंदी
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          text="रस्त्याची रुंदी"
                        />

                        <span>:</span>

                      </div>

                      <Input
                        type="number"
                        name="roadWidth"
                        value={
                          values.roadWidth || ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />

                    </div>

                    {/* =================================================
                        रस्त्याची लांबीरुंदी
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          text="रस्त्याची लांबीरुंदी"
                        />

                        <span>:</span>

                      </div>

                      <Input
                        type="number"
                        name="roadArea"
                        value={
                          values.roadArea || ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />

                    </div>

                    {/* =================================================
                        खोदण्याचे आकार
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          text="खोदण्याचे आकार"
                        />

                        <span>:</span>

                      </div>

                      <Input
                        type="number"
                        name="excavationSize"
                        value={
                          values.excavationSize ||
                          ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />

                    </div>

                    {/* =================================================
                        खोदाईचे प्रारंभिक बिंदू
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          text="खोदाईचे प्रारंभिक बिंदू"
                        />

                        <span>:</span>

                      </div>

                      <Input
                        name="excavationStartPoint"
                        value={
                          values.excavationStartPoint ||
                          ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />

                    </div>

                    {/* =================================================
                        खोदाईचे शेवटी बिंदू
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          text="खोदाईचे शेवटी बिंदू"
                        />

                        <span>:</span>

                      </div>

                      <Input
                        name="excavationEndPoint"
                        value={
                          values.excavationEndPoint ||
                          ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />

                    </div>

                    {/* =================================================
                        अक्षांश
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          text="अक्षांश"
                        />

                        <span>:</span>

                      </div>

                      <Input
                        type="number"
                        name="latitude"
                        value={
                          values.latitude || ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />

                    </div>

                    {/* =================================================
                        रेखांश
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                        <Label
                          text="रेखांश"
                        />

                        <span>:</span>

                      </div>

                      <Input
                        type="number"
                        name="longitude"
                        value={
                          values.longitude || ""
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

            {/* =====================================================
                DOCUMENT UPLOAD
            ====================================================== */}

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
                          text="विहीत नमुन्यातील अर्ज"
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

                    <div className="flex items-center">

                      {values.applicationDocument ? (

                        <span className="text-sm text-gray-600">

                          Selected file:{" "}

                          <strong>
                            {
                              values
                                .applicationDocument
                                .name
                            }
                          </strong>

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

            {/* =====================================================
                BUTTONS
            ====================================================== */}

            <div className="flex justify-center items-center gap-3 pt-4 pb-6">

              <Button
                type="button"
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  window.history.back();
                }}
              >
                मागे जा
              </Button>

              <Button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "अर्ज सादर करा"}
              </Button>

            </div>

          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmNORNoc;