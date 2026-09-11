import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const initialValues = {};

const FrmNOCHordingSubTypeList = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [isSearching, setIsSearching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const headers = ["Hoarding Sub Type Name", "Select"];

  const keyMapping = {
    "Hoarding Sub Type Name": "hordSubTypeName",
    Select: "select",
  };

  const fetchSubTypes = async () => {
    try {
      setIsSearching(true);

      const ulbId = user?.ulbId;

      const response = await axios.post(
        `${BASE_URL}/api/FrmNOCHordingSubType/list`,
        { ulbId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Hoarding Sub Types Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        const list = response.data?.data?.rows || [];

        let hordMap = {};
        try {
          const hordResp = await axios.post(
            `${BASE_URL}/api/FrmNOCHordingType/list`,
            { ulbId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (hordResp.data?.ok && hordResp.data?.data?.success) {
            const hordList = hordResp.data?.data?.rows || [];
            hordList.forEach((h) => {
              hordMap[h.HORDINGTYPEID] = h.HORDINGTYPENAME || "";
            });
          }
        } catch (e) {
          console.error("Hoarding Type Map Fetch Error:", e);
        }

        const formattedData = list.map((row) => ({
          hordSubTypeId: row.HORDSUBTYPEID,
          hordId: row.HORDID,
          hordSubTypeName: row.HORDSUBTYPENAME || "",
        //   hordTypeName: hordMap[row.HORDID] || "",
          select: (
            <Button
              variant="link"
              className="text-blue-700 hover:text-blue-900 px-0"
              onClick={() =>
                handleSelect(
                  row.HORDSUBTYPEID,
                  row.HORDSUBTYPENAME,
                  row.HORDID
                )
              }
            >
              Select
            </Button>
          ),
        }));

        setTableData(formattedData);

        if (formattedData.length === 0) {
          Swal.fire({
            text: "No hoarding sub types found.",
          });
        }
      } else {
        setTableData([]);

        Swal.fire({
          text:
            response.data?.message ||
            "Failed to fetch hoarding sub types.",
        });
      }
    } catch (error) {
      console.error("Hoarding Sub Types API Error:", error);

      setTableData([]);

      Swal.fire({
        text:
          error.response?.data?.message ||
          "Failed to fetch hoarding sub types.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddNew = () => {
    navigate("/App/FrmNOCHordingSubTypeMst", {
      state: { mode: 1 },
    });
  };

  const handleSelect = (hordSubTypeId, hordSubTypeName, hordId) => {
    navigate("/App/FrmNOCHordingSubTypeMst", {
      state: {
        mode: 2,
        hordSubTypeId,
        hordSubTypeName,
        hordId,
      },
    });
  };

  useEffect(() => {
    fetchSubTypes();
  }, []);

  const filteredTableData = tableData.filter((row) =>
    Object.entries(row).some(([key, value]) => {
      if (key === "select") return false;

      return String(value ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    })
  );

  const handleSubmit = async () => {
    console.log("submit");
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {() => (
        <Form>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="border shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold">
                  NOC Hoarding Sub Type List
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

export default FrmNOCHordingSubTypeList;