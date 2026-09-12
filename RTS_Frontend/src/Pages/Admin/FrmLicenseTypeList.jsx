import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const FrmLicenseTypeList = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [viewStateData, setViewStateData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const ulbId =
    user?.ulbId ||
    user?.ulbid ||
    user?.ULBID ||
    user?.ulb_id ||
    1;

  const gridHeaders = ["License type name", "Select"];

  const keyMapping = {
    "License type name": "licenseTypeName",
    Select: "action",
  };

  useEffect(() => {
    bindLicenseTypeList();
  }, []);

  const bindLicenseTypeList = async () => {
    try {
      setLoading(true);

      const apiUrl = `${BASE_URL}/api/FrmLicenseType/list?ulbId=${ulbId}`;

      const response = await axios({
        method: "get",
        url: apiUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
        timeout: 30000,
      });

      if (response.data) {
        let dataArray = [];

        if (response.data.data && Array.isArray(response.data.data)) {
          dataArray = response.data.data;
        } else if (
          response.data.data &&
          response.data.data.data &&
          Array.isArray(response.data.data.data)
        ) {
          dataArray = response.data.data.data;
        } else if (Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (response.data.ok && Array.isArray(response.data.data)) {
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
            const licenseId =
              item.LICENSEID ||
              item.licenseId ||
              item.licensetypeid ||
              item.LICENSETYPEID ||
              "";

            const licenseTypeName =
              item.LICENSETYPENAME ||
              item.licensetypename ||
              item.licenseTypeName ||
              "-";

            return {
              licenseId,
              licenseTypeName,
              action: "select",
              _original: item,
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
      });

      let errorMessage = "Error fetching data. Please try again.";
      if (error.response?.status === 401) {
        errorMessage = "Unauthorized. Please login again.";
      } else if (error.response?.status === 404) {
        errorMessage = "API endpoint not found.";
      } else if (error.code === "ECONNABORTED") {
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

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setTableData(viewStateData);
    } else {
      const lower = value.toLowerCase();
      const filtered = viewStateData.filter((item) =>
        String(item.licenseTypeName || "")
          .toLowerCase()
          .includes(lower)
      );
      setTableData(filtered);
    }
  };

  const handleSelect = (row) => {
    navigate("/app/FrmLicenseTypeMst", {
      state: {
        mode: "2",
        licenseId: row.licenseId,
        licenseTypeName: row.licenseTypeName,
        ulbId: ulbId,
      },
    });
  };

  const handleAddNew = () => {
    navigate("/app/FrmLicenseTypeMst", {
      state: {
        mode: "1",
        ulbId: ulbId,
      },
    });
  };

  const prepareTableData = () => {
    if (!tableData || tableData.length === 0) return [];

    return tableData.map((row) => ({
      licenseTypeName: row.licenseTypeName || "-",
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
    }));
  };

  const columnStyles = {
    "License Type Name": { width: "70%", minWidth: "200px" },
    Select: { width: "30%", minWidth: "90px" },
  };

  const tableRows = prepareTableData();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold boxHead">
            License Type List
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
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
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No records found</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FrmLicenseTypeList;