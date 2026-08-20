import React from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/calendar";

const initialValues = {
  applicantName: "",
  applicantAddress: "",

  constructionPermission: "yes",
  constructionCertificateNo: "",

  usePermission: "yes",
  useCertificateNo: "",
  certificateDate: "",

  propertyType: "residential",

  prabhagOffice: "",
  sectorNo: "",
  surveyNo: "",
  developmentProposalNo: "",

  landOwnerName: "",
  developerName: "",
  advanceReceiptNo: "",
};

const FrmNewTaxAssesment = () => {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    console.log("Self Assessment Data:", values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-2 sm:px-4 mt-4 sm:mt-6"
          >
            <Card className="border shadow-sm">
              <CardHeader className="border-b py-3 sm:py-4">
                <CardTitle className="text-lg ">Self Assessment</CardTitle>
              </CardHeader>

              <CardContent className="p-3 sm:p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="sm:w-44 shrink-0 flex items-center justify-between">
                      <Label className="text-sm sm:text-base  whitespace-nowrap" text="अर्जदाराचे नाव" />
                      <span className="hidden sm:block ml-2">:</span>
                    </div>

                    <Input
                      name="applicantName"
                      value={values.applicantName}
                      onChange={handleChange}
                      className="w-full h-9"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <div className="sm:w-44 shrink-0 flex items-center justify-between sm:pt-2">
                      <Label className="text-sm sm:text-base  whitespace-nowrap" text="अर्जदाराचे पत्ता" />
                      <span className="hidden sm:block ml-2">:</span>
                    </div>

                    <Input
                      name="applicantAddress"
                      value={values.applicantAddress}
                      onChange={handleChange}
                      className="w-full h-9"
                    />
                  </div>
                </div>

                <div className="border-t mt-6 pt-5">
                  <h3 className="text-bold sm:text-lg  mb-5">
                    मालमत्तेचा तपशील
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="sm:w-68 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base  whitespace-nowrap" text="मालमत्ता बांधकामास परवानगी आहे का?" />
                        <span className="hidden sm:block ml-2">:</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-5">
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <Input
                            type="radio"
                            name="constructionPermission"
                            value="yes"
                            checked={values.constructionPermission === "yes"}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />

                          <span className="text-sm sm:text-base">हो</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <Input
                            type="radio"
                            name="constructionPermission"
                            value="no"
                            checked={values.constructionPermission === "no"}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />

                          <span className="text-sm sm:text-base">नाही</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="sm:w-32 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base  whitespace-nowrap" text="असल्यास"/>

                        <span className="hidden sm:block ml-2">:</span>
                      </div>

                      <Input
                        name="constructionCertificateNo"
                        value={values.constructionCertificateNo}
                        onChange={handleChange}
                        placeholder="परवानगी प्रमाणपत्र क्रमांक"
                        className="w-full h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="sm:w-68 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base  whitespace-nowrap" text="मालमत्ता वापर परवानगी आहे का?" />
                        <span className="hidden sm:block ml-2">:</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-5">
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <Input
                            type="radio"
                            name="usePermission"
                            value="yes"
                            checked={values.usePermission === "yes"}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />

                          <span className="text-sm sm:text-base">हो</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <Input
                            type="radio"
                            name="usePermission"
                            value="no"
                            checked={values.usePermission === "no"}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />

                          <span className="text-sm sm:text-base">नाही</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="sm:w-32 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base  whitespace-nowrap" text="असल्यास" />
                        
                        <span className="hidden sm:block ml-2">:</span>
                      </div>

                      <Input
                        name="useCertificateNo"
                        value={values.useCertificateNo}
                        onChange={handleChange}
                        placeholder="प्रमाणपत्र क्रमांक"
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="sm:w-32 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base whitespace-nowrap" text=" प्रमाणपत्र दिनांक" />

                        <span className="hidden sm:block ml-2">:</span>
                      </div>
                      <DatePicker
                        value={values.certificateDate}
                        onChange={(date) =>
                          setFieldValue("certificateDate", date)
                        }
                        className="w-full h-9"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-6">
                    <div className="sm:w-44 shrink-0 flex items-center justify-between">
                      <Label className="text-sm sm:text-base  whitespace-nowrap" text="मालमत्तेचा प्रकार" />
                        
                      <span className="hidden sm:block ml-2">:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <Input
                          type="radio"
                          name="propertyType"
                          value="residential"
                          checked={values.propertyType === "residential"}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />

                        <span className="text-sm sm:text-base">सदनिका</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <Input
                          type="radio"
                          name="propertyType"
                          value="shop"
                          checked={values.propertyType === "shop"}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />

                        <span className="text-sm sm:text-base">गाळा</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <Input
                          type="radio"
                          name="propertyType"
                          value="office"
                          checked={values.propertyType === "office"}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />

                        <span className="text-sm sm:text-base">ऑफिस</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <Input
                          type="radio"
                          name="propertyType"
                          value="landTax"
                          checked={values.propertyType === "landTax"}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />

                        <span className="text-sm sm:text-base">
                          जमिनीवरील कर
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="sm:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base  whitespace-nowrap" text="प्रभाग कार्यालय" />
                          
                        <span className="hidden sm:block ml-2">:</span>
                      </div>

                      <Select
                        value={values.prabhagOffice}
                        onValueChange={(value) =>
                          setFieldValue("prabhagOffice", value)
                        }
                      >
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="-- Select Option --" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="1">प्रभाग कार्यालय 1</SelectItem>

                          <SelectItem value="2">प्रभाग कार्यालय 2</SelectItem>

                          <SelectItem value="3">प्रभाग कार्यालय 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="sm:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base  whitespace-nowrap" text="सेक्टर क्रमांक" />

                        <span className="hidden sm:block ml-2">:</span>
                      </div>

                      <Input
                        name="sectorNo"
                        value={values.sectorNo}
                        onChange={handleChange}
                        className="w-full h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="sm:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base  whitespace-nowrap" text="टीका व सर्वे" />
                          
                        <span className="hidden sm:block ml-2">:</span>
                      </div>

                      <Input
                        name="surveyNo"
                        value={values.surveyNo}
                        onChange={handleChange}
                        className="w-full h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="sm:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base  whitespace-nowrap" text=" विकास प्रस्ताव क्र" />
                         
                        <span className="hidden sm:block ml-2">:</span>
                      </div>

                      <Input
                        name="developmentProposalNo"
                        value={values.developmentProposalNo}
                        onChange={handleChange}
                        className="w-full h-9"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4">
                      <div className="sm:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base  whitespace-nowrap" text="जमीन मालकाचे नाव" />
                          
                        <span className="hidden sm:block ml-2">:</span>
                      </div>

                      <Input
                        name="landOwnerName"
                        value={values.landOwnerName}
                        onChange={handleChange}
                        className="w-full sm:max-w-[625px] h-9"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4">
                      <div className="sm:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base  whitespace-nowrap" text=" विकासकाचे नाव" />
                                              
                        <span className="hidden sm:block ml-2">:</span>
                      </div>

                      <Input
                        name="developerName"
                        value={values.developerName}
                        onChange={handleChange}
                        className="w-full sm:max-w-[625px] h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4">
                      <div className="sm:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base  whitespace-nowrap" text="अग्रीम कराची पावती क्र." />
                          
                        <span className="hidden sm:block ml-2">:</span>
                      </div>

                      <Input
                        name="advanceReceiptNo"
                        value={values.advanceReceiptNo}
                        onChange={handleChange}
                        className="w-full sm:max-w-[625px] h-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center flex-wrap gap-3 pt-7">
                  <Button
                    type="submit"
                    className="bg-[#18b59f] hover:bg-[#129c89] text-white px-6 h-9"
                  >
                    Submit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="px-6 h-9 bg-gray-100 hover:bg-gray-200"
                    onClick={() => navigate("/")}
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmNewTaxAssesment;
