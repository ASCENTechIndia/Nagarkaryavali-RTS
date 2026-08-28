import React, { useState, useEffect, useRef } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getPageTitle = (serviceName) => {
  return serviceName;
};

const initialValues = {
  applicantName: "",
  mobileNo: "",
  emailId: "",
  aadharNo: "",
  address: "",
  serviceId: "",
  zoneId: "",
  sectorId: "",
  villageId: "",
  referenceNo: "",
  locality: "",
  landmark: "",
  pincode: "",
};

const FrmServiceApplicationMst = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const isFirstRender = useRef(true);

  const locationState = location.state || {};
  
  const ulbId = locationState.ulbId || user?.ulbId;
  const userId = locationState.userId || user?.userId;
  const serviceId = locationState.serviceId || sessionStorage.getItem("ServiceId");
  const serviceName = locationState.serviceName || sessionStorage.getItem("ServEngName");

  const [loading, setLoading] = useState(false);
  const [documentDefs, setDocumentDefs] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [pageTitle, setPageTitle] = useState(serviceName);
  const [sectorList, setSectorList] = useState([]);
  const [villageList, setVillageList] = useState([]);
  const [isSectorVisible, setIsSectorVisible] = useState(false);
  const [zoneList, setZoneList] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const headers = ["Sr No.", "Document Name", "Image(jpg,png,pdf)"];
  const keyMapping = {
    "Sr No.": "srNo",
    "Document Name": "documentName",
    "Image(jpg,png,pdf)": "fileUpload",
  };

  useEffect(() => {
    const title = getPageTitle(serviceName);
    setPageTitle(title);
    document.title = title;
    
    if (ulbId && serviceId && isFirstRender.current) {
      isFirstRender.current = false;
      fetchZones();
      fetchDocumentDefinitions(serviceId, ulbId);
      checkSectorVisibility(serviceId);
    }
  }, [serviceId, ulbId, serviceName]);

  const checkSectorVisibility = (serviceId) => {
    const sectorServices = ["60", "62"];
    const isSector = sectorServices.includes(String(serviceId));
    setIsSectorVisible(isSector);
    
    if (isSector) {
      fetchSectors();
    }
  };

  const fetchZones = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmServiceApplicationMst/wardlist`,
        {
          ulbId: Number(ulbId),
        },
        {
          headers: { 
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response?.data?.ok && response?.data?.data?.data) {
        const wardData = response.data.data.data;
        if (Array.isArray(wardData)) {
          setZoneList(wardData);
        } else {
          setZoneList([]);
        }
      } else {
        setZoneList([]);
      }
    } catch (error) {
      console.error("Error fetching zones:", error);
      setZoneList([]);
      Swal.fire({
        text: "Failed to load Prabhag list. Please try again.",
        confirmButtonColor: '#1e3a8a',
      });
    }
  };

  const fetchSectors = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmServiceApplicationMst/sectorlist`,
        {
          serviceId: String(serviceId),
        },
        {
          headers: { 
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response?.data?.ok && response?.data?.data) {
        setSectorList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };

  const fetchVillages = async (sectorId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmServiceApplicationMst/villagelist`,
        {
          sectorId: sectorId,
        },
        {
          headers: { 
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response?.data?.ok && response?.data?.data) {
        setVillageList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching villages:", error);
      setVillageList([]);
    }
  };

  const fetchDocumentDefinitions = async (serviceId, ulbId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmServiceApplicationMst/documentlist`,
        {
          serviceId: String(serviceId),
          ulbId: Number(ulbId),
        },
        {
          headers: { 
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.ok && response.data.data.data) {
        const docs = response.data.data.data;
        setDocumentDefs(docs);
        const tableRows = docs.map((doc, index) => ({
          id: doc.DOCID || doc.docId || index + 1,
          srNo: index + 1,
          documentName: doc.DOCNAME || doc.docName || doc.ENGDOCDESC || "Document",
          docId: doc.DOCID || doc.docId,
          docType: doc.DOCTYPE || doc.docType || "PDF",
          file: null,
          fileName: "No file chosen",
          fileBuffer: null,
        }));
        setTableData(tableRows);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching document definitions:", error);
      setTableData([]);
    }
  };

  const handleFileChange = (id, event) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop().toUpperCase();
      const validExtensions = ['JPEG', 'JPG', 'PNG', 'PDF'];
      
      if (!validExtensions.includes(extension)) {
        Swal.fire({
          text: "Document Should Be Acceptable In JPEG/JPG/PNG/PDF Format Only",
          confirmButtonColor: '#1e3a8a',
        });
        event.currentTarget.value = '';
        return;
      }

      const maxSize = import.meta.env.VITE_MAX_FILE_SIZE || 5242880;
      if (file.size > maxSize) {
        Swal.fire({
          text: `Document Size Should Be < ${maxSize / 1048576} MB`,
          confirmButtonColor: '#1e3a8a',
        });
        event.currentTarget.value = '';
        return;
      }

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

  const validateFields = (values) => {
    const requiredFields = ['applicantName', 'mobileNo', 'emailId'];
    
    for (const field of requiredFields) {
      if (!values[field]?.trim()) {
        Swal.fire({
          text: `Please Enter ${field.replace(/([A-Z])/g, ' $1').trim()}`,
          confirmButtonColor: '#1e3a8a',
        });
        return false;
      }
    }

    if (values.mobileNo.length !== 10 || !/^\d+$/.test(values.mobileNo)) {
      Swal.fire({
        text: "Invalid Mobile No - must be 10 digits",
        confirmButtonColor: '#1e3a8a',
      });
      return false;
    }

    const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
    if (!emailRegex.test(values.emailId)) {
      Swal.fire({
        text: "Invalid Email Address",
        confirmButtonColor: '#1e3a8a',
      });
      return false;
    }

    if (values.aadharNo && values.aadharNo.trim() !== "") {
      if (values.aadharNo.length !== 12 || !/^\d+$/.test(values.aadharNo)) {
        Swal.fire({
          text: "Invalid Aadhar No - must be 12 digits",
          confirmButtonColor: '#1e3a8a',
        });
        return false;
      }
    }

    if (!isSectorVisible) {
      if (!values.zoneId || values.zoneId === "0" || values.zoneId === "") {
        Swal.fire({
          text: "Please Select Prabhag",
          confirmButtonColor: '#1e3a8a',
        });
        return false;
      }
    } else {
      if (!values.sectorId || values.sectorId === "0" || values.sectorId === "") {
        Swal.fire({
          text: "Select valid Sector from the list",
          confirmButtonColor: '#1e3a8a',
        });
        return false;
      }

      if (!values.villageId || values.villageId === "0" || values.villageId === "") {
        Swal.fire({
          text: "Select valid Village from the list",
          confirmButtonColor: '#1e3a8a',
        });
        return false;
      }
    }

    return true;
  };

  const validateDocuments = () => {
    if (tableData.length === 0) return true;
    return true;
  };

  const uploadDocuments = async (applicationNo) => {
    const formData = new FormData();
    formData.append("corpid", Number(ulbId));
    formData.append("serviceId", String(serviceId));
    formData.append("appNo", applicationNo);

    const documentIds = [];
    const files = [];

    tableData.forEach((row) => {
      if (row.fileBuffer) {
        documentIds.push(row.docId);
        files.push(row.file);
      }
    });

    if (documentIds.length === 0) {
      return true;
    }

    formData.append("documentIds", documentIds.join(","));

    files.forEach((file, index) => {
      formData.append(`document_${index}`, file);
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmServiceApplicationMst/upload-document`,
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
      console.error("Error uploading documents:", error);
      return false;
    }
  };

  // const handleSubmit = async (values, { setSubmitting }) => {
  //   setLoading(true);
  //   try {
  //     if (!validateFields(values)) {
  //       setLoading(false);
  //       setSubmitting(false);
  //       return;
  //     }

  //     if (!validateDocuments()) {
  //       setLoading(false);
  //       setSubmitting(false);
  //       return;
  //     }

  //     const loader = Swal.fire({
  //       title: "Submitting Application...",
  //       text: "Please wait while we process your application.",
  //       allowOutsideClick: false,
  //       showConfirmButton: false,
  //       didOpen: () => Swal.showLoading(),
  //     });

  //     const savePayload = {
  //       ulbId: Number(ulbId),
  //       userId: String(userId),
  //       serviceId: String(serviceId),
  //       applicationName: values.applicantName?.trim() || "",
  //       address: values.address?.trim() || "",
  //       mobile: values.mobileNo?.trim() || "",
  //       email: values.emailId?.trim() || "",
  //       aadharNo: values.aadharNo?.trim() || "0",
  //       refNo: values.referenceNo?.trim() || "",
  //       zoneId: isSectorVisible ? 0 : Number(values.zoneId || 0),
  //       sectorId: isSectorVisible ? Number(values.sectorId || 0) : 0,
  //       villageId: isSectorVisible ? Number(values.villageId || 0) : 0,
  //       locality: values.locality?.trim() || "",
  //       landmark: values.landmark?.trim() || "",
  //       pincode: values.pincode ? Number(values.pincode) : 0,
  //       source: "WEB",
  //     };

  //     console.log("Saving application with payload:", savePayload);

  //     const saveResponse = await axios.post(
  //       `${BASE_URL}/api/FrmServiceApplicationMst/save`,
  //       savePayload,
  //       {
  //         headers: { 
  //           Authorization: `Bearer ${token || localStorage.getItem("token")}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     console.log("Save response:", saveResponse.data);

  //     if (!saveResponse.data.success) {
  //       loader.close();
  //       Swal.fire({
  //         text: saveResponse.data.message || "Application submission failed",
  //         confirmButtonColor: '#1e3a8a',
  //       });
  //       setLoading(false);
  //       setSubmitting(false);
  //       return;
  //     }

  //     const applicationNo = saveResponse.data.applicationNo;
  //     const message = saveResponse.data.message || "Application submitted successfully";

  //     sessionStorage.setItem("Appno", applicationNo);
  //     sessionStorage.setItem("Service", pageTitle);

  //     if (tableData.length > 0) {
  //       const uploadSuccess = await uploadDocuments(applicationNo);
  //       if (!uploadSuccess) {
  //         loader.close();
  //         Swal.fire({
  //           text: "Application saved but document upload failed. Please contact support.",
  //           confirmButtonColor: '#1e3a8a',
  //         });
  //         setLoading(false);
  //         setSubmitting(false);
  //         return;
  //       }
  //     }

  //     loader.close();

  //     const parts = message.split('$');
  //     const displayMessage = parts[0] || message;
  //     const payFlag = parts[1] || "N";

  //     Swal.fire({
  //       text: displayMessage,
  //       confirmButtonColor: '#1e3a8a',
  //     }).then(() => {
  //       if (payFlag === "N" || payFlag === "N") {
  //         window.location.reload();
  //       } else {
  //         navigate("/app/FrmAppliFee", { state: { applicationNo } });
  //       }
  //     });

  //   } catch (error) {
  //     console.error("Error submitting application:", error);
      
  //     let errorMessage = "Error submitting application. Please try again.";
      
  //     if (error.response) {
  //       console.error("Response data:", error.response.data);
  //       console.error("Response status:", error.response.status);
  //       errorMessage = error.response.data?.message || 
  //                      error.response.data?.error || 
  //                      errorMessage;
  //     } else if (error.request) {
  //       errorMessage = "No response from server. Please check your connection.";
  //     } else {
  //       errorMessage = error.message;
  //     }
      
  //     Swal.fire({
  //       text: errorMessage,
  //       confirmButtonColor: '#1e3a8a',
  //     });
  //   } finally {
  //     setLoading(false);
  //     setSubmitting(false);
  //   }
  // };

const handleSubmit = async (values, { setSubmitting }) => {
  setLoading(true);
  try {
    if (!validateFields(values)) {
      setLoading(false);
      setSubmitting(false);
      return;
    }

    if (!validateDocuments()) {
      setLoading(false);
      setSubmitting(false);
      return;
    }

    const loader = Swal.fire({
      title: "Submitting Application...",
      text: "Please wait while we process your application.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    const savePayload = {
      ulbId: Number(ulbId),
      userId: String(userId),
      serviceId: String(serviceId),
      applicationName: values.applicantName?.trim() || "",
      address: values.address?.trim() || "",
      mobile: Number(values.mobileNo?.trim()) || 0, 
      email: values.emailId?.trim() || "",
      aadharNo: values.aadharNo?.trim() ? Number(values.aadharNo.trim()) : 0,
      refNo: values.referenceNo?.trim() || "",
      zoneId: isSectorVisible ? 0 : (values.zoneId ? Number(values.zoneId) : 0),
      sectorId: isSectorVisible ? (values.sectorId ? Number(values.sectorId) : 0) : 0,
      villageId: isSectorVisible ? (values.villageId ? Number(values.villageId) : 0) : 0,
      locality: values.locality?.trim() || "",
      landmark: values.landmark?.trim() || "",
      pincode: values.pincode ? Number(values.pincode) : 0,
      source: "WEB",
    };

    console.log("Saving application with payload:", savePayload);

    const saveResponse = await axios.post(
      `${BASE_URL}/api/FrmServiceApplicationMst/save`,
      savePayload,
      {
        headers: { 
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Save response:", saveResponse.data);

    if (!saveResponse.data.success) {
      loader.close();
      Swal.fire({
        text: saveResponse.data.message || "Application submission failed",
        confirmButtonColor: '#1e3a8a',
      });
      setLoading(false);
      setSubmitting(false);
      return;
    }

    const applicationNo = saveResponse.data.applicationNo;
    const message = saveResponse.data.message || "Application submitted successfully";

    sessionStorage.setItem("Appno", applicationNo);
    sessionStorage.setItem("Service", pageTitle);

    if (tableData.length > 0) {
      const uploadSuccess = await uploadDocuments(applicationNo);
      if (!uploadSuccess) {
        loader.close();
        Swal.fire({
          text: "Application saved but document upload failed. Please contact support.",
          confirmButtonColor: '#1e3a8a',
        });
        setLoading(false);
        setSubmitting(false);
        return;
      }
    }

    loader.close();

    const parts = message.split('$');
    const displayMessage = parts[0] || message;
    const payFlag = parts[1] || "N";

    Swal.fire({
      text: displayMessage,
      confirmButtonColor: '#1e3a8a',
    }).then(() => {
      if (payFlag === "N" || payFlag === "N") {
        window.location.reload();
      } else {
        navigate("/app/FrmAppliFee", { state: { applicationNo } });
      }
    });

  } catch (error) {
    console.error("Error submitting application:", error);
    
    let errorMessage = "Error submitting application. Please try again.";
    
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      errorMessage = error.response.data?.message || 
                     error.response.data?.error || 
                     errorMessage;
    } else if (error.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = error.message;
    }
    
    Swal.fire({
      text: errorMessage,
      confirmButtonColor: '#1e3a8a',
    });
  } finally {
    setLoading(false);
    setSubmitting(false);
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
          className="h-9 text-sm p-1 w-[60%]"
        />
        {item.fileName && item.fileName !== "No file chosen" && (
          <span className="text-xs text-gray-500 truncate max-w-[80px]">{item.fileName}</span>
        )}
      </div>
    ),
  }));

  const getTableDisplayData = () => {
    if (transformedTableData.length > 0) {
      return transformedTableData;
    }
    return [];
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, setFieldValue, isSubmitting }) => (
        <Form>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="border shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold">
                  {pageTitle}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Applicant Name */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-36 shrink-0 flex justify-start sm:justify-between items-center">
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

                  {/* Applicant Address */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-36 shrink-0 flex justify-start sm:justify-between items-center whitespace-nowrap">
                      <Label text="Applicant Address" />
                      <span>:</span>
                    </div>
                    <Input
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      className="w-full h-9"
                    />
                  </div>

                  {/* Mobile No. */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-36 shrink-0 flex justify-start sm:justify-between items-center">
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

                  {/* Email ID */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-36 shrink-0 flex justify-start sm:justify-between items-center">
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

                  {/* Aadhar No. */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-36 shrink-0 flex justify-start sm:justify-between items-center">
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

                  {/* Reference No. */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-36 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label text="Reference No." />
                      <span>:</span>
                    </div>
                    <Input
                      name="referenceNo"
                      value={values.referenceNo}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue("referenceNo", value);
                      }}
                      className="w-full h-9"
                      type="text"
                    />
                  </div>

                  {isSectorVisible ? (
                    <>
                      {/* Sector Dropdown */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-36 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="Sector" />
                          <span>:</span>
                        </div>
                        <Select
                          value={values.sectorId}
                          onValueChange={(value) => {
                            setFieldValue("sectorId", value);
                            setFieldValue("villageId", "");
                            setVillageList([]);
                            if (value && value !== "0") {
                              fetchVillages(value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full h-9">
                            <SelectValue placeholder="-- Select Sector --" />
                          </SelectTrigger>
                          <SelectContent>
                            {sectorList.map((sector) => (
                              <SelectItem 
                                key={sector.sectorId || sector.SECTORID} 
                                value={String(sector.sectorId || sector.SECTORID)}
                              >
                                {sector.sectorName || sector.SECTORNAME}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Village Dropdown */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-36 shrink-0 flex justify-start sm:justify-between items-center">
                          <Label required text="Village" />
                          <span>:</span>
                        </div>
                        <Select
                          value={values.villageId}
                          onValueChange={(value) => setFieldValue("villageId", value)}
                          disabled={!values.sectorId || values.sectorId === "0"}
                        >
                          <SelectTrigger className="w-full h-9">
                            <SelectValue placeholder="-- Select Village --" />
                          </SelectTrigger>
                          <SelectContent>
                            {villageList.map((village) => (
                              <SelectItem 
                                key={village.villageId || village.VILLAGEID} 
                                value={String(village.villageId || village.VILLAGEID)}
                              >
                                {village.villageName || village.VILLAGENAME}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    /* Prabhag Dropdown */
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="sm:w-36 shrink-0 flex justify-start sm:justify-between items-center">
                        <Label required text="Prabhag" />
                        <span>:</span>
                      </div>
                      <Select
                        value={values.zoneId}
                        onValueChange={(value) => setFieldValue("zoneId", value)}
                      >
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="-- Select Prabhag --" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(zoneList) && zoneList.map((zone) => (
                            <SelectItem 
                              key={zone.wardid || zone.WARDID} 
                              value={String(zone.wardid || zone.WARDID)}
                            >
                              {zone.wardname || zone.WARDNAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <ShadCNTable
                    headers={headers}
                    data={getTableDisplayData()}
                    keyMapping={keyMapping}
                    pagination={false}
                    className="max-md:min-w-380"
                  />
                </div>
                
                <div className="flex justify-center items-center gap-3 pt-4">
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

export default FrmServiceApplicationMst;