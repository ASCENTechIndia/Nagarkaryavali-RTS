import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/calendar";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const FrmAppealHearing_New = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appealTypes, setAppealTypes] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [formData, setFormData] = useState({
    appealNo: "",
    appealDate: new Date(),
    appealType: "",
    appealDetails: "",
    briefDescription: "",
    fine: "",
    appealStatus: "Appeal Accepted",
    isAppellantPresent: false,
    isRespondentPresent: false,
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileExtension, setFileExtension] = useState("");
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [hasFile, setHasFile] = useState(false);

  const getAuthToken = () => {
    return token || localStorage.getItem("token");
  };

  useEffect(() => {
    fetchAppealTypes();
  }, []);

  useEffect(() => {
    const appno = localStorage.getItem("Appno");
    const appealNo = localStorage.getItem("AppealNo");
    const appealTypeId = localStorage.getItem("AppealTypeId");

    if (appno && appealNo && appealTypeId) {
      fetchHearingData(appno, appealNo, appealTypeId);
    } else {
      Swal.fire({
        text: "Please select a hearing record first.",
        confirmButtonColor: "#1e3a8a",
      }).then(() => {
        navigate("/App/FrmHearingProccess");
      });
    }
  }, []);

  const fetchAppealTypes = async () => {
    try {
      
      const response = await axios.post(
        `${BASE_URL}/api/FrmHearingProccess/appeal-types`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.ok && response.data?.data?.rows) {
        const rows = response.data.data.rows;
        
        const types = rows.map((item) => ({
          value: String(item.APPEALTYPEID || item.num_appealtype_id || ""),
          label: String(item.APPEALTYPE || item.var_appealtype_appeal || "")
        })).filter(type => type.value && type.value.trim() !== "");
        
        setAppealTypes(types);
      } else {
        console.warn("No appeal types found in response");
      }
    } catch (error) {
      console.error("Error fetching appeal types:", error);
    }
  };

  const fetchHearingData = async (appno, appealNo, appealTypeId) => {
    try {
      setIsLoading(true);
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${BASE_URL}/api/FrmHearingProccess/hearing-data`,
        {
          appno: appno,
          appealno: appealNo,
          appealid: appealTypeId
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.close();

      if (response.data?.ok && response.data?.data?.rows) {
        const rows = response.data.data.rows;

        if (rows && rows.length > 0) {
          const record = rows[0];

          let appealDate = new Date();
          const dateStr = record.APPEALDATE || record.AppealDate || record.appealdate;
          if (dateStr) {
            appealDate = new Date(dateStr);
          }

          const appealTypeIdValue = record.APPEALTYPEID || record.appealtypeid || record.AppealTypeId || "";

          setFormData({
            appealNo: record.APPEALNO || record.AppealNo || record.appealno || "",
            appealDate: appealDate,
            appealType: String(appealTypeIdValue),
            appealDetails: record.BRIEFDETAILS || record.BriefDetails || record.briefdetails || "",
            briefDescription: "",
            fine: "",
            appealStatus: "Appeal Accepted",
            isAppellantPresent: false,
            isRespondentPresent: false,
          });

          setDataLoaded(true);
        } else {
          Swal.fire({
            text: "No record found for the selected hearing. Please go back and select again.",
            confirmButtonColor: "#1e3a8a",
          });
        }
      } else {
        console.warn("Unexpected response structure:", response.data);
        Swal.fire({
          text: response.data?.message || "Failed to fetch hearing data.",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      Swal.close();
      console.error("Error fetching hearing data:", error);
      Swal.fire({
        text: error.response?.data?.message || "Error fetching hearing data. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const extension = file.name.substring(file.name.lastIndexOf('.')).toUpperCase();
    const fileSize = file.size;

    if (fileSize > 5242880) {
      Swal.fire({
        text: "Document Size Should Be < 5 MB",
        confirmButtonColor: "#1e3a8a",
      });
      event.target.value = "";
      return;
    }

    if (extension !== ".PDF") {
      Swal.fire({
        text: "Document Should Be Acceptable In .pdf Format Only",
        confirmButtonColor: "#1e3a8a",
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      setUploadedFile(file);
      setFileExtension(extension);
      setFileName(file.name);
      setFilePreview(base64String);
      setHasFile(true);
    };
    reader.readAsDataURL(file);
  };

  const handleViewFile = () => {
    if (!uploadedFile) {
      Swal.fire({
        text: "No file available to view.",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    const fileURL = URL.createObjectURL(uploadedFile);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${fileName || 'Document'}</title>
            <style>
              body { margin: 0; padding: 0; height: 100vh; overflow: hidden; }
              embed { width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <embed src="${fileURL}" type="application/pdf" width="100%" height="100%" />
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      window.location.href = fileURL;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.briefDescription || formData.briefDescription.trim() === "") {
      Swal.fire({
        text: "Please Enter Brief Description",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    if (!hasFile || !uploadedFile) {
      Swal.fire({
        text: "Please Upload Order",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      Swal.fire({
        text: "Submitting..",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      let presentFlag = "";
      if (formData.isAppellantPresent && formData.isRespondentPresent) {
        presentFlag = "All";
      } else if (formData.isAppellantPresent) {
        presentFlag = "Appeallent";
      } else if (formData.isRespondentPresent) {
        presentFlag = "Respondent";
      }

      const appno = localStorage.getItem("Appno");
      const appealTypeId = localStorage.getItem("AppealTypeId");

      const userId = user?.userId || user?.EmpUserName || localStorage.getItem("userId") || "admin";

      const hearingPayload = {
        userId: userId,
        appealhearId: 0,
        appealNo: formData.appealNo,
        appealDate: formData.appealDate.toISOString().split('T')[0],
        appliNo: appno,
        appealType: parseInt(formData.appealType) || 0,
        appealDtls: formData.appealDetails,
        presents: presentFlag,
        briefDescr: formData.briefDescription,
        status: formData.appealStatus,
        fine: formData.fine || "0",
        mode: 1,
        appealTypeId: parseInt(appealTypeId || "0"),
      };

      const authToken = getAuthToken();

      const hearingResponse = await axios.post(
        `${BASE_URL}/api/FrmHearingProccess/submit-hearing`,
        hearingPayload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const isSuccess = hearingResponse.data?.ok || hearingResponse.data?.success;
      
      if (isSuccess) {
        const formDataToSend = new FormData();
        formDataToSend.append('document', uploadedFile);
        formDataToSend.append('appNo', appno);
        formDataToSend.append('appealNo', formData.appealNo);
        formDataToSend.append('docType', fileExtension);
        formDataToSend.append('appealTypeId', appealTypeId || "0");
        formDataToSend.append('serviceId', "0");

        const docResponse = await axios.post(
          `${BASE_URL}/api/FrmHearingProccess/upload-document`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const isDocSuccess = docResponse.data?.ok || docResponse.data?.success;

        if (isDocSuccess) {
          const successMessage = docResponse.data?.data?.message || 
                                 docResponse.data?.message || 
                                 "Hearing data and document saved successfully.";
          
          Swal.fire({
            text: successMessage,
            confirmButtonColor: "#1e3a8a",
          }).then(() => {
            localStorage.removeItem("Appno");
            localStorage.removeItem("AppealNo");
            localStorage.removeItem("AppealTypeId");
            navigate("/App/FrmHearingProccess");
          });
        } else {
          const errorMessage = docResponse.data?.error || 
                               docResponse.data?.message || 
                               "Document upload failed. Please try again.";
          
          Swal.fire({
            text: errorMessage,
            confirmButtonColor: "#1e3a8a",
          });
        }
      } else {
        Swal.close();
        const errorMessage = hearingResponse.data?.message || 
                             hearingResponse.data?.error || 
                             "Failed to save hearing data.";
        
        Swal.fire({
          text: errorMessage,
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      Swal.close();
      console.error("Submit Error:", error);
      
      const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message || 
                           "Error saving data. Please try again.";
      
      Swal.fire({
        text: errorMessage,
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isViewMode = formData.appealNo !== "" && dataLoaded;

  return (
    <div className="p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border shadow-sm">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="text-xl font-semibold">
              Appeal Hearing
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="w-full max-w-[100%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label className="whitespace-nowrap required">
                      Appeal No:
                    </Label>
                    <div className="col-span-2">
                      <Input
                        type="text"
                        value={formData.appealNo}
                        disabled
                        className="w-full bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label className="whitespace-nowrap required">
                      Appeal Date:
                    </Label>
                    <div className="col-span-2">
                      <DatePicker
                        value={formData.appealDate}
                        onChange={(date) => handleInputChange("appealDate", date)}
                        disabled={true}
                        className="w-full h-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label className="whitespace-nowrap required">
                      Appeal Type:
                    </Label>
                    <div className="col-span-2">
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        value={formData.appealType}
                        onChange={(e) => handleInputChange("appealType", e.target.value)}
                        disabled={true}
                        required
                      >
                        <option value="">-- Select --</option>
                        {appealTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-start gap-4">
                    <Label className="whitespace-nowrap mt-2 required">
                      Appeal Details:
                    </Label>
                    <div className="col-span-2">
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-none"
                        value={formData.appealDetails}
                        onChange={(e) => handleInputChange("appealDetails", e.target.value)}
                        disabled={true}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label className="whitespace-nowrap">
                      Presents:
                    </Label>
                    <div className="col-span-2 flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.isAppellantPresent}
                          onCheckedChange={(checked) => handleCheckboxChange("isAppellantPresent", checked)}
                        />
                        Appellant
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.isRespondentPresent}
                          onCheckedChange={(checked) => handleCheckboxChange("isRespondentPresent", checked)}
                        />
                        Respondent
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-start gap-4">
                    <Label className="whitespace-nowrap mt-2 required">
                      Brief Description:
                    </Label>
                    <div className="col-span-2">
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        value={formData.briefDescription}
                        onChange={(e) => handleInputChange("briefDescription", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label className="whitespace-nowrap">
                      Fine (If Applicable):
                    </Label>
                    <div className="col-span-2">
                      <Input
                        type="text"
                        value={formData.fine}
                        onChange={(e) => handleInputChange("fine", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label className="whitespace-nowrap required">
                      Appeal Status:
                    </Label>
                    <div className="col-span-2 flex gap-3 flex-wrap">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="appealStatus"
                          value="Appeal Accepted"
                          checked={formData.appealStatus === "Appeal Accepted"}
                          onChange={(e) => handleInputChange("appealStatus", e.target.value)}
                          className="h-4 w-4"
                        />
                        Appeal Accepted
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="appealStatus"
                          value="Appeal Partially Accepted"
                          checked={formData.appealStatus === "Appeal Partially Accepted"}
                          onChange={(e) => handleInputChange("appealStatus", e.target.value)}
                          className="h-4 w-4"
                        />
                        Appeal Partially Accepted
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="appealStatus"
                          value="Appeal Rejected"
                          checked={formData.appealStatus === "Appeal Rejected"}
                          onChange={(e) => handleInputChange("appealStatus", e.target.value)}
                          className="h-4 w-4"
                        />
                        Appeal Rejected
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label className="whitespace-nowrap required">
                      Upload Order:
                    </Label>
                    <div className="col-span-2">
                      <div className="flex items-center gap-3">
                        <Input
                          type="file"
                          ref={fileInputRef}
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="flex-1"
                        />
                      </div>
                      {hasFile && (
                        <div className="mt-2 flex items-center gap-2">
                          <img
                            src="/images/pdf-icon.png"
                            alt="PDF"
                            className="h-6 w-6"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                          <span className="text-sm text-blue-600">
                            {fileName}
                          </span>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={handleViewFile}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-center gap-4">
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 min-w-[100px]"
                    type="submit"
                    disabled={isLoading || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FrmAppealHearing_New;