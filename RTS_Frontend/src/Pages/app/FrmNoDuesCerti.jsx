import React, { useState, useEffect } from "react";
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
import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const ENCRYPTION_KEY = "AS23N7E2H4V717DEAS23N7E2H4V717DE";
const EXTERNAL_API_URL = "http://ptaxtmccollection.thanecity.gov.in/TMC_IGRClient/Service.svc/GetDataDetails_TMC";

// Simple encryption/decryption functions (matching .NET logic)
function encryptString(plainText, keyValue) {
  const keyBytes = [];
  for (let i = 0; i < keyValue.length; i++) {
    keyBytes.push(keyValue.charCodeAt(i));
  }
  const plainBytes = [];
  for (let i = 0; i < plainText.length; i++) {
    plainBytes.push(plainText.charCodeAt(i));
  }
  const actualKey = keyBytes.slice(0, 32);
  const result = [];
  for (let i = 0; i < plainBytes.length; i++) {
    result.push(plainBytes[i] ^ actualKey[i % actualKey.length]);
  }
  let hex = '';
  for (let i = 0; i < result.length; i++) {
    hex += result[i].toString(16).padStart(2, '0').toUpperCase();
  }
  return hex;
}

function decryptString(cipherText, keyValue) {
  const keyBytes = [];
  for (let i = 0; i < keyValue.length; i++) {
    keyBytes.push(keyValue.charCodeAt(i));
  }
  const cipherBytes = [];
  for (let i = 0; i < cipherText.length; i += 2) {
    cipherBytes.push(parseInt(cipherText.substr(i, 2), 16));
  }
  const actualKey = keyBytes.slice(0, 32);
  const result = [];
  for (let i = 0; i < cipherBytes.length; i++) {
    result.push(cipherBytes[i] ^ actualKey[i % actualKey.length]);
  }
  return String.fromCharCode(...result);
}

// Get page title based on service ID
const getPageTitle = (serviceId) => {
  const titleMap = {
    "44": "Re Assessment",
    "56": "No Dues Certificate",
    "100": "Preparation Of Property Tax Bill",
    "51": "Property Division",
    "291": "Demolish & Re-Development"
  };
  return titleMap[String(serviceId)] || "No Dues Certificate";
};

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
};

