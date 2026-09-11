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
import { Input } from "@/components/ui/input";

const initialValues = {};

const FrmBusinessTypeList = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const ulbId = user?.ulbId;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [isSearching, setIsSearching] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const headers = ["Business Type Name", "Select"];

  const keyMapping = {
    "Business Type Name": "businessTypeName",
    Select: "select",
  };


  const fetchBusinessTypes = async () => {
    try {
      setIsSearching(true);

      const payload = {
        ulbid : ulbId
      };

      const response = await axios.post(
        `${BASE_URL}/api/FrmBusinessTypeListMst/business-types`, payload, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Business Types Response:", response.data);

      if (response.data?.ok && response.data?.data?.success) {
        const businessTypes = response.data?.data?.businessTypes || [];

        const formattedData = businessTypes.map((row) => ({
          businessTypeId: row.id,
          businessTypeName: row.name || "",

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
            text: "No business types found.",
          });
        }
      } else {
        setTableData([]);

        Swal.fire({
          title: "Error",
          text:
            response.data?.message || "Failed to fetch business types.",
        });
      }
    } catch (error) {
      console.error("Business Types API Error:", error);

      setTableData([]);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to fetch business types.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddNew = () => {
    navigate("/App/FrmBusinessTypeMst", {
      state: {
        mode: 1,
      },
    });
  };

  const handleSelect = (row) => {
    console.log("Selected Business Type:", row);

    navigate("/App/FrmBusinessTypeMst", {
      state: {
        mode: 2,
        businessTypeId: row.id,
        businessTypeName: row.name,
      },
    });
  };

  useEffect(() => {
    fetchBusinessTypes();
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
                  Business Type List
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between gap-3 px-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9 w-full"
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
                    <div className="py-10 text-center">
                      Loading...
                    </div>
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

export default FrmBusinessTypeList;

