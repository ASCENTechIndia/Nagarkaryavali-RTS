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
import { Input } from "@/components/ui/input";
import ShadCNTable from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const initialValues = {};

const FrmNOCHordingTypeList = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [isSearching, setIsSearching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const headers = ["Hoarding Type Name", "Select"];

  const keyMapping = {
    "Hoarding Type Name": "hordingTypeName",
    Select: "select",
  };

  const fetchHordingTypes = async () => {
    try {
      setIsSearching(true);

      const ulbId = user?.ulbId;

      const response = await axios.post(
        `${BASE_URL}/api/FrmNOCHordingType/list`,
        { ulbId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Hoarding Types Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        const list = response.data?.data?.rows || [];

        const formattedData = list.map((row) => ({
          hordingTypeId: row.HORDINGTYPEID,
          hordingTypeName: row.HORDINGTYPENAME || "",
          select: (
            <Button
              variant="link"
              className="text-blue-700 hover:text-blue-900 px-0"
              onClick={() =>
                handleSelect(row.HORDINGTYPEID, row.HORDINGTYPENAME)
              }
            >
              Select
            </Button>
          ),
        }));

        setTableData(formattedData);

        if (formattedData.length === 0) {
          Swal.fire({
            text: "No hoarding types found."
          });
        }
      } else {
        setTableData([]);

        Swal.fire({
          text: response.data?.message || "Failed to fetch hoarding types.",
        });
      }
    } catch (error) {
      console.error("Hoarding Types API Error:", error);

      setTableData([]);

      Swal.fire({
        text:
          error.response?.data?.message ||
          "Failed to fetch hoarding types."
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddNew = () => {
    navigate("/App/FrmNOCHordingTypeMst", {
      state: { mode: 1 },
    });
  };

  const handleSelect = (hordingTypeId, hordingTypeName) => {
    navigate("/App/FrmNOCHordingTypeMst", {
      state: {
        mode: 2,
        hordingTypeId,
        hordingTypeName,
      },
    });
  };

  useEffect(() => {
    fetchHordingTypes();
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
                  NOC Hoarding Type List
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between gap-3 px-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                      name="search"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-9"
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

export default FrmNOCHordingTypeList;