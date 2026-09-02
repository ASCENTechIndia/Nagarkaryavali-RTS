import { useState } from "react";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";

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

import ShadCNTable from "@/components/ui/table";

import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";

function FrmWaterAppliEntry() {
  const { user } = useAuth();
  const location = useLocation();

  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});

  const initialValues = {
    // =========================
    // APPLICANT DETAILS
    // =========================
    zoneId: "",

    applicantFirstName: "",
    applicantMiddleName: "",
    applicantLastName: "",

    applicantFirstNameMarathi: "",
    applicantMiddleNameMarathi: "",
    applicantLastNameMarathi: "",

    mobileNumber: "",
    email: "",
    aadharCardNo: "",
    propertyNumber: "",
    residentialNumber: "",
    address: "",
    addressMarathi: "",

    // =========================
    // CONSUMER DETAILS
    // =========================
    consumerFirstName: "",
    consumerMiddleName: "",
    consumerLastName: "",

    consumerFirstNameMarathi: "",
    consumerMiddleNameMarathi: "",
    consumerLastNameMarathi: "",

    consumerMobileNumber: "",
    consumerEmail: "",
    consumerAadharCardNo: "",
    consumerPropertyNumber: "",
    consumerResidentialNumber: "",

    // =========================
    // CO OWNER
    // =========================
    includeCoOwner: "No",

    coOwnerFirstName: "",
    coOwnerMiddleName: "",
    coOwnerLastName: "",

    coOwnerFirstNameMarathi: "",
    coOwnerMiddleNameMarathi: "",
    coOwnerLastNameMarathi: "",

    coOwnerAddress: "",
    coOwnerAddressMarathi: "",

    remark: "",
    reason: "",

    // =========================
    // CONNECTION DETAILS
    // =========================
    connectionType: "",
    connectionSize: "",
    usageType: "",
    usageSubType: "",

    noOfPerson: "",
    noOfFamily: "",
    noOfConnection: "",

    connectionStatus: "",
    businessCertificate: "",
    billingType: "",

    isGovtProperty: "No",
  };

  const handleCopyApplicantToConsumer = (values, setFieldValue) => {
    setFieldValue("consumerFirstName", values.applicantFirstName);
    setFieldValue("consumerMiddleName", values.applicantMiddleName);
    setFieldValue("consumerLastName", values.applicantLastName);

    setFieldValue("consumerFirstNameMarathi", values.applicantFirstNameMarathi);

    setFieldValue(
      "consumerMiddleNameMarathi",
      values.applicantMiddleNameMarathi,
    );

    setFieldValue("consumerLastNameMarathi", values.applicantLastNameMarathi);

    setFieldValue("consumerMobileNumber", values.mobileNumber);
    setFieldValue("consumerEmail", values.email);
    setFieldValue("consumerAadharCardNo", values.aadharCardNo);
    setFieldValue("consumerPropertyNumber", values.propertyNumber);
    setFieldValue("consumerResidentialNumber", values.residentialNumber);

    Swal.fire({
      icon: "success",
      title: "Copied Successfully",
      text: "Applicant information has been added to Consumer Details.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleFileChange = (documentId, file) => {
    if (!file) return;

    setSelectedFiles((previous) => ({
      ...previous,
      [documentId]: file,
    }));
  };

  const documentHeaders = ["Select", "Document Name", "Upload Document"];

  const documentKeyMapping = {
    Select: "select",
    "Document Name": "documentName",
    "Upload Document": "upload",
  };

  const tableData = documents.map((document, index) => ({
    id: document.id || index,

    select: (
      <Input
        type="checkbox"
        checked={Boolean(selectedFiles[document.id])}
        onChange={() => {}}
      />
    ),

    documentName: document.documentName || "",

    upload: (
      <Input
        type="file"
        onChange={(event) =>
          handleFileChange(document.id, event.target.files?.[0])
        }
      />
    ),
  }));

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log("Form Values:", values);

      // ============================
      // API CALL WILL BE ADDED HERE
      // ============================

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Water application submitted successfully.",
      });

      resetForm();
      setSelectedFiles({});
    } catch (error) {
      await Swal.fire({
        icon: "error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to submit water application.",
      });
    }
  };

  return (
    <div className="w-full p-4">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, handleChange, setFieldValue, resetForm }) => (
          <Form className="space-y-4">
            {/* ================================= */}
            {/* APPLICANT DETAILS */}
            {/* ================================= */}

            <Card>
              <CardHeader className="border-b  py-3">
                <CardTitle className="text-start text-xl ">
                  Applicant Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-4">
                  {/* Zone ID */}
                  <div className="grid grid-cols-1 items-center gap-x-6 gap-y-4 md:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Zone ID"
                        className="text-black !w-full whitespace-nowrap"
                        required
                      />

                      <Select
                        value={values.zoneId}
                        onValueChange={(value) =>
                          setFieldValue("zoneId", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-- Select Option --" />
                        </SelectTrigger>

                        <SelectContent>
                          {/* API DATA WILL COME HERE */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Applicant Name */}
                  <div className="grid grid-cols-1 items-center gap-x-6 gap-y-4 lg:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Applicant Name"
                        className="text-black !w-full whitespace-nowrap"
                        required
                      />

                      <Input
                        name="applicantFirstName"
                        placeholder="First Name"
                        value={values.applicantFirstName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="applicantMiddleName"
                        placeholder="Middle Name"
                        value={values.applicantMiddleName}
                        onChange={handleChange}
                      />

                      <Input
                        name="applicantLastName"
                        placeholder="Last Name"
                        value={values.applicantLastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Applicant Name Marathi */}
                  <div className="grid grid-cols-1 items-center gap-x-6 gap-y-4 lg:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="अर्जदाराचे नाव मराठी"
                        className="text-black !w-full whitespace-nowrap"
                        required
                      />

                      <Input
                        name="applicantFirstNameMarathi"
                        placeholder="पहिले नाव"
                        value={values.applicantFirstNameMarathi}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="applicantMiddleNameMarathi"
                        placeholder="मधले नाव"
                        value={values.applicantMiddleNameMarathi}
                        onChange={handleChange}
                      />

                      <Input
                        name="applicantLastNameMarathi"
                        placeholder="आडनाव"
                        value={values.applicantLastNameMarathi}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Mobile Number / Email */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Mobile Number"
                        className="text-black !w-full whitespace-nowrap"
                        required
                      />

                      <Input
                        name="mobileNumber"
                        placeholder="Enter Mobile Number"
                        value={values.mobileNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Email"
                        className="text-black !w-full whitespace-nowrap"
                        required
                      />

                      <Input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={values.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Aadhar Card / Property Number */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Aadhar Card No"
                        className="text-black !w-full whitespace-nowrap"
                      />

                      <Input
                        name="aadharCardNo"
                        placeholder="Enter Aadhar Card Number"
                        value={values.aadharCardNo}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Property Number"
                        className="text-black !w-full whitespace-nowrap"
                      />

                      <Input
                        name="propertyNumber"
                        placeholder="Enter Property Number"
                        value={values.propertyNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Residential Number / Address */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-start gap-4">
                      <Label
                        text="Residential Number"
                        className="text-black !w-full pt-2 whitespace-nowrap"
                        required
                      />

                      <textarea
                        name="residentialNumber"
                        placeholder="Enter Residential Number"
                        value={values.residentialNumber}
                        onChange={handleChange}
                        className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-start gap-4">
                      <Label
                        text="Address"
                        className="text-black !w-full pt-2 whitespace-nowrap"
                        required
                      />

                      <textarea
                        name="address"
                        placeholder="Enter Address"
                        value={values.address}
                        onChange={handleChange}
                        className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  {/* Address Marathi */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-start gap-4 lg:col-start-2">
                      <Label
                        text="Address Marathi"
                        className="text-black !w-full pt-2 whitespace-nowrap"
                      />

                      <textarea
                        name="addressMarathi"
                        placeholder="पत्ता मराठी"
                        value={values.addressMarathi}
                        onChange={handleChange}
                        className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ================================= */}
            {/* COPY AS ABOVE */}
            {/* ================================= */}

            <div className="flex items-center gap-4 px-2">
              <Label className="text-base">Copy as Above</Label>

              <Button
                type="button"
                onClick={() =>
                  handleCopyApplicantToConsumer(values, setFieldValue)
                }
              >
                Add
              </Button>
            </div>

            {/* ================================= */}
            {/* CONSUMER DETAILS */}
            {/* ================================= */}

            <Card>
               <CardHeader className="border-b  py-3">
                <CardTitle className="text-start text-xl ">
                  Consumer Details
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-5">
                <div className="space-y-4">
                  {/* Consumer Name */}
                  <div className="grid grid-cols-1 items-center gap-x-6 gap-y-4 lg:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Consumer Name"
                        className="text-black !w-full whitespace-nowrap"
                        required
                      />

                      <Input
                        name="consumerFirstName"
                        placeholder="First Name"
                        value={values.consumerFirstName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="consumerMiddleName"
                        placeholder="Middle Name"
                        value={values.consumerMiddleName}
                        onChange={handleChange}
                      />

                      <Input
                        name="consumerLastName"
                        placeholder="Last Name"
                        value={values.consumerLastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Consumer Marathi Name */}
                  <div className="grid grid-cols-1 items-center gap-x-6 gap-y-4 lg:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="ग्राहकाचे नाव मराठी"
                        className="text-black !w-full whitespace-nowrap"
                        required
                      />

                      <Input
                        name="consumerFirstNameMarathi"
                        placeholder="पहिले नाव"
                        value={values.consumerFirstNameMarathi}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="consumerMiddleNameMarathi"
                        placeholder="मधले नाव"
                        value={values.consumerMiddleNameMarathi}
                        onChange={handleChange}
                      />

                      <Input
                        name="consumerLastNameMarathi"
                        placeholder="आडनाव"
                        value={values.consumerLastNameMarathi}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Consumer Mobile / Email */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Consumer Mobile Number"
                        className="text-black !w-full whitespace-nowrap"
                        required
                      />

                      <Input
                        name="consumerMobileNumber"
                        placeholder="Enter Consumer Mobile Number"
                        value={values.consumerMobileNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Consumer Email"
                        className="text-black !w-full whitespace-nowrap"
                        required
                      />

                      <Input
                        type="email"
                        name="consumerEmail"
                        placeholder="Enter Consumer Email"
                        value={values.consumerEmail}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Consumer Aadhar / Property Number */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Consumer Aadhar Card No"
                        className="text-black !w-full whitespace-nowrap"
                      />

                      <Input
                        name="consumerAadharCardNo"
                        placeholder="Enter Consumer Aadhar Card Number"
                        value={values.consumerAadharCardNo}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Consumer Property Number"
                        className="text-black !w-full whitespace-nowrap"
                      />

                      <Input
                        name="consumerPropertyNumber"
                        placeholder="Enter Consumer Property Number"
                        value={values.consumerPropertyNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Consumer Residential Number */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Consumer Residential Number"
                        className="text-black !w-full whitespace-nowrap"
                        required
                      />

                      <Input
                        name="consumerResidentialNumber"
                        placeholder="Enter Consumer Residential Number"
                        value={values.consumerResidentialNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ================================= */}
            {/* CO OWNER DETAILS */}
            {/* ================================= */}

            <Card>
                <CardHeader className="border-b  py-3">
                <CardTitle className="text-start text-xl ">
                  Co-Owner Details
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-5">
                <div className="space-y-4">
                  {/* Other Co-Owner */}
                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[250px_1fr]">
                    <Label
                      text="Other Co-Owner names to include"
                      className="text-black !w-full"
                      required
                    />

                    <div className="flex items-center gap-6">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-black">
                        <input
                          type="radio"
                          name="includeCoOwner"
                          value="Yes"
                          checked={values.includeCoOwner === "Yes"}
                          onChange={handleChange}
                          className="h-4 w-4 cursor-pointer"
                        />
                        Yes
                      </label>

                      <label className="flex cursor-pointer items-center gap-2 text-sm text-black">
                        <input
                          type="radio"
                          name="includeCoOwner"
                          value="No"
                          checked={values.includeCoOwner === "No"}
                          onChange={handleChange}
                          className="h-4 w-4 cursor-pointer"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {values.includeCoOwner === "Yes" && (
                    <>
                      {/* Co-Owner Name */}
                      <div className="grid grid-cols-1 items-center gap-x-6 gap-y-4 lg:grid-cols-2">
                        <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                          <Label
                            text="Co-Owner Name"
                            className="text-black !w-full whitespace-nowrap"
                          />

                          <Input
                            name="coOwnerFirstName"
                            placeholder="First Name"
                            value={values.coOwnerFirstName}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            name="coOwnerMiddleName"
                            placeholder="Middle Name"
                            value={values.coOwnerMiddleName}
                            onChange={handleChange}
                          />

                          <Input
                            name="coOwnerLastName"
                            placeholder="Last Name"
                            value={values.coOwnerLastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Co-Owner Marathi Name */}
                      <div className="grid grid-cols-1 items-center gap-x-6 gap-y-4 lg:grid-cols-2">
                        <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                          <Label
                            text="Co-Owner Name Marathi"
                            className="text-black !w-full whitespace-nowrap"
                          />

                          <Input
                            name="coOwnerFirstNameMarathi"
                            placeholder="पहिले नाव"
                            value={values.coOwnerFirstNameMarathi}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            name="coOwnerMiddleNameMarathi"
                            placeholder="मधले नाव"
                            value={values.coOwnerMiddleNameMarathi}
                            onChange={handleChange}
                          />

                          <Input
                            name="coOwnerLastNameMarathi"
                            placeholder="आडनाव"
                            value={values.coOwnerLastNameMarathi}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Co-Owner Address / Marathi Address */}
                      <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                        <div className="grid grid-cols-[250px_minmax(0,1fr)] items-start gap-4">
                          <Label
                            text="Co-Owner Address"
                            className="text-black !w-full pt-2 whitespace-nowrap"
                          />

                          <textarea
                            name="coOwnerAddress"
                            placeholder="Enter Co-Owner Address"
                            value={values.coOwnerAddress}
                            onChange={handleChange}
                            className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>

                        <div className="grid grid-cols-[250px_minmax(0,1fr)] items-start gap-4">
                          <Label
                            text="Co-Owner Address Marathi"
                            className="text-black !w-full pt-2 whitespace-nowrap"
                          />

                          <textarea
                            name="coOwnerAddressMarathi"
                            placeholder="सह-मालकाचा पत्ता"
                            value={values.coOwnerAddressMarathi}
                            onChange={handleChange}
                            className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Remark / Reason */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                    {/* Co-Owner Name */}
                    <div className="lg:col-span-2 grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Co-Owner Name"
                        className="text-black !w-full whitespace-nowrap"
                      />

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Input
                          name="coOwnerFirstName"
                          placeholder="First Name"
                          value={values.coOwnerFirstName}
                          onChange={handleChange}
                        />

                        <Input
                          name="coOwnerMiddleName"
                          placeholder="Middle Name"
                          value={values.coOwnerMiddleName}
                          onChange={handleChange}
                        />

                        <Input
                          name="coOwnerLastName"
                          placeholder="Last Name"
                          value={values.coOwnerLastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Co-Owner Name Marathi */}
                    <div className="lg:col-span-2 grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="सह-मालकाचे नाव मराठी"
                        className="text-black !w-full whitespace-nowrap"
                      />

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Input
                          name="coOwnerFirstNameMarathi"
                          placeholder="पहिले नाव"
                          value={values.coOwnerFirstNameMarathi}
                          onChange={handleChange}
                        />

                        <Input
                          name="coOwnerMiddleNameMarathi"
                          placeholder="मधले नाव"
                          value={values.coOwnerMiddleNameMarathi}
                          onChange={handleChange}
                        />

                        <Input
                          name="coOwnerLastNameMarathi"
                          placeholder="आडनाव"
                          value={values.coOwnerLastNameMarathi}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-start gap-4">
                      <Label
                        text="Address"
                        className="text-black !w-full whitespace-nowrap pt-2"
                      />

                      <textarea
                        name="address"
                        placeholder="Enter Address"
                        value={values.address}
                        onChange={handleChange}
                        className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    {/* Address Marathi */}
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-start gap-4">
                      <Label
                        text="Address Marathi"
                        className="text-black !w-full whitespace-nowrap pt-2"
                      />

                      <textarea
                        name="addressMarathi"
                        placeholder="पत्ता मराठी"
                        value={values.addressMarathi}
                        onChange={handleChange}
                        className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    {/* Remark */}
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Remark"
                        className="text-black !w-full whitespace-nowrap"
                      />

                      <Input
                        name="remark"
                        placeholder="Enter Remark"
                        value={values.remark}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Reason */}
                    <div className="grid grid-cols-[250px_minmax(0,1fr)] items-center gap-4">
                      <Label
                        text="Reason"
                        className="text-black !w-full whitespace-nowrap"
                      />

                      <Input
                        name="reason"
                        placeholder="Enter Reason"
                        value={values.reason}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* ================================= */}
            {/* CONNECTION DETAILS */}
            {/* ================================= */}

            <Card>
               <CardHeader className="border-b  py-3">
                <CardTitle className="text-start text-xl ">
                  Connection Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                  {/* Connection Type */}
                  <div className="space-y-2">
                    <Label
                      text="Connection Type"
                      className="text-black !w-full"
                    />

                    <Select
                      value={values.connectionType}
                      onValueChange={(value) =>
                        setFieldValue("connectionType", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Select Option --" />
                      </SelectTrigger>

                      <SelectContent />
                    </Select>
                  </div>

                  {/* Connection Size */}
                  <div className="space-y-2">
                    <Label
                      text="Connection Size"
                      className="text-black !w-full"
                    />

                    <Select
                      value={values.connectionSize}
                      onValueChange={(value) =>
                        setFieldValue("connectionSize", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Select Option --" />
                      </SelectTrigger>

                      <SelectContent />
                    </Select>
                  </div>

                  {/* Usage Type */}
                  <div className="space-y-2">
                    <Label text="Usage Type" className="text-black !w-full" />

                    <Select
                      value={values.usageType}
                      onValueChange={(value) =>
                        setFieldValue("usageType", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Select Option --" />
                      </SelectTrigger>

                      <SelectContent />
                    </Select>
                  </div>

                  {/* Usage Sub-Type */}
                  <div className="space-y-2">
                    <Label
                      text="Usage Sub-Type"
                      className="text-black !w-full"
                    />

                    <Select
                      value={values.usageSubType}
                      onValueChange={(value) =>
                        setFieldValue("usageSubType", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Select Option --" />
                      </SelectTrigger>

                      <SelectContent />
                    </Select>
                  </div>

                  {/* No. Of Person */}
                  <div className="space-y-2">
                    <Label
                      text="No. Of Person"
                      className="text-black !w-full"
                    />

                    <Input
                      type="number"
                      name="noOfPerson"
                      value={values.noOfPerson}
                      onChange={handleChange}
                    />
                  </div>

                  {/* No. Of Family */}
                  <div className="space-y-2">
                    <Label
                      text="No. Of Family"
                      className="text-black !w-full"
                    />

                    <Input
                      type="number"
                      name="noOfFamily"
                      value={values.noOfFamily}
                      onChange={handleChange}
                    />
                  </div>

                  {/* No. Of Connection */}
                  <div className="space-y-2">
                    <Label
                      text="No. Of Connection"
                      className="text-black !w-full"
                    />

                    <Input
                      type="number"
                      name="noOfConnection"
                      value={values.noOfConnection}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Connection Status */}
                  <div className="space-y-2">
                    <Label
                      text="Connection Status"
                      className="text-black !w-full"
                    />

                    <Select
                      value={values.connectionStatus}
                      onValueChange={(value) =>
                        setFieldValue("connectionStatus", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Select Option --" />
                      </SelectTrigger>

                      <SelectContent />
                    </Select>
                  </div>

                  {/* Business Certificate */}
                  <div className="space-y-2">
                    <Label
                      text="Business Certificate"
                      className="text-black !w-full"
                    />

                    <Select
                      value={values.businessCertificate}
                      onValueChange={(value) =>
                        setFieldValue("businessCertificate", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Select Option --" />
                      </SelectTrigger>

                      <SelectContent />
                    </Select>
                  </div>

                  {/* Billing Type */}
                  <div className="space-y-2">
                    <Label text="Billing Type" className="text-black !w-full" />

                    <Input
                      name="billingType"
                      value={values.billingType}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Govt Property */}
                  <div className="space-y-2">
                    <Label
                      text="Is this Govt. Property?"
                      className="text-black !w-full"
                    />

                    <div className="flex items-center gap-5 pt-2">
                      <label className="flex cursor-pointer items-center gap-2 text-black">
                        <Input
                          type="radio"
                          name="isGovtProperty"
                          value="Yes"
                          checked={values.isGovtProperty === "Yes"}
                          onChange={handleChange}
                        />
                        Yes
                      </label>

                      <label className="flex cursor-pointer items-center gap-2 text-black">
                        <Input
                          type="radio"
                          name="isGovtProperty"
                          value="No"
                          checked={values.isGovtProperty === "No"}
                          onChange={handleChange}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ================================= */}
            {/* DOCUMENT TABLE */}
            {/* ================================= */}

            <Card>
              <CardContent className="pt-5">
                <ShadCNTable
                  headers={documentHeaders}
                  data={tableData}
                  keyMapping={documentKeyMapping}
                />
              </CardContent>
            </Card>

            {/* ================================= */}
            {/* BUTTONS */}
            {/* ================================= */}

            <div className="flex justify-center gap-4 py-4">
              <Button type="submit" className="min-w-[140px]">
                Submit
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="min-w-[140px]"
                onClick={() => {
                  resetForm();
                  setSelectedFiles({});
                }}
              >
                Reset
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default FrmWaterAppliEntry;
