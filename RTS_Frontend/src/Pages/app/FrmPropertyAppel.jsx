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
import { Textarea } from "@/components/ui/textarea";
import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const initialValues = {
  ptn: "",
  subcode: "",
  landHolder: "",
  structureHolder: "",
  ownerDetails: "",
  address: "",
  applicantName: "",
  mobileNo: "",
  emailId: "",
  aadharNo: "",
  objectionType: "",
  objectionDescription: "",
  document: null,
};

const FrmPropertyAppel = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([
    {
      id: 1,
      srNo: 1,
      documentName: "थकबाकी नसल्याचा दाखला",
      file: null,
      fileName: "No file chosen",
    },
  ]);

  const headers = ["Sr No.", "Document Name", "Image(jpg,png,pdf)"];

  const keyMapping = {
    "Sr No.": "srNo",
    "Document Name": "documentName",
    "Image(jpg,png,pdf)": "fileUpload",
  };

  const handleFileChange = (id, event) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setTableData((prev) =>
        prev.map((row) =>
          row.id === id
            ? { ...row, file: file, fileName: file.name }
            : row
        )
      );
    }
  };

  const transformedTableData = tableData.map((item) => ({
    ...item,
    fileUpload: (
      <div className="flex items-center justify-center gap-2">
        <Input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileChange(item.id, e)}
          className="h-9 text-sm p-1 w-[50%]"
        />
      </div>
    ),
  }));

  const handleSubmit = (values) => {
    console.log("Property Appeal Data:", values);
    Swal.fire({
      text: "Property Appeal submitted successfully!",
      confirmButtonColor: "#18b59f",
    });
  };

  const handleReset = (resetForm) => {
    Swal.fire({
      title: "Are you sure?",
      text: "All entered data will be cleared!",
      showCancelButton: true,
      confirmButtonColor: "#18b59f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
    }).then((result) => {
      if (result.isConfirmed) {
        resetForm();
        setTableData([
          {
            id: 1,
            srNo: 1,
            documentName: "थकबाकी नसल्याचा दाखला",
            file: null,
            fileName: "No file chosen",
          },
        ]);
        Swal.fire({
          text: "Form has been reset successfully!",
          confirmButtonColor: "#18b59f",
          timer: 1500,
        });
      }
    });
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, handleChange, setFieldValue, resetForm }) => (
        <Form>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="border shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold">
                  Property Appeal
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-24 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label required text="PTN" />
                      <span>:</span>
                    </div>
                    <Input
                      name="ptn"
                      value={values.ptn}
                      onChange={handleChange}
                      className="w-full h-9"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-24 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Subcode" />
                      <span>:</span>
                    </div>
                    <Input
                      name="subcode"
                      value={values.subcode}
                      onChange={handleChange}
                      className="w-full h-9"
                    />
                  </div>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      className="bg-blue-900 hover:bg-blue-800 text-white"
                    >
                      Search
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-y border-gray-300 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Land Holder" />
                      <span>:</span>
                    </div>
                    <div className="w-full min-h-9 flex items-center  px-2">
                      {values.landHolder || ""}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Structure Holder" />
                      <span>:</span>
                    </div>
                    <div className="w-full min-h-9 flex items-center px-2">
                      {values.structureHolder || ""}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Owner Details" />
                      <span>:</span>
                    </div>
                    <div className="w-full min-h-9 flex items-center px-2">
                      {values.ownerDetails || ""}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Address" />
                      <span>:</span>
                    </div>
                    <div className="w-full min-h-9 flex items-center px-2">
                      {values.address || ""}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="Applicant Name" className="sm:whitespace-nowrap" />
                        <span>:</span>
                        </div>
                        <Input
                        name="applicantName"
                        value={values.applicantName}
                        onChange={handleChange}
                        className="w-full h-9"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="Email ID" />
                        <span>:</span>
                        </div>
                        <Input
                        name="emailId"
                        value={values.emailId}
                        onChange={handleChange}
                        className="w-full h-9"
                        type="email"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="Mobile No." />
                        <span>:</span>
                        </div>
                        <Input
                            name="mobileNo"
                            value={values.mobileNo}
                            onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setFieldValue("mobileNo", value);
                            }}
                            className="w-full h-9"
                            type="text"
                            maxLength={10}
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label text="Aadhar No." />
                        <span>:</span>
                        </div>
                        <Input
                            name="aadharNo"
                            value={values.aadharNo}
                            onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 12);
                            setFieldValue("aadharNo", value);
                            }}
                            className="w-full h-9"
                            type="text"
                            maxLength={12}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="आक्षेपाचा कशावर" />
                        <span>:</span>
                        </div>
                        <Select
                            value={values.objectionType}
                            onValueChange={(value) =>
                                setFieldValue("objectionType", value)
                            }
                            >
                            <SelectTrigger className="w-full h-9">
                                <SelectValue placeholder="-- Select Option --" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="property">Property</SelectItem>
                                <SelectItem value="assessment">Assessment</SelectItem>
                                <SelectItem value="tax">Property Tax</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                        <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center pt-2">
                            <Label required text="आक्षेपाचे वर्णन" />
                            <span>:</span>
                        </div>
                        <Textarea
                            name="objectionDescription"
                            value={values.objectionDescription}
                            onChange={handleChange}
                            className="w-full min-h-[100px]"
                            placeholder="Enter objection description..."
                        />
                    </div>
                </div>
                
                <hr />

                <ShadCNTable
                    headers={headers}
                    data={transformedTableData}
                    keyMapping={keyMapping}
                    pagination={false}
                    className="max-md:min-w-380"
                />

                <div className="flex justify-center items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white"
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-100 hover:bg-gray-200"
                    path="/"
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

export default FrmPropertyAppel;