import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import config from "@/utils/config";

const FrmDocMst = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  const mode = location.state?.mode;
  const serviceId = location.state?.serviceId || null;

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [documents, setDocuments] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isEditMode, setIsEditMode] = useState(mode === "2");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const inputRefs = useRef({});

  const gridHeaders = [
    "Doc Service English Name",
    "Doc Service Marathi Name",
    "Doc charges per Copy",
    "Flag"
  ];

  const keyMapping = {
    "Doc Service English Name": "engName",
    "Doc Service Marathi Name": "marathiName",
    "Doc charges per Copy": "charges",
    "Flag": "active"
  };

  useEffect(() => {
    document.title = "Service Document Master";
    fetchAllServices();
    
    if (isEditMode && serviceId) {
      setSelectedService(serviceId.toString());
      fetchDocumentData(serviceId);
    }
  }, [isEditMode, serviceId]);

  const fetchAllServices = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/Doclist/all-services`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      let dataArray = [];
      
      if (response.data && response.data.data) {
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          dataArray = response.data.data.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          dataArray = response.data.data;
        } else if (Array.isArray(response.data)) {
          dataArray = response.data;
        }
      }

      if (dataArray && dataArray.length > 0) {
        setServiceList(dataArray);
      } else {
        console.log("No services found in response");
        setServiceList([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      Swal.fire({
        text: "Error fetching services. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentData = async (serviceId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/Doclist/documents-by-service`,
        { serviceId: serviceId },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      let dataArray = [];
      
      if (response.data && response.data.data) {
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          dataArray = response.data.data.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          dataArray = response.data.data;
        } else if (Array.isArray(response.data)) {
          dataArray = response.data;
        }
      }

      if (dataArray && dataArray.length > 0) {
        const formattedData = dataArray.map((item) => ({
          docId: item.NUM_DOC_ID || item.num_doc_id || "",
          engName: item.VAR_DOC_ENGNAME || item.var_doc_engname || "",
          marathiName: item.VAR_DOC_MARNAME || item.var_doc_marname || "",
          charges: item.VAR_DOC_CHARGEPERCOPY || item.var_doc_chargepercopy || "",
          active: item.VAR_DOC_ACTIVE || item.var_doc_active || "Y",
          isNew: false
        }));
        setDocuments(formattedData);
        setShowTable(true);
        setIsDataLoaded(true);
      } else {
        setDocuments([{
          docId: "",
          engName: "",
          marathiName: "",
          charges: "",
          active: "Y",
          isNew: true
        }]);
        setShowTable(true);
        setIsDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching document data:", error);
      Swal.fire({
        text: error?.response?.data?.error || "Error fetching document details. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (value) => {
    setSelectedService(value);
    setShowTable(true);
    setDocuments([{
      docId: "",
      engName: "",
      marathiName: "",
      charges: "",
      active: "Y",
      isNew: true
    }]);
  };

  const addNewRow = () => {
    const newRow = {
      docId: "",
      engName: "",
      marathiName: "",
      charges: "",
      active: "Y",
      isNew: true
    };
    setDocuments([...documents, newRow]);
    
    setTimeout(() => {
      const lastIndex = documents.length;
      const input = inputRefs.current[`engName_${lastIndex}`];
      if (input) input.focus();
    }, 100);
  };

  const handleInputChange = (index, field, value) => {
    const updatedDocs = [...documents];
    updatedDocs[index] = {
      ...updatedDocs[index],
      [field]: value
    };
    setDocuments(updatedDocs);
  };

  const validateForm = () => {
    if (!selectedService || selectedService === "") {
      Swal.fire({
        text: "Please select a service",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      
      if (!doc.engName || !doc.engName.trim()) {
        Swal.fire({
          text: `Please enter Document Name (English) for row ${i + 1}`,
          confirmButtonColor: "#1e3a8a",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const docSerStr = documents.map(doc => 
        `${doc.docId || ""}$${doc.engName.trim()}$${doc.marathiName || ""}$${doc.charges || "0"}$${doc.active}`
      ).join("#");

      const docData = {
        userId: user?.userId || "SYSTEM",
        mode: isEditMode ? 2 : 1,
        docSerId: parseInt(selectedService),
        docSerStr: docSerStr,
        ipAddress: "",
        source: config.source
      };

      const response = await axios.post(
        `${BASE_URL}/api/Doclist/save-document`,
        docData,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      let responseData = response.data;
      
      if (responseData && responseData.data) {
        responseData = responseData.data;
      }
      if (responseData && responseData.data) {
        responseData = responseData.data;
      }

      if (responseData) {
        const errorCode = responseData.errorCode;
        const errorMsg = responseData.errorMsg || responseData.message;
        const success = responseData.success;

        const isSuccess = success === true || 
          (errorMsg && (
            errorMsg.toLowerCase().includes("success") || 
            errorMsg.toLowerCase().includes("updated") ||
            errorMsg.toLowerCase().includes("inserted") ||
            errorMsg.toLowerCase().includes("saved")
          ));

        if (isSuccess) {
          const successMessage = isEditMode 
            ? "Document details updated successfully!" 
            : "Document details saved successfully!";
          
          Swal.fire({
            text: successMessage,
            confirmButtonColor: "#1e3a8a",
          }).then(() => {
            navigate("/app/FrmDocList");
          });
        } else {
          Swal.fire({
            text: errorMsg || "Error saving document details. Please try again.",
            confirmButtonColor: "#1e3a8a",
          });
        }
      } else {
        Swal.fire({
          text: "Error saving document details. Please try again.",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      console.error("Error saving documents:", error);
      Swal.fire({
        text: error?.response?.data?.error || "Error saving document details. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/app/FrmDocList");
  };

  const prepareTableData = () => {
    return documents.map((doc, index) => ({
      engName: (
        <div className="flex items-center gap-2">
          <Input
            ref={(el) => (inputRefs.current[`engName_${index}`] = el)}
            type="text"
            value={doc.engName}
            onChange={(e) => handleInputChange(index, "engName", e.target.value)}
            className="w-full h-8 text-sm"
          />
        </div>
      ),
      marathiName: (
        <Input
          ref={(el) => (inputRefs.current[`marathiName_${index}`] = el)}
          type="text"
          value={doc.marathiName}
          onChange={(e) => handleInputChange(index, "marathiName", e.target.value)}
          className="w-full h-8 text-sm"
        />
      ),
      charges: (
        <Input
          ref={(el) => (inputRefs.current[`charges_${index}`] = el)}
          type="number"
          step="0.01"
          min="0"
          value={doc.charges}
          onChange={(e) => handleInputChange(index, "charges", e.target.value)}
          className="w-full h-8 text-sm"
        />
      ),
      active: (
        <div className="flex justify-center gap-4">
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <Input
              type="radio"
              name={`active_${index}`}
              checked={doc.active === "Y"}
              onChange={() => handleInputChange(index, "active", "Y")}
              className="h-4 w-4"
            />
            Active
          </label>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <Input
              type="radio"
              name={`active_${index}`}
              checked={doc.active === "N"}
              onChange={() => handleInputChange(index, "active", "N")}
              className="h-4 w-4"
            />
            Inactive
          </label>
        </div>
      )
    }));
  };

  const columnStyles = {
    "Doc Service English Name": { width: "30%", minWidth: "200px" },
    "Doc Service Marathi Name": { width: "30%", minWidth: "200px" },
    "Doc charges per Copy": { width: "20%", minWidth: "120px" },
    "Flag": { width: "20%", minWidth: "120px" }
  };

  const tableData = prepareTableData();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold boxHead text-center">
            Service Document Master
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="flex justify-center">
            <div className="flex items-center gap-4 w-full max-w-md">
              <Label htmlFor="serviceSelect" className="text-sm font-medium whitespace-nowrap min-w-[100px]">
                Service
              </Label>
              <Select
                value={selectedService}
                onValueChange={handleServiceChange}
                disabled={false}
              >
                <SelectTrigger id="serviceSelect" className="flex-1 h-9">
                  <SelectValue placeholder="-- Select Option --" />
                </SelectTrigger>
                <SelectContent>
                  {serviceList.map((service) => {
                    const serviceIdValue = service.NUM_SERVICE_SERVICEID || service.num_service_serviceid;
                    const serviceName = service.VAR_SERVICE_ENG_NAME || service.var_service_eng_name;
                    return (
                      <SelectItem 
                        key={serviceIdValue} 
                        value={serviceIdValue.toString()}
                      >
                        {serviceName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isEditMode && showTable && (
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={addNewRow}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 h-9"
              >
                Add New Row
              </Button>
            </div>
          )}

          {showTable && documents.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <ShadCNTable
                headers={gridHeaders}
                data={tableData}
                keyMapping={keyMapping}
                columnStyles={columnStyles}
                pagination={false}
                className="max-h-96"
                tableClassName="min-w-full"
              />
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4">
            {showTable && (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-700 hover:bg-blue-800 text-white min-w-[100px] h-9"
              >
                {isSubmitting ? "Saving..." : (isEditMode ? "Update" : "Submit")}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-gray-300 hover:bg-gray-50 min-w-[100px] h-9"
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FrmDocMst;