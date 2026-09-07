import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const FrmTradeCtgryTypeCnfgList = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [viewStateData, setViewStateData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const gridHeaders = [
    "Business Category",
    "Business Type",
    "Type",
    "ज्वलनशील पदार्थांचा",
    "Status",
    "Select"
  ];

  const keyMapping = {
    "Business Category": "businessName",
    "Business Type": "tradeTypeName",
    "Type": "type",
    "ज्वलनशील पदार्थांचा": "jwalanshilStat",
    "Status": "status",
    "Select": "action"
  };

  useEffect(() => {
    document.title = "Trade Type Configuration List";
    bindTradeCategoryConfigList();
  }, []);

  const bindTradeCategoryConfigList = async () => {
    try {
      setLoading(true);
      
      const apiUrl = `${BASE_URL}/api/Tradetypeconfig/list`;
      
      const response = await axios({
        method: 'post',
        url: apiUrl,
        data: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem("token")}`,
        },
        timeout: 30000,
      });

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
            const categoryId = item.CATEGORYID || item.categoryId || "";
            const businessName = item.BUISNESSNM || item.buisnessnm || item.businessName || "-";
            const categoryTypeId = item.CATGTYPID || item.catgtypid || item.categoryTypeId || "";
            const tradeTypeName = item.TRADETYPENAME || item.tradetypename || item.tradeTypeName || "-";
            const type = item.TYPE || item.type || "-";
            const status = item.STATUS || item.status || "-";
            const jwalanshilStat = item.JWALANSHILSTAT || item.jwalanshilstat || item.jwalanshilStat || "-";

            return {
              categoryId: categoryId,
              businessName: businessName,
              categoryTypeId: categoryTypeId,
              tradeTypeName: tradeTypeName,
              type: type,
              status: status,
              jwalanshilStat: jwalanshilStat,
              action: "select",
              _original: item
            };
          });

          setTableData(formattedData);
          setViewStateData(formattedData);
        } else {
          setTableData([]);
          setViewStateData([]);
          Swal.fire({
            text: "Record Not Found",
            confirmButtonColor: "#1e3a8a",
          });
        }
      } else {
        Swal.fire({
          text: "Invalid response from server",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      console.error("API Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      let errorMessage = "Error fetching data. Please try again.";
      if (error.response?.status === 401) {
        errorMessage = "Unauthorized. Please login again.";
      } else if (error.response?.status === 404) {
        errorMessage = "API endpoint not found. Please check the URL.";
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please try again.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Swal.fire({
        text: errorMessage,
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (row) => {
    navigate("/app/FrmTradeCtgryTypeCnfgMst", {
      state: {
        mode: "2",
        categoryId: row.categoryId,
        categoryTypeId: row.categoryTypeId
      }
    });
  };

  const handleAddNew = () => {
    navigate("/app/FrmTradeCtgryTypeCnfgMst", {
      state: {
        mode: "1"
      }
    });
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue.trim() === "") {
      setTableData(viewStateData);
    } else {
      const filteredData = viewStateData.filter((item) => {
        return (
          item.businessName.toLowerCase().includes(searchValue) ||
          item.tradeTypeName.toLowerCase().includes(searchValue) ||
          item.type.toLowerCase().includes(searchValue) ||
          item.status.toLowerCase().includes(searchValue) ||
          item.jwalanshilStat.toLowerCase().includes(searchValue)
        );
      });
      setTableData(filteredData);
    }
  };

  const prepareTableData = () => {
    if (!tableData || tableData.length === 0) {
      return [];
    }
    
    return tableData.map((row) => ({
      businessName: row.businessName || "-",
      tradeTypeName: row.tradeTypeName || "-",
      type: row.type || "-",
      status: row.status || "-",
      jwalanshilStat: row.jwalanshilStat || "-",
      action: (
        <Button
          variant="link"
          size="sm"
          className="text-blue-700 hover:text-blue-900 px-0 font-medium"
          onClick={() => handleSelect(row)}
        >
          Select
        </Button>
      )
    }));
  };

  const columnStyles = {
    "Business Name": { width: "20%", minWidth: "150px" },
    "Trade Type Name": { width: "20%", minWidth: "150px" },
    "Type": { width: "12%", minWidth: "100px" },
    "Status": { width: "12%", minWidth: "100px" },
    "Jwalanshil Stat": { width: "16%", minWidth: "120px" },
    "Select": { width: "10%", minWidth: "90px" }
  };

  const tableRows = prepareTableData();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold boxHead">
            Trade Type Configuration List
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-blue-700 hover:bg-blue-800 text-white h-9 whitespace-nowrap"
            >
              Add New
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
                onPageChange={(newPageIndex) => {
                  if (viewStateData && viewStateData.length > 0) {
                    setTableData(viewStateData);
                  }
                }}
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

export default FrmTradeCtgryTypeCnfgList; 