const FrmNoDuesCerti = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;
  const ulbId = user?.ulbId || "3";
  const userId = user?.userId || "151";
  const zoneId = user?.zoneId || "12";
  const mahaUlbId = user?.mahaUlbId || "";
  const serviceId = user?.serviceId || "56";

  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [documentDefs, setDocumentDefs] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [pageTitle, setPageTitle] = useState("No Dues Certificate");
  
  // State variables to store property details
  const [yearlyTax, setYearlyTax] = useState("");
  const [prabhag, setPrabhag] = useState("");
  const [zoneid, setZoneid] = useState("");
  const [ward, setWard] = useState("");
  const [prabhagname, setPrabhagname] = useState("");
  const [zone, setZone] = useState("");
  const [wardno, setWardno] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const headers = ["Sr No.", "Document Name", "Image(jpg,png,pdf)"];
  const keyMapping = {
    "Sr No.": "srNo",
    "Document Name": "documentName",
    "Image(jpg,png,pdf)": "fileUpload",
  };

  useEffect(() => {
    const title = getPageTitle(serviceId);
    setPageTitle(title);
    document.title = title;
    fetchDocumentDefinitions(serviceId, ulbId);
  }, [serviceId, ulbId]);

  // Fetch document definitions - REUSE AssessmentCerti API
  const fetchDocumentDefinitions = async (serviceId, ulbId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmAssessmentCerti/documents`,
        {
          serviceId: String(serviceId),
          ulbId: String(ulbId || "3"),
        },
        {
          headers: { Authorization: `Bearer ${token || localStorage.getItem("token")}` },
        }
      );

      if (response.data.ok && response.data.data?.rows) {
        const docs = response.data.data.rows;
        setDocumentDefs(docs);
        const tableRows = docs.map((doc, index) => ({
          id: doc.DOCID || doc.DocId || index + 1,
          srNo: index + 1,
          documentName: doc.DOCNAME || doc.DocName || doc.ENGDOCDESC || "Document",
          docId: doc.DOCID || doc.DocId,
          docType: doc.DOCTYPE || doc.DocType || "PDF",
          file: null,
          fileName: "No file chosen",
          fileBuffer: null,
        }));
        setTableData(tableRows);
      }
    } catch (error) {
      console.error("Error fetching document definitions:", error);
    }
  };

  // Get property details from external API
  const getPropertyDetails = async (propNo, userId) => {
    try {
      const jsonReq = {
        jsonData: [{
          user_id: userId,
          propno: propNo,
          flatno: ""
        }]
      };
      const jsonReqString = JSON.stringify(jsonReq);
      const encryptedRequest = encryptString(jsonReqString, ENCRYPTION_KEY);
      const postData = {
        jsonData: [{
          encr_request: encryptedRequest
        }]
      };
      const response = await axios.post(EXTERNAL_API_URL, postData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      if (response?.data?.jsonData?.[0]?.encr_request) {
        const decryptedResponse = decryptString(
          response.data.jsonData[0].encr_request,
          ENCRYPTION_KEY
        );
        return JSON.parse(decryptedResponse);
      }
      return null;
    } catch (error) {
      console.error("getPropertyDetails Error:", error);
      throw error;
    }
  };

  // Handle Search button click
  const handleSearchProperty = async (values, setFieldValue) => {
    if (!values.ptn || values.ptn.trim() === "") {
      Swal.fire({
        text: "Please Enter Property Number",
        confirmButtonColor: '#1e3a8a',
      });
      return;
    }

    setIsSearching(true);
    try {
      let fullPropNo = values.ptn;
      if (values.subcode && values.subcode.trim() !== "") {
        fullPropNo = values.ptn + "/" + values.subcode;
      }

      const result = await getPropertyDetails(fullPropNo, userId);

      if (result && result.propertyOwners) {
        const propData = result.propertyOwners;

        // Check for pending payment
        if (propData.payamt && parseFloat(propData.payamt) > 0) {
          const payNowUrl = `https://propertytax.thanecity.gov.in/PropSearch.aspx?PTN=${values.ptn}`;
          Swal.fire({
            text: `Your property tax payment of Rs.${propData.payamt} is due, please make the payment first`,
            confirmButtonColor: '#1e3a8a',
            showCancelButton: true,
            cancelButtonText: "Pay Now",
            cancelButtonColor: "#d33",
          }).then((result) => {
            if (result.isConfirmed) {
              window.open(payNowUrl, '_blank');
            }
          });
          setIsSearching(false);
          return;
        }

        // Set property details in form fields
        setFieldValue("landHolder", propData.land_Holder || "");
        setFieldValue("structureHolder", propData.struct_Holder || "");
        setFieldValue("ownerDetails", propData.owner_Details || "");
        setFieldValue("address", propData.address || "");

        // Set state variables
        setYearlyTax(propData.yearly_tax || "0");
        setPrabhag(propData.prabhag || "");
        setZoneid(propData.zoneid || "");
        setWard(propData.wardno || "");
        setPrabhagname(propData.prabhagname || "");
        setZone(propData.zonename || "");
        setWardno(propData.wardname || "");

        Swal.fire({
          text: "Property details fetched successfully!",
          confirmButtonColor: '#1e3a8a',
          timer: 1500,
        });
      } else {
        Swal.fire({
          text: "Property Not Found For This Prop No",
          confirmButtonColor: '#1e3a8a',
        });
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
      Swal.fire({
        text: "Error fetching property details. Please try again.",
        confirmButtonColor: '#1e3a8a',
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Upload document - REUSE AssessmentCerti API
  const uploadDocument = async (applicationNo, doc) => {
    const formData = new FormData();
    formData.append("serviceId", String(serviceId));
    formData.append("appNo", applicationNo);
    formData.append("docType", doc.docType || "PDF");
    formData.append("documentId", String(doc.docId));
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
      return response.data.success;
    } catch (error) {
      console.error("Error uploading document:", error);
      return false;
    }
  };

  // Insert Maha Online - REUSE AssessmentCerti API
  const insertMahaOnline = async (applicationNo) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmAssessmentCerti/maha-online-first-step`,
        {
          mahaData: {
            ulbId: ulbId,
            mahaUlbId: mahaUlbId || ulbId,
            trackId: Date.now().toString(),
            districtId: "0",
          },
          applicationNo: applicationNo,
          serviceId: String(serviceId),
        },
        {
          headers: { Authorization: `Bearer ${token || localStorage.getItem("token")}` },
        }
      );
      return response.data.success;
    } catch (error) {
      console.error("Error in Maha Online integration:", error);
      return false;
    }
  };

  // Check payment flag - REUSE AssessmentCerti API
  const checkPaymentFlag = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmAssessmentCerti/payment-flag`,
        {
          serviceId: String(serviceId),
        },
        {
          headers: { Authorization: `Bearer ${token || localStorage.getItem("token")}` },
        }
      );
      if (response.data.success && response.data.data?.rows) {
        return response.data.data.rows[0]?.VAR_SERVICE_PAYFLAG || "N";
      }
      return "N";
    } catch (error) {
      console.error("Error checking payment flag:", error);
      return "N";
    }
  };

  // Handle file change
  const handleFileChange = (id, event) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const buffer = Buffer.from(new Uint8Array(arrayBuffer));
        setTableData((prev) =>
          prev.map((row) =>
            row.id === id
              ? { ...row, file: file, fileName: file.name, fileBuffer: buffer }
              : row
          )
        );
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Validation
      if (!values.ptn || values.ptn.trim() === "") {
        Swal.fire({ text: "Property No. cannot be blank", confirmButtonColor: '#1e3a8a' });
        setLoading(false);
        return;
      }

      if (!values.applicantName || values.applicantName.trim() === "") {
        Swal.fire({ text: "Please Enter Application Name", confirmButtonColor: '#1e3a8a' });
        setLoading(false);
        return;
      }

      if (!values.mobileNo || values.mobileNo.trim() === "") {
        Swal.fire({ text: "Please Enter Mobile No", confirmButtonColor: '#1e3a8a' });
        setLoading(false);
        return;
      }

      if (values.mobileNo.length !== 10 || !/^\d+$/.test(values.mobileNo)) {
        Swal.fire({ text: "Invalid Mobile No", confirmButtonColor: '#1e3a8a' });
        setLoading(false);
        return;
      }

      if (!values.emailId || values.emailId.trim() === "") {
        Swal.fire({ text: "Please Enter Email ID", confirmButtonColor: '#1e3a8a' });
        setLoading(false);
        return;
      }

      const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
      if (!emailRegex.test(values.emailId)) {
        Swal.fire({ text: "Invalid Email Address", confirmButtonColor: '#1e3a8a' });
        setLoading(false);
        return;
      }

      if (values.aadharNo && (values.aadharNo.length !== 12 || !/^\d+$/.test(values.aadharNo))) {
        Swal.fire({ text: "Invalid Aadhar No", confirmButtonColor: '#1e3a8a' });
        setLoading(false);
        return;
      }

      // Prepare documents
      const documents = [];
      for (const row of tableData) {
        if (row.fileBuffer) {
          documents.push({
            docId: row.docId,
            docName: row.documentName,
            docType: row.docType,
            fileBuffer: row.fileBuffer,
          });
        }
      }

      // Prepare payload
      const payload = {
        userId: userId,
        zoneId: zoneId,
        serviceId: String(serviceId),
        propNo: values.ptn,
        subCode: values.subcode || "",
        landHolder: values.landHolder || "",
        structHolder: values.structureHolder || "",
        ownDetails: values.ownerDetails || "",
        address: values.address || "",
        appliname: values.applicantName,
        mobile: values.mobileNo,
        email: values.emailId,
        taxAmount: yearlyTax || "0",
        aadharNo: values.aadharNo || 0,
        appSource: "WEB",
        documents: documents,
        mahaData: {
          ulbId: ulbId,
          mahaUlbId: mahaUlbId || ulbId,
          districtId: "0",
          trackId: Date.now().toString(),
        },
      };

      // Submit application to No Dues backend
      const submitResponse = await axios.post(
        `${BASE_URL}/api/FrmNoDuesCerti/submit`,
        payload,
        {
          headers: { Authorization: `Bearer ${token || localStorage.getItem("token")}` },
        }
      );

      if (!submitResponse.data.ok) {
        Swal.fire({
          text: submitResponse.data.message || "Application submission failed",
          confirmButtonColor: '#1e3a8a',
        });
        setLoading(false);
        return;
      }

      const applicationNo = submitResponse.data.data.applicationNo;
      const message = submitResponse.data.data.message || "Application submitted successfully";

      // Upload documents using common API
      for (const doc of documents) {
        const success = await uploadDocument(applicationNo, doc);
        if (!success) {
          Swal.fire({
            text: `Failed to upload document: ${doc.docName}`,
            confirmButtonColor: '#1e3a8a',
          });
          setLoading(false);
          return;
        }
      }

      // Insert Maha Online using common API
      const mahaSuccess = await insertMahaOnline(applicationNo);
      if (!mahaSuccess) {
        console.warn("Maha Online integration failed, but application was created");
      }

      // Check payment flag using common API
      const payFlag = await checkPaymentFlag();

      // Show success message
      Swal.fire({
        text: `${message} Application No: ${applicationNo}`,
        confirmButtonColor: '#1e3a8a',
      }).then(() => {
        if (payFlag === "Y") {
          navigate("/app-fee", { state: { applicationNo: applicationNo } });
        } else {
          navigate("/");
        }
      });

    } catch (error) {
      console.error("Error submitting application:", error);
      Swal.fire({
        text: error?.response?.data?.message || "Error submitting application. Please try again.",
        confirmButtonColor: '#1e3a8a',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset
  const handleReset = (resetForm) => {
    Swal.fire({
      title: "Are you sure?",
      text: "All entered data will be cleared!",
      showCancelButton: true,
      confirmButtonColor: '#1e3a8a',
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
    }).then((result) => {
      if (result.isConfirmed) {
        resetForm();
        setYearlyTax("");
        setPrabhag("");
        setZoneid("");
        setWard("");
        setPrabhagname("");
        setZone("");
        setWardno("");
        const tableRows = documentDefs.map((doc, index) => ({
          id: doc.DOCID || doc.DocId || index + 1,
          srNo: index + 1,
          documentName: doc.DOCNAME || doc.DocName || doc.ENGDOCDESC || "Document",
          docId: doc.DOCID || doc.DocId,
          docType: doc.DOCTYPE || doc.DocType || "PDF",
          file: null,
          fileName: "No file chosen",
          fileBuffer: null,
        }));
        setTableData(tableRows);
        Swal.fire({
          text: "Form has been reset successfully!",
          confirmButtonColor: '#1e3a8a',
          timer: 1500,
        });
      }
    });
  };

  // Transform table data for rendering
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
        {item.fileName && item.fileName !== "No file chosen" && (
          <span className="text-xs text-gray-500 truncate max-w-[80px]">{item.fileName}</span>
        )}
      </div>
    ),
  }));

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, setFieldValue, resetForm }) => (
        <Form>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="border shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold">
                  {pageTitle}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* PTN, Subcode, Search */}
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
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      className="bg-blue-900 hover:bg-blue-800 text-white"
                      onClick={() => handleSearchProperty(values, setFieldValue)}
                      disabled={isSearching}
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>

                {/* Property Details Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-y border-gray-300 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Land Holder" />
                      <span>:</span>
                    </div>
                    <div className="w-full min-h-9 flex items-center px-2">
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

                {/* Applicant Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label required text="Applicant Name" />
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
                </div>

                <hr />

                {/* Document Upload Table */}
                {tableData.length > 0 && (
                  <ShadCNTable
                    headers={headers}
                    data={transformedTableData}
                    keyMapping={keyMapping}
                    pagination={false}
                    className="max-md:min-w-380"
                  />
                )}

                {/* Action Buttons */}
                <div className="flex justify-center items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white"
                    disabled={loading}
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
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-100 hover:bg-gray-200"
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

export default FrmNoDuesCerti;