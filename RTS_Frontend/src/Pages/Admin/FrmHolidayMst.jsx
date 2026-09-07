import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FrmHolidayMst = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [selectedDates, setSelectedDates] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const formatDateForAPI = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const handleDateChange = (date) => {
    if (!date) return;

    const isSelected = selectedDates.some(d => 
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );

    if (isSelected) {
      const newSelectedDates = selectedDates.filter(d => 
        !(d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear())
      );
      setSelectedDates(newSelectedDates);
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDates.length === 0) {
      Swal.fire({
        text: "Please select at least one holiday date",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    try {
      const holidayDays = selectedDates
        .sort((a, b) => a - b)
        .map(date => formatDateForAPI(date))
        .join(',');

      const payload = {
        Userid: user?.EmpUserName || user?.userId || 'testuser',
        Str: holidayDays,
        Ulbid: user?.EmpUlbId || user?.ulbId || 3
      };

      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/api/Holiday/Details`,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem("token")}`,
        },
      });

      const responseData = response.data?.data || response.data;
      const errCode = responseData?.ErrCode;
      const message = responseData?.message || "Holiday(s) saved successfully";

      if (errCode === 9999) {
        Swal.fire({
          text: message,
          confirmButtonColor: "#1e3a8a",
        }).then(() => {
          setSelectedDates([]);
        });
      } 
      else if (errCode === -120) {
        Swal.fire({
          text: message || "Date already exists as a holiday",
          confirmButtonColor: "#1e3a8a",
        });
      } 
      else if (errCode === -110) {
        Swal.fire({
          text: message || "Invalid input parameters",
          confirmButtonColor: "#1e3a8a",
        });
      } 
      else if (errCode !== undefined && errCode !== null && errCode !== 0) {
        Swal.fire({
          text: message || "An error occurred while saving holidays",
          confirmButtonColor: "#1e3a8a",
        });
      } 
      else {
        Swal.fire({
          text: message || "Holiday(s) saved successfully",
          confirmButtonColor: "#1e3a8a",
        }).then(() => {
          setSelectedDates([]);
        });
      }
    } catch (error) {
      console.error("Save Error:", error);
      Swal.fire({
        text: error.response?.data?.message || "Error saving data. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <Card className="border shadow-sm">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="text-xl font-semibold">
            Holiday Master
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="w-full max-w-[100%]">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid sm:grid-cols-3 grid-cols-1 items-start gap-30">
                  <Label className="whitespace-nowrap pt-20 pl-50">
                    Date:
                  </Label>
                  <div className="col-span-2">
                    <DatePicker
                      selected={null}
                      onChange={handleDateChange}
                      inline
                      highlightDates={selectedDates}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-center">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700 min-w-[100px]"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FrmHolidayMst;