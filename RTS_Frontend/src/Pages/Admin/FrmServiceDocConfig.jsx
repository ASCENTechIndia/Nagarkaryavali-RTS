import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import config from "@/utils/config";

const FrmServiceDocConfig = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [documents, setDocuments] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const ULB_ID = user?.ulbId || localStorage.getItem("ulbId");

  const gridHeaders = ["Select", "Document Name"];

  const keyMapping = {
    "Select": "checked",
    "Document Name": "docName"
  };

  const columnStyles = {
    "Select": { width: "10%", minWidth: "60px" },
    "Document Name": { width: "90%", minWidth: "200px" }
  };

  useEffect(() => {
    document.title = "Service Document Configuration";
    fetchActiveServices();
  }, []);

  const fetchActiveServices = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/Doclist/active-services`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      let dataArray = [];
      
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        dataArray = response.data.data.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        dataArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        dataArray = response.data;
      }

      if (dataArray && dataArray.length > 0) {
        setServiceList(dataArray);
      } else {
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

  const fetchDocumentsByService = async (serviceId) => {
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

      let docArray = [];
      
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        docArray = response.data.data.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        docArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        docArray = response.data;
      }

      if (docArray && docArray.length > 0) {
        const formattedData = docArray.map((item) => {
          const docId = (item.NUM_DOC_ID || item.num_doc_id || "").toString();
          const docName = item.VAR_DOC_ENGNAME || item.var_doc_engname || "";
          const marathiName = item.VAR_DOC_MARNAME || item.var_doc_marname || "";
          
          return {
            docId: docId,
            docName: docName,
            marathiName: marathiName,
            charges: item.VAR_DOC_CHARGEPERCOPY || item.var_doc_chargepercopy || "",
            active: item.VAR_DOC_ACTIVE || item.var_doc_active || "Y",
            checked: false
          };
        });
        setDocuments(formattedData);
        setShowTable(true);
        return formattedData;
      } else {
        setDocuments([]);
        setShowTable(true);
        return [];
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      Swal.fire({
        text: error?.response?.data?.error || "Error fetching documents. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
      setShowTable(false);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceDocumentConfig = async (serviceId, documentsData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Doclist/service-document-config`,
        { 
          ulbId: ULB_ID,
          serviceId: serviceId 
        },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      let configArray = [];
      
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        configArray = response.data.data.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        configArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        configArray = response.data;
      }

      const configuredIds = new Set();
      configArray.forEach(item => {
        const docId = item.NUM_SERDOC_DOCID || item.num_serdoc_docid;
        if (docId) configuredIds.add(docId.toString());
      });

      if (documentsData && documentsData.length > 0) {
        const updatedDocs = documentsData.map(doc => ({
          ...doc,
          checked: configuredIds.has(doc.docId.toString())
        }));
        setDocuments(updatedDocs);
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);
    }
  };

  const handleServiceChange = async (value) => {
    setSelectedService(value);
    
    if (value && value !== "") {
      const docData = await fetchDocumentsByService(value);
      
      if (docData && docData.length > 0) {
        await fetchServiceDocumentConfig(value, docData);
      }
    } else {
      setShowTable(false);
      setDocuments([]);
    }
  };

  const handleRowCheckChange = (row, checked) => {
    const updatedDocs = documents.map(doc => {
      if (doc.docId === row.docId) {
        return { ...doc, checked: checked };
      }
      return doc;
    });
    setDocuments(updatedDocs);
  };

  const handleSelectAllChange = (checked) => {
    const updatedDocs = documents.map(doc => ({
      ...doc,
      checked: checked
    }));
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

    if (documents.length === 0) {
      Swal.fire({
        text: "No documents available for this service",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    const anyChecked = documents.some(doc => doc.checked);
    if (!anyChecked) {
      Swal.fire({
        text: "Select at least one document!",
        confirmButtonColor: "#1e3a8a",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    
    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedDocIds = documents
        .filter(doc => doc.checked)
        .map(doc => doc.docId)
        .join("#");

      const submitData = {
        userId: user?.userId || "SYSTEM",
        ulbId: ULB_ID,
        serviceId: selectedService,
        servDocConfigCgStr: selectedDocIds,
        ipAddress: "",
        source: config.source
      };

      const response = await axios.post(
        `${BASE_URL}/api/Doclist/save-service-document-config`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      let responseData = response.data;
      
      if (responseData?.data) {
        responseData = responseData.data;
      }

      if (responseData) {
        const errorCode = responseData.errorCode;
        const errorMsg = responseData.errorMsg || responseData.message;

        const isSuccess = errorCode !== 9999 || responseData.status === 'SUCCESS';

        if (isSuccess) {
          console.log("=== SUCCESS CASE: Showing success and reloading ===");
          Swal.fire({
            text: errorMsg || "Configuration saved successfully!",
            confirmButtonColor: "#1e3a8a",
          }).then((result) => {
            console.log("Swal result:", result);
            if (result.isConfirmed) {
              console.log("=== RELOADING PAGE ===");
              window.location.reload();
            }
          });
        } else {
          console.log("=== ERROR CASE: Showing error ===");
          Swal.fire({
            text: errorMsg || "Error saving configuration",
            confirmButtonColor: "#1e3a8a",
          });
        }
      } else {
        console.log("=== NO RESPONSE DATA ===");
        Swal.fire({
          text: "Error saving configuration. Please try again.",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      console.error("=== ERROR IN SUBMIT ===", error);
      Swal.fire({
        text: error?.response?.data?.error || "Error saving configuration. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setIsSubmitting(false);
      console.log("=== SUBMIT COMPLETED ===");
    }
  };

  const handleCancel = () => {
    navigate("/app/home");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold boxHead">
            Service Document Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="flex justify-center">
            <div className="flex items-center gap-4 w-full max-w-md">
              <Label htmlFor="serviceSelect" className="text-sm font-medium whitespace-nowrap min-w-[100px]">
                Service :
              </Label>
              <Select
                value={selectedService}
                onValueChange={handleServiceChange}
                disabled={loading}
              >
                <SelectTrigger id="serviceSelect" className="flex-1 h-9">
                  <SelectValue placeholder="-- Select Service --" />
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

          {showTable && documents.length > 0 && !loading && (
            <div className="border rounded-lg overflow-hidden">
              <ShadCNTable
                headers={gridHeaders}
                data={documents}
                keyMapping={keyMapping}
                columnStyles={columnStyles}
                pagination={false}
                onSelectAllChange={handleSelectAllChange}
                onRowCheckChange={handleRowCheckChange}
                className="max-h-96"
                tableClassName="min-w-full"
              />
            </div>
          )}

          {showTable && documents.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <p>No documents found for this service.</p>
            </div>
          )}

          {showTable && (
            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || loading}
                className="bg-blue-700 hover:bg-blue-800 text-white min-w-[100px] h-9"
              >
                {isSubmitting ? "Saving..." : "Submit"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300 hover:bg-gray-50 min-w-[100px] h-9"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FrmServiceDocConfig;