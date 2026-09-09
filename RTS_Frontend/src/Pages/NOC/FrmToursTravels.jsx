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
  waterConnectionNo: "",
  businessLicenseNo: "",
  licenseType: "",
  buildingPermissionProposalNo: "",
  occupancyCertificateNo: "",
  roadType: "",
  roadWidth: "",
  roadLength: "",
  excavationLength: "",
  excavationArea: "",
  excavationStartPoint: "",
  excavationEndPoint: "",
  latitude: "",
  longitude: "",
  hospitalName: "",
  healthAgencyNo: "",
  fixedArea: "",
  newHoarding: "",
  hoardingNumber: "",
  advertisingArea: "",
  numberOfLights: "",
  hoardingType: "",
  applicationDocument: null,
};

const LICENSE_TYPES = [
  {
    id: "local",
    name: "स्थानिक परवाना",
  },
  {
    id: "state",
    name: "राज्यस्तरीय परवाना",
  },
  {
    id: "central",
    name: "केंद्र शासन परवाना",
  },
];

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

const YES_NO_OPTIONS = [
  {
    id: "yes",
    name: "होय",
  },
  {
    id: "no",
    name: "नाही",
  },
];

const HOARDING_TYPES = [
  {
    id: "normal",
    name: "सामान्य होर्डिंग",
  },
  {
    id: "digital",
    name: "डिजिटल होर्डिंग",
  },
  {
    id: "temporary",
    name: "तात्पुरते होर्डिंग",
  },
];

