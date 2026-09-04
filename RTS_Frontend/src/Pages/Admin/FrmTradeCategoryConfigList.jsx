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

const TABLE_HEADERS = ["Business Name", "Type", "ज्वलनशील पदार्थाचा", "Status", "Action"];
const KEY_MAPPING = {
  "Business Name": "BUSINESSNAME",
  "Type": "TYPE",
  "ज्वलनशील पदार्थाचा": "INFLAMMABLE",
  "Status": "STATUS",
  "Action": "action"
};

const FrmTradeCategoryConfigList = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading]         = useState(false);
  const [tableData, setTableData]     = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText]   = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    document.title = "Trade Category Configuration List";
    fetchList();
  }, []);

  // ── API: Fetch list ────────────────────────────────────────────────────────
  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/FrmTradeCategoryConfig/list`,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.ok && response.data?.data) {
        const data =
          response.data.data?.data || response.data.data || [];
        const arr = Array.isArray(data) ? data : [];
        setTableData(arr);
        setFilteredData(arr);
        if (arr.length === 0) {
          Swal.fire({ text: "Record Not Found", confirmButtonColor: "#1e3a8a" });
        }
      }
    } catch (error) {
      console.error("Error fetching trade category list:", error);
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

  // ── Search filter ──────────────────────────────────────────────────────────
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

  // ── Row select → navigate to detail/edit page ──────────────────────────────
  const handleSelect = (row) => {
    navigate("/app/FrmTradeCategoryConfigMst", {
      state: { selectedData: row, mode: "2" },
    });
  };

  // ── Add New ────────────────────────────────────────────────────────────────
  const handleAddNew = () => {
    navigate("/app/FrmTradeCategoryConfigMst", {
      state: { mode: "1" },
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border shadow-sm">
        {/* ── Page Header ── */}
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold boxHead">
            Trade Category Configuration List
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* ── Search + Add New ── */}
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
              type="button"
              variant="outline"
              size="sm"
              className="w-fit border-[#1a3a6b] text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white font-medium"
              onClick={handleAddNew}
              disabled={loading}
            >
              Add New
            </Button>
          </div>

          {/* ── Table ── */}
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
                BUSINESSNAME: row.BUSINESSNAME || row.businessName,
                TYPE: row.TYPE || row.type,
                INFLAMMABLE: row.INFLAMMABLE || row.inflammable,
                STATUS: row.STATUS || row.status,
                action: (
                  <button
                    onClick={() => handleSelect(row)}
                    className="text-blue-700 hover:text-blue-900 font-medium hover:underline transition-colors"
                  >
                    Select
                  </button>
                )
              }))}
              pagination={true}
              rowsPerPage={10}
              className="rounded border border-[#c8a96e]"
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FrmTradeCategoryConfigList;
