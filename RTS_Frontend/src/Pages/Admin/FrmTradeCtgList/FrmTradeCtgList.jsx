import { useEffect, useState } from "react";

import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import { useNavigate } from "react-router";

import { useAuth } from "@/context/AuthContext";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import ShadCNTable from "@/components/ui/table";

const baseUrl = import.meta.env.VITE_BASE_URL;

const FrmTradeCtgList = () => {
  const { user, token } = useAuth();

  const ulbid = user?.ulbId || user?.ulbid;

  const navigate = useNavigate();

  const [tradeCategories, setTradeCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTradeCategories = async () => {
    try {
      if (!ulbid || !token) return;

      setLoading(true);

      Swal.fire({
        text: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${baseUrl}/api/Tradetypeconfig/tradecategorylist`,
        {
          ulbId: Number(ulbid),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = response?.data?.data?.data || [];

      setTradeCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Trade Category List Error:", error);

      setTradeCategories([]);

      Swal.fire({
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to fetch Trade Category List",
        confirmButtonColor: "#083c76",
      });
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    if (!ulbid || !token) return;

    fetchTradeCategories();
  }, [ulbid, token]);

  const handleAddNew = () => {
    navigate("/Masters/FrmTradeCtgMst", {
      state: {
        mode: 1,
        inApp: true,
      },
    });
  };

  const handleSelect = (item) => {
    navigate("/Masters/FrmTradeCtgMst", {
      state: {
        mode: 2,
        categoryId: item.CATEGORYID,
        inApp: true,
      },
    });
  };

  const filteredData = tradeCategories.filter((item) => {
    const search = searchText.toLowerCase();

    return (
      String(item.BUISNESSNM || "")
        .toLowerCase()
        .includes(search) ||
      String(item.STATUS || "")
        .toLowerCase()
        .includes(search)
    );
  });

  const tableData = filteredData.map((item) => ({
    ...item,

    businessName: item.BUISNESSNM || "-",

    status: item.STATUS || "-",

    select: (
      <Button
        type="button"
        variant="link"
        className="h-auto p-0 font-semibold text-[#083c76] hover:text-[#2f6fb2]"
        onClick={() => handleSelect(item)}
      >
        Select
      </Button>
    ),
  }));

  const headers = ["Business Name", "Status", "Select"];

  const keyMapping = {
    "Business Name": "businessName",
    Status: "status",
    Select: "select",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">
            Trade Category List
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 p-4 sm:p-6">
          {/* ADD NEW */}

          <div>
            <Button type="button" onClick={handleAddNew}>
              Add New
            </Button>
          </div>

          {/* SEARCH */}

          <div className="w-full md:w-[500px]">
            <Input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full"
            />
          </div>

          {/* TABLE */}

          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : (
            <ShadCNTable
              headers={headers}
              data={tableData}
              keyMapping={keyMapping}
              pagination={false}
              className="min-w-[700px]"
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FrmTradeCtgList;