const FrmToursTravels = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      console.log(
        "================================================"
      );

      console.log(
        "TOURS & TRAVELS COMPLETE FORM VALUES"
      );

      console.log(
        "================================================"
      );

      console.log(values);

      const payload = {
        service: {
          serviceId: "1",
          serviceName: "NOC for Tours and Travels",
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
          businessType: values.businessType,
          businessDescription:
            values.businessDescription,
        },

        toursAndTravels: {
          propertyNo: values.propertyNo,
          businessAddress:
            values.businessAddress,
          waterConnectionNo:
            values.waterConnectionNo,
          businessLicenseNo:
            values.businessLicenseNo,
          licenseType: values.licenseType,
          buildingPermissionProposalNo:
            values.buildingPermissionProposalNo,
          occupancyCertificateNo:
            values.occupancyCertificateNo,
          roadType: values.roadType,
          roadWidth: values.roadWidth,
          roadLength: values.roadLength,
          excavationLength:
            values.excavationLength,
          excavationArea:
            values.excavationArea,
          excavationStartPoint:
            values.excavationStartPoint,
          excavationEndPoint:
            values.excavationEndPoint,
          latitude: values.latitude,
          longitude: values.longitude,
          hospitalName:
            values.hospitalName,
          healthAgencyNo:
            values.healthAgencyNo,
          fixedArea: values.fixedArea,
          newHoarding:
            values.newHoarding,
          hoardingNumber:
            values.hoardingNumber,
          advertisingArea:
            values.advertisingArea,
          numberOfLights:
            values.numberOfLights,
          hoardingType:
            values.hoardingType,
        },

        documents: {
          applicationDocument:
            values.applicationDocument
              ? {
                  name:
                    values.applicationDocument
                      .name,
                  type:
                    values.applicationDocument
                      .type,
                  size:
                    values.applicationDocument
                      .size,
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
        text: "All form values have been collected successfully.",
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
        text: "Something went wrong while collecting form values.",
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
            <ApplicantDetails />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="border shadow-sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">
                    आवश्यक डेटा : NOC for Tours and Travels
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
                  
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="नळ जोडणी क्र." />
                        <span>:</span>
                      </div>

                      <div className="flex w-full gap-1">
                        <Input
                          name="waterConnectionNo"
                          value={
                            values.waterConnectionNo ||
                            ""
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full h-9"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="व्यवसाय परवाना क्रमांक" />
                        <span>:</span>
                      </div>

                      <Input
                        name="businessLicenseNo"
                        value={
                          values.businessLicenseNo ||
                          ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="बांधकाम परवानगी प्रस्ताव क्रमांक" />
                        <span>:</span>
                      </div>

                      <Input
                        name="buildingPermissionProposalNo"
                        value={
                          values.buildingPermissionProposalNo ||
                          ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>
                  
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="भोगवटा प्रमाणपत्र क्रमांक" />
                        <span>:</span>
                      </div>

                      <Input
                        name="occupancyCertificateNo"
                        value={
                          values.occupancyCertificateNo ||
                          ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="परवाना प्रकार" />
                        <span>:</span>
                      </div>

                      <Select
                        value={
                          values.licenseType || ""
                        }
                        onValueChange={(value) =>
                          setFieldValue(
                            "licenseType",
                            value
                          )
                        }
                      >
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="कृपया निवडा" />
                        </SelectTrigger>

                        <SelectContent>
                          {LICENSE_TYPES.map(
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
                  
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="रस्त्याचे प्रकार" />
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

                        <SelectContent>
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

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="रस्त्याची तोंडसी (मीटर)" />
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

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="रस्त्याची रुंदी (मीटर)" />
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

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="खोदाईची लांबी (चौ. मीटर)" />
                        <span>:</span>
                      </div>

                      <Input
                        type="number"
                        name="excavationLength"
                        value={
                          values.excavationLength ||
                          ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="खोदाईचे आकार (मीटर)" />
                        <span>:</span>
                      </div>

                      <Input
                        type="number"
                        name="excavationArea"
                        value={
                          values.excavationArea ||
                          ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>
                  
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="खोदाईचे प्रारंभिक बिंदू" />
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

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="खोदाईचे शेवटी बिंदू" />
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

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="अक्षांश" />
                        <span>:</span>
                      </div>

                      <Input
                        name="latitude"
                        value={
                          values.latitude || ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="रेखांश" />
                        <span>:</span>
                      </div>

                      <Input
                        name="longitude"
                        value={
                          values.longitude || ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="रुग्णालयाचे नाव" />
                        <span>:</span>
                      </div>

                      <Input
                        name="hospitalName"
                        value={
                          values.hospitalName || ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="आरोग्य एजन्सी क्रमांक" />
                        <span>:</span>
                      </div>

                      <Input
                        name="healthAgencyNo"
                        value={
                          values.healthAgencyNo || ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>
                  
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="मंडळाने निश्चित केलेले क्षेत्र" />
                        <span>:</span>
                      </div>

                      <Input
                        name="fixedArea"
                        value={
                          values.fixedArea || ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                  
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="नवीन होर्डिंग" />
                        <span>:</span>
                      </div>

                      <Select
                        value={
                          values.newHoarding || ""
                        }
                        onValueChange={(value) =>
                          setFieldValue(
                            "newHoarding",
                            value
                          )
                        }
                      >
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="कृपया निवडा" />
                        </SelectTrigger>

                        <SelectContent>
                          {YES_NO_OPTIONS.map(
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

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="हॉर्डिंग संख्या" />
                        <span>:</span>
                      </div>

                      <Input
                        type="number"
                        name="hoardingNumber"
                        value={
                          values.hoardingNumber ||
                          ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="जाहिरातीसाठी निश्चित केलेले होर्डिंग" />
                        <span>:</span>
                      </div>

                      <Select
                        value={
                          values.advertisingArea ||
                          ""
                        }
                        onValueChange={(value) =>
                          setFieldValue(
                            "advertisingArea",
                            value
                          )
                        }
                      >
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="कृपया निवडा" />
                        </SelectTrigger>

                        <SelectContent>
                          {YES_NO_OPTIONS.map(
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

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="दिव्यांची संख्या" />
                        <span>:</span>
                      </div>

                      <Input
                        type="number"
                        name="numberOfLights"
                        value={
                          values.numberOfLights ||
                          ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="हॉर्डिंगचा प्रकार" />
                        <span>:</span>
                      </div>

                      <Select
                        value={
                          values.hoardingType || ""
                        }
                        onValueChange={(value) =>
                          setFieldValue(
                            "hoardingType",
                            value
                          )
                        }
                      >
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="कृपया निवडा" />
                        </SelectTrigger>

                        <SelectContent>
                          {HOARDING_TYPES.map(
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* <motion.div
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
            </motion.div> */}

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

export default FrmToursTravels;