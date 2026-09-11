import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import ShadCNTable from "@/components/ui/table";

const TABLE_HEADERS = ["Road Type Name", "Action"];
const KEY_MAPPING = {
  "Road Type Name": "roadTypeName",
  "Action":         "action",
};

const FrmNocRoadType = () => {
  const navigate  = useNavigate();
  const { token } = useAuth();

  const [loading,      setLoading]      = useState(false);
  const [tableData,    setTableData]    = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText,   setSearchText]   = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    document.title = "NOC Road Type List";
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/FrmNocRoadType/list`,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      const raw = response.data?.data?.rows || [];
      const arr = Array.isArray(raw) ? raw : [];

      setTableData(arr);
      setFilteredData(arr);

      if (arr.length === 0) {
        Swal.fire({ text: "Record Not Found", confirmButtonColor: "#1e3a8a" });
      }
    } catch (error) {
      console.error("Error fetching road type list:", error);
      Swal.fire({
        text:
          error?.response?.data?.error ||
          "Error fetching data. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (!value.trim()) {
      setFilteredData(tableData);
      return;
    }
    const words = value.toLowerCase().split(" ");
    const result = tableData.filter((row) => {
      const rowStr = Object.values(row).join(" ").toLowerCase();
      return words.every((w) => rowStr.includes(w));
    });
    setFilteredData(result);
  };

  const handleSelect = (row) => {
    navigate("/app/FrmNocRoadTypeMst", {
      state: { selectedData: row, mode: "2" },
    });
  };

  const handleAddNew = () => {
    navigate("/app/FrmNocRoadTypeMst", {
      state: { mode: "1" },
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold boxHead">
            NOC Road Type List Master
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="w-full sm:max-w-sm">
              <Input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-9 w-full"
              />
            </div>

            <Button
              onClick={handleAddNew}
              disabled={loading}
            >
              Add New
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto" />
                <p className="mt-2 text-sm text-gray-500">Loading...</p>
              </div>
            </div>
          ) : (
            <ShadCNTable
              headers={TABLE_HEADERS}
              keyMapping={KEY_MAPPING}
              data={filteredData.map((row) => ({
                ...row,
                roadTypeName: row.roadTypeName || row.ROADTYPENAME || "",
                action: (
                  <button
                    onClick={() => handleSelect(row)}
                    className="text-blue-700 hover:text-blue-900 font-medium hover:underline transition-colors"
                  >
                    Select
                  </button>
                ),
              }))}
              pagination={true}
              rowsPerPage={10}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FrmNocRoadType;
