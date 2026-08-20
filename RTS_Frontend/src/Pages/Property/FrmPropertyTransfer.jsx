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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const ENCRYPTION_KEY = "AS23N7E2H4V717DEAS23N7E2H4V717DE";
const EXTERNAL_API_URL = "http://ptaxtmccollection.thanecity.gov.in/TMC_IGRClient/Service.svc/GetDataDetails_TMC";

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

const initialValues = {
  ptn: "",
  subcode: "",
  landHolder: "",
  structureOwner: "",
  ownerName: "",
  occupierName: "",
  area: "",
  legalStatus: "",
  propertyType: "",
  address: "",
  transferType: "",
  newOwnerName: "",
  mobileNo: "",
  emailId: "",
  newAddress: "",
  aadharNo: "",
};

const FrmPropertyTransfer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;
  const ulbId = user?.ulbId || "3";
  const userId = user?.userId || "151";
  const zoneId = user?.zoneId || "12";
  const mahaUlbId = user?.mahaUlbId || "";
  const serviceId = user?.serviceId || "4";

  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [transferTypes, setTransferTypes] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [documentDefs, setDocumentDefs] = useState([]);
  const [constType, setConstType] = useState("0");
  const [prabhag, setPrabhag] = useState("");
  const [zoneid, setZoneid] = useState("");
  const [ward, setWard] = useState("");
  const [prabhagname, setPrabhagname] = useState("");
  const [zone, setZone] = useState("");
  const [wardno, setWardno] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

  const headers = ["Sr No.", "Document Name", "Image(jpg,png,pdf)"];
  const keyMapping = {
    "Sr No.": "srNo",
    "Document Name": "documentName",
    "Image(jpg,png,pdf)": "fileUpload",
  };

  useEffect(() => {
    fetchTransferTypes();
    fetchDocumentDefinitions(serviceId, ulbId);
    document.title = serviceId === "4"
      ? "Transfer of Property Certificate - Sale based on documents"
      : "Transfer of Property Certificate - Heredity";
  }, [serviceId, ulbId]);

  const fetchTransferTypes = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmPropertyTransfer/transfer-types`,
        {},
        {
          headers: { Authorization: `Bearer ${token || localStorage.getItem("token")}` },
        }
      );

      if (response.data.ok && response.data.data?.rows) {
        setTransferTypes(response.data.data.rows);
        
        const autoSelectType = response.data.data.rows.find(
          type => {
            if (serviceId === "4") {
              return type.VAR_TRANSFERTYPE_NAME?.toLowerCase().includes("sale") ||
                    type.NUM_TRANSFERTYPE_ID === 66;
            } else if (serviceId === "5") {
              return type.VAR_TRANSFERTYPE_NAME?.toLowerCase().includes("heir") ||
                    type.VAR_TRANSFERTYPE_NAME?.toLowerCase().includes("heredity") ||
                    type.NUM_TRANSFERTYPE_ID === 126;
            }
            return false;
          }
        );

        if (autoSelectType) {
          setFieldValue("transferType", String(autoSelectType.NUM_TRANSFERTYPE_ID));
        }
      }
    } catch (error) {
      console.error("Error fetching transfer types:", error);
    }
  };

  const fetchDocumentDefinitions = async (serviceId, ulbId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmAssessmentCerti/documents`,
        {
          serviceId,
          ulbId,
        },
        {
          headers: { Authorization: `Bearer ${token || localStorage.getItem("token")}` },
        }
      );

      if (response.data.ok && response.data.data?.rows) {
        const docs = response.data.data.rows;
        setDocumentDefs(docs);
        const tableRows = docs.map((doc, index) => ({
          id: doc.DOCID || index + 1,
          srNo: index + 1,
          documentName: doc.DOCNAME || doc.ENGDOCDESC || "Document",
          docId: doc.DOCID,
          docType: doc.DOCTYPE || "PDF",
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

        if (propData.payamt && parseFloat(propData.payamt) > 0) {
          const payNowUrl = `https://propertytax.thanecity.gov.in/PropSearch.aspx?PTN=${values.ptn}`;
          Swal.fire({
            text: `Property tax payment of Rs.${propData.payamt} is due, please make the payment first`,
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

        setFieldValue("landHolder", propData.land_Holder || "");
        setFieldValue("structureOwner", propData.struct_Holder || "");
        setFieldValue("ownerName", propData.owner_Details || "");
        setFieldValue("occupierName", propData.Occupier_name || "");
        setFieldValue("area", propData.prop_area || "");
        setFieldValue("legalStatus", propData.legalstat === "0" ? "IlLegal" : "Legal");
        setFieldValue("propertyType", propData.usagetype_name || "");
        setFieldValue("address", propData.address || "");

        setConstType(propData.consttype || "0");
        setPrabhag(propData.prabhag || "");
        setZoneid(propData.zoneid || "");
        setWard(propData.wardno || "");
        setPrabhagname(propData.prabhagname || "");
        setZone(propData.zonename || "");
        setWardno(propData.wardname || "");

        const autoSelectType = transferTypes.find(
          type => {
            if (serviceId === "4") {
              return type.TRANSFER_TYPE_NAME?.toLowerCase().includes("sale") ||
                type.TRANSFER_TYPE_ID === 66;
            } else if (serviceId === "5") {
              return type.TRANSFER_TYPE_NAME?.toLowerCase().includes("heredity") ||
                type.TRANSFER_TYPE_ID === 126;
            }
            return false;
          }
        );

        if (autoSelectType) {
          setFieldValue("transferType", String(autoSelectType.TRANSFER_TYPE_ID));
        }

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

  const uploadDocument = async (applicationNo, doc) => {
    const formData = new FormData();
    formData.append("serviceId", serviceId);
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
          serviceId: serviceId,
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

  const checkPaymentFlag = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmAssessmentCerti/payment-flag`,
        {
          serviceId: serviceId,
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

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (!values.ptn || values.ptn.trim() === "") {
        Swal.fire({ text: "Property Number cannot be blank", confirmButtonColor: '#1e3a8a', });
        setLoading(false);
        return;
      }

      if (!values.newOwnerName || values.newOwnerName.trim() === "") {
        Swal.fire({ text: "Owner Name cannot be blank", confirmButtonColor: '#1e3a8a', });
        setLoading(false);
        return;
      }

      if (!values.emailId || values.emailId.trim() === "") {
        Swal.fire({ text: "Email ID cannot be blank", confirmButtonColor: '#1e3a8a', });
        setLoading(false);
        return;
      }

      const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
      if (!emailRegex.test(values.emailId)) {
        Swal.fire({ text: "Invalid Email Address", confirmButtonColor: '#1e3a8a', });
        setLoading(false);
        return;
      }

      if (!values.newAddress || values.newAddress.trim() === "") {
        Swal.fire({ text: "Address cannot be blank", confirmButtonColor: '#1e3a8a', });
        setLoading(false);
        return;
      }

      if (!values.mobileNo || values.mobileNo.trim() === "") {
        Swal.fire({ text: "Mobile Number cannot be blank", confirmButtonColor: '#1e3a8a', });
        setLoading(false);
        return;
      }

      if (values.mobileNo.length !== 10 || !/^\d+$/.test(values.mobileNo)) {
        Swal.fire({ text: "Invalid Mobile Number", confirmButtonColor: '#1e3a8a', });
        setLoading(false);
        return;
      }

      if (values.aadharNo && (values.aadharNo.length !== 12 || !/^\d+$/.test(values.aadharNo))) {
        Swal.fire({ text: "Invalid Aadhar Number", confirmButtonColor: '#1e3a8a', });
        setLoading(false);
        return;
      }

      if (!values.transferType) {
        Swal.fire({ text: "Please select Transfer Type", confirmButtonColor: '#1e3a8a', });
        setLoading(false);
        return;
      }

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

      const payload = {
        userId: userId,
        zoneId: zoneId,
        serviceId: serviceId,
        propNo: values.ptn,
        subCode: values.subcode || "",
        landHolder: values.landHolder || "",
        structOwner: values.structureOwner || "",
        oldOwnName: values.ownerName || "",
        newOwnName: values.newOwnerName,
        occupName: values.occupierName || "",
        legalStat: values.legalStatus || "",
        address: values.address || "",
        propType: values.propertyType || "",
        areaofProp: values.area || "",
        transType: values.transferType,
        consttype: constType || "0",
        appliEmail: values.emailId,
        appliAddr: values.newAddress,
        appliMobile: values.mobileNo,
        appliAadhar: values.aadharNo || 0,
        appSource: "WEB",
        documents: documents,
        mahaData: {
          ulbId: ulbId,
          mahaUlbId: mahaUlbId || ulbId,
          districtId: "0",
          trackId: Date.now().toString(),
        },
      };

      const submitResponse = await axios.post(
        `${BASE_URL}/api/FrmPropertyTransfer/submit`,
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

      for (const doc of tableData) {
        if (doc.file) {
          const success = await uploadDocument(applicationNo, doc);
          if (!success) {
            Swal.fire({
              text: `Failed to upload document: ${doc.documentName}`,
              confirmButtonColor: '#1e3a8a',
            });
            setLoading(false);
            return;
          }
        }
      }

      const mahaSuccess = await insertMahaOnline(applicationNo);
      if (!mahaSuccess) {
        console.warn("Maha Online integration failed, but application was created");
      }

      const payFlag = await checkPaymentFlag();

      Swal.fire({
        text: `Application ${applicationNo} submitted successfully!${payFlag === "Y" ? " Please proceed to payment." : ""}`,
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
        setConstType("0");
        setPrabhag("");
        setZoneid("");
        setWard("");
        setPrabhagname("");
        setZone("");
        setWardno("");
        const tableRows = documentDefs.map((doc, index) => ({
          id: doc.DOCID || doc.DocId || index + 1,
          srNo: index + 1,
          documentName: doc.DOCNAME || doc.DocName || "Document",
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
                  {serviceId === "4"
                    ? "Transfer of Property Certificate - Sale based on documents"
                    : "Transfer of Property Certificate - Heredity"}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-y border-gray-300 py-3">
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
                      <Label text="Structure Owner" />
                      <span>:</span>
                    </div>
                    <div className="w-full min-h-9 flex items-center px-2">
                      {values.structureOwner || ""}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Owner Name" />
                      <span>:</span>
                    </div>
                    <div className="w-full min-h-9 flex items-center px-2">
                      {values.ownerName || ""}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Occupier Name" />
                      <span>:</span>
                    </div>
                    <div className="w-full min-h-9 flex items-center px-2">
                      {values.occupierName || ""}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Area of Property" />
                      <span>:</span>
                    </div>
                    <div className="w-full min-h-9 flex items-center px-2">
                      {values.area || ""}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Legal Status" />
                      <span>:</span>
                    </div>
                    <div className="w-full min-h-9 flex items-center px-2">
                      {values.legalStatus || ""}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Property Type" />
                      <span>:</span>
                    </div>
                    <div className="w-full min-h-9 flex items-center px-2">
                      {values.propertyType || ""}
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

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="Transfer Type" />
                        <span>:</span>
                      </div>
                      <Select
                        value={values.transferType}
                        onValueChange={(value) => setFieldValue("transferType", value)}
                      >
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="-- Select Option --" />
                        </SelectTrigger>
                        <SelectContent>
                          {transferTypes.map((type) => (
                            <SelectItem
                              key={type.NUM_TRANSFERTYPE_ID}
                              value={String(type.NUM_TRANSFERTYPE_ID)}
                            >
                              {type.VAR_TRANSFERTYPE_NAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <hr />

                  <h3 className="font-bold text-lg">New Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="Owner Name" />
                        <span>:</span>
                      </div>
                      <Input
                        name="newOwnerName"
                        value={values.newOwnerName}
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
                        <Label required text="Address" />
                        <span>:</span>
                      </div>
                      <Input
                        name="newAddress"
                        value={values.newAddress}
                        onChange={handleChange}
                        className="w-full h-9"
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

export default FrmPropertyTransfer;