import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { DatePicker } from "@/components/ui/calendar";

const FrmChallanGenReport = () => {
  const { user, token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [prabhags, setPrabhags] = useState([]);

  const ulbId = user?.ulbId || 3;

  const initialValues = {
    challanDate: new Date(),
    fromDate: new Date(),
    toDate: new Date(),
    prabhagId: "",
    deptId: "",
  };

  const formatDateForAPI = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(d.getDate()).padStart(2, "0");
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmChallanGenReport/department-list`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.ok && response.data?.data?.rows) {
        setDepartments(response.data.data.rows);
      }
    } catch (error) {
      console.error("Department API Error:", error);
    }
  };

  const fetchPrabhags = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmChallanGenReport/prabhag-list`,
        { ulbId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.ok && response.data?.data?.rows) {
        setPrabhags(response.data.data.rows);
      }
    } catch (error) {
      console.error("Prabhag API Error:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchPrabhags();
  }, []);

  const handleSubmit = async (values, { setFieldValue }) => {
    try {
      setIsSearching(true);

      if (!values.fromDate || !values.toDate) {
        Swal.fire({
          text: "Please select From Date and To Date.",
        });
        setIsSearching(false);
        return;
      }

      const fromDateObj = new Date(values.fromDate);
      const toDateObj = new Date(values.toDate);
      const today = new Date();

      if (fromDateObj > toDateObj) {
        Swal.fire({
          text: "From Date cannot be greater than To Date.",
        });
        setIsSearching(false);
        return;
      }

      if (fromDateObj > today) {
        Swal.fire({
          text: "From Date cannot be greater than System Date.",
        });
        setIsSearching(false);
        return;
      }

      if (toDateObj > today) {
        Swal.fire({
          text: "To Date cannot be greater than System Date.",
        });
        setIsSearching(false);
        return;
      }

      if (!values.prabhagId || values.prabhagId === "0") {
        Swal.fire({
          text: "Please select Prabhag.",
        });
        setIsSearching(false);
        return;
      }

      if (!values.deptId || values.deptId === "0") {
        Swal.fire({
          text: "Please select Department.",
        });
        setIsSearching(false);
        return;
      }

      const loader = Swal.fire({
        title: "Generating PDF...",
        text: "Please wait while we generate your pdf.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });
      

      const selectedPrabhag = prabhags.find(p => String(p.WARDID) === String(values.prabhagId));
      const prabhagName = selectedPrabhag?.WARDNAME || "";

      const payload = {
        ulbId,
        challanDate: formatDateForAPI(values.challanDate),
        fromDate: formatDateForAPI(values.fromDate),
        toDate: formatDateForAPI(values.toDate),
        prabhagId: values.prabhagId,
        deptId: values.deptId,
        prabhagName: prabhagName,
      };

      console.log("PDF API Request:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/FrmChallanGenReport/generate-pdf`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      loader.close();

      console.log("PDF API Response:", response.data);

      if (response.data?.success && response.data?.pdfUrl) {
        window.open(response.data.pdfUrl, "_blank");

        Swal.fire({
          title: "Success",
          text: response.data.message || "PDF Generated Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          text: response.data?.message || "Unable to generate PDF.",
        });
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);

      Swal.fire({
        text: error.response?.data?.message || "Something went wrong while generating the PDF.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="border shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold">
                  Challan Generation Report
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 sm:p-6 space-y-6">
                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 py-3 px-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label>Challan Date</Label>
                      <span>:</span>
                    </div>
                    <DatePicker
                      value={values.challanDate}
                      onChange={(date) => setFieldValue("challanDate", date)}
                      className="w-full h-9"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label required text="From Date" />
                      <span>:</span>
                    </div>
                    <DatePicker
                      value={values.fromDate}
                      onChange={(date) => setFieldValue("fromDate", date)}
                      className="w-full h-9"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label required text="To Date" />
                      <span>:</span>
                    </div>
                    <DatePicker
                      value={values.toDate}
                      onChange={(date) => setFieldValue("toDate", date)}
                      className="w-full h-9"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label required text="Prabhag" />
                      <span>:</span>
                    </div>
                    <Select
                      value={values.prabhagId}
                      onValueChange={(value) => setFieldValue("prabhagId", value)}
                    >
                      <SelectTrigger className="w-full border rounded-md h-9">
                        <SelectValue placeholder="-- Select Prabhag --" />
                      </SelectTrigger>
                      <SelectContent>
                        {prabhags.map((prabhag) => (
                          <SelectItem
                            key={prabhag.WARDID}
                            value={String(prabhag.WARDID)}
                          >
                            {prabhag.WARDNAME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-32 shrink-0 flex justify-start sm:justify-between items-center">
                      <Label required text="Department" />
                      <span>:</span>
                    </div>
                    <Select
                      value={values.deptId}
                      onValueChange={(value) => setFieldValue("deptId", value)}
                    >
                      <SelectTrigger className="w-full border rounded-md h-9">
                        <SelectValue placeholder="-- Select Department --" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem
                            key={department.DEPTID}
                            value={String(department.DEPTID)}
                          >
                            {department.DEPTNAME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-3">
                  <Button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white"
                    disabled={isSearching}
                  >
                    {isSearching ? "Generating PDF..." : "Submit"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmChallanGenReport;