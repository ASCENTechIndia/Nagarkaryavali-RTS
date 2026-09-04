import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const FrmDocList = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const gridHeaders = [
    "Select",
    "Service English Name",
    "Service Marathi Name",
    "No of Documents"
  ];

  const keyMapping = {
    "Select": "action",
    "Service English Name": "serviceEngName",
    "Service Marathi Name": "serviceMarName",
    "No of Documents": "docCount"
  };

  useEffect(() => {
    document.title = "Service Document List";
    fetchServiceDocumentCount();
  }, []);

  const fetchServiceDocumentCount = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/Doclist/service-document-count`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        let dataArray = [];
        
        if (response.data.data && Array.isArray(response.data.data)) {
          dataArray = response.data.data;
        } else if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
          dataArray = response.data.data.data;
        } else if (Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (response.data.ok && response.data.data && Array.isArray(response.data.data)) {
          dataArray = response.data.data;
        } else {
          for (let key in response.data) {
            if (Array.isArray(response.data[key])) {
              dataArray = response.data[key];
              break;
            }
          }
        }

        if (dataArray && dataArray.length > 0) {
          const formattedData = dataArray.map((item) => {
            const serviceId = item.NUM_DOC_SERVICEID || item.num_doc_serviceid || item.SERVICEID || item.serviceId || "";
            const serviceEngName = item.VAR_SERVICE_ENG_NAME || item.var_service_eng_name || item.SERVICENAME || item.serviceName || "-";
            const serviceMarName = item.VAR_SERVICE_MAR_NAME || item.var_service_mar_name || item.SERVICEMARNAME || item.serviceMarName || "-";
            const docCount = item.NOOFDOC || item.noofdoc || item.DOCCOUNT || item.docCount || "0";

            return {
              serviceId: serviceId,
              serviceEngName: serviceEngName,
              serviceMarName: serviceMarName,
              docCount: docCount,
              action: "select",
              _original: item
            };
          });

          setTableData(formattedData);
        } else {
          console.log("No data found in response");
          setTableData([]);
          Swal.fire({
            text: "No records found",
            confirmButtonColor: "#1e3a8a",
          });
        }
      } else {
        console.log("Invalid response structure:", response.data);
        Swal.fire({
          text: "Invalid response from server",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      console.error("Error fetching service document count:", error);
      Swal.fire({
        text: error?.response?.data?.error || "Error fetching data. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (row) => {
    navigate("/app/FrmDocMst", {
      state: {
        mode: "2",
        serviceId: row.serviceId
      }
    });
  };

  const handleAddNew = () => {
    navigate("/app/FrmDocMst", {
      state: {
        mode: "1"
      }
    });
  };

  const prepareTableData = () => {
    if (!tableData || tableData.length === 0) {
      return [];
    }
    
    return tableData.map((row) => ({
      action: (
        <Button
          variant="link"
          size="sm"
          className="text-blue-700 hover:text-blue-900 px-0 font-medium"
          onClick={() => handleSelect(row)}
        >
          Select
        </Button>
      ),
      serviceEngName: row.serviceEngName || "-",
      serviceMarName: row.serviceMarName || "-",
      docCount: row.docCount || "0"
    }));
  };

  const columnStyles = {
    "Select": { width: "12%", minWidth: "100px" },
    "Service English Name": { width: "35%", minWidth: "200px" },
    "Service Marathi Name": { width: "35%", minWidth: "200px" },
    "No of Documents": { width: "18%", minWidth: "120px" }
  };

  const tableRows = prepareTableData();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold boxHead">
            Service Document List
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <Button
              onClick={handleAddNew}
              className="bg-blue-700 hover:bg-blue-800 text-white h-9"
            >
              Add New Record
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading...</p>
              </div>
            </div>
          ) : tableData && tableData.length > 0 ? (
            <div className="overflow-x-auto border rounded-lg">
              <ShadCNTable
                headers={gridHeaders}
                data={tableRows}
                keyMapping={keyMapping}
                columnStyles={columnStyles}
                pagination={true}
                rowsPerPage={10}
                className="max-h-96"
                tableClassName="min-w-full"
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No records found
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FrmDocList;