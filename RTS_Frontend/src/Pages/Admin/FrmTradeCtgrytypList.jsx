import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const initialValues = {};

const FrmTradeCtgrytypList = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [isSearching, setIsSearching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const ulbId = user?.ulbId;

  const headers = [
    "Business Category Type",
    "Business Category",
    "Status",
    "Select",
  ];

  const keyMapping = {
    "Business Category Type": "businessCatType",
    "Business Category": "businessCat",
    Status: "status",
    Select: "select",
  };

  const fetchTradeTypes = async () => {
    try {
      setIsSearching(true);

      const payload = {
        ulbid: Number(ulbId),
      };

      const response = await axios.post(
        `${BASE_URL}/api/FrmTradeCtgrytypListMst/trade-types`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Trade Types Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        const tradeTypes = response.data?.data?.tradeTypes || [];

        const formattedData = tradeTypes.map((row) => ({
          tradeTypeId: row.tradeTypeId,
          businessCatType: row.tradeTypeName || "",
          businessCat: row.tradeCategoryName || "",
          status: row.status || "",

          // Select button
          select: (
            <Button
              type="button"
              size="sm"
              className="h-8 text-white"
              onClick={() => handleSelect(row)}
            >
              Select
            </Button>
          ),
        }));

        setTableData(formattedData);

        if (formattedData.length === 0) {
          Swal.fire({
            title: "No Data Found",
            text: "No trade category types found.",
          });
        }
      } else {
        setTableData([]);

        Swal.fire({
          title: "Error",
          text:
            response.data?.message || "Failed to fetch trade category types.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Trade Types API Error:", error);

      setTableData([]);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to fetch trade category types.",
        icon: "error",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddNew = () => {
    navigate("/App/FrmTradeCtgryTypMst", {
      state: {
        mode: 1,
      },
    });
  };

  const handleSelect = (row) => {
    console.log("Selected Trade Type:", row);

    navigate("/App/FrmTradeCtgryTypMst", {
      state: {
        mode: 2,
        tradeTypeId: row.tradeTypeId,
        tradeTypeName: row.businessCatType,
        tradeCategoryId: row.tradeCategoryId,
        tradeCategoryName: row.businessCat,
        status: row.status,
        ulbId: row.ulbId,
      },
    });
  };

  useEffect(() => {
    fetchTradeTypes();
  }, []);

  const filteredTableData = tableData.filter((row) =>
    Object.entries(row).some(([key, value]) => {
      if (key === "select") return false;

      return String(value ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }),
  );

  const handleSubmit = async () => {
    console.log("submit");
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {() => (
        <Form>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >
            <Card className="border shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold">
                  Trade Category Type List
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between gap-3 px-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-10 w-full sm:w-[300px] rounded-md border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-[#184aa6]"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddNew}
                    className="h-10 text-white"
                  >
                    Add New
                  </Button>
                </div>

                <div className="overflow-x-auto px-3">
                  {isSearching ? (
                    <div className="py-10 text-center">Loading...</div>
                  ) : (
                    <ShadCNTable
                      headers={headers}
                      data={filteredTableData}
                      keyMapping={keyMapping}
                      pagination={false}
                      className="max-md:min-w-380"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmTradeCtgrytypList;
