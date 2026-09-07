import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend as BarLegend,
  Tooltip as BarTooltip,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import Swal from "sweetalert2";

const FrmDashboardAll = () => {
  const { user, token } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const ulbId = user?.ulbId;

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState("list");

  const [currentView, setCurrentView] = useState("department");
  const [pageTitle, setPageTitle] = useState("Department");
  const [showWardData, setShowWardData] = useState(false);

  const [departmentData, setDepartmentData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [wardData, setWardData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [stepsData, setStepsData] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [breadcrumb, setBreadcrumb] = useState([]);

  const COLORS = [
    "#0090cb",
    "#34c759",
    "#ff3b30",
    "#FFD93D",
    "#93C572",
    "#FAD5A5",
    "#FFAA33",
  ];

  const formatDateForAPI = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const fromDt = formatDateForAPI(fromDate);
      const toDt = formatDateForAPI(toDate);

      const response = await axios.post(
        `${BASE_URL}/api/FrmDashboardAll/department-details`,
        { fromDate: fromDt, toDate: toDt, ulbId: ulbId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data?.data || [];
      setDepartmentData(data);
      setCurrentView("department");
      setPageTitle("Department");
      setShowWardData(false);
      setSelectedDepartment(null);
      setSelectedService(null);
      setSelectedWard(null);
      setBreadcrumb([]);
    } catch (err) {
      console.error("Department API Error:", err);
      Swal.fire("Error", "Failed to fetch department data", "error");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  const fetchWardData = async () => {
    try {
      setLoading(true);
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const fromDt = formatDateForAPI(fromDate);
      const toDt = formatDateForAPI(toDate);

      const response = await axios.post(
        `${BASE_URL}/api/FrmDashboardAll/ward-wise`,
        { fromDate: fromDt, toDate: toDt, ulbId: ulbId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data?.data || [];
      setWardData(data);
      setCurrentView("ward");
      setPageTitle("Prabhag");
      setShowWardData(true);
      setSelectedDepartment(null);
      setSelectedService(null);
      setSelectedWard(null);
      setBreadcrumb([]);
    } catch (err) {
      console.error("Ward API Error:", err);
      Swal.fire("Error", "Failed to fetch ward data", "error");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  const fetchDepartmentByWard = async (wardId, wardName) => {
    try {
      setLoading(true);
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const fromDt = formatDateForAPI(fromDate);
      const toDt = formatDateForAPI(toDate);

      const response = await axios.post(
        `${BASE_URL}/api/FrmDashboardAll/department-details`,
        {
          fromDate: fromDt,
          toDate: toDt,
          ulbId: ulbId,
          wardId: wardId,
          ward: wardName,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data?.data || [];
      setDepartmentData(data);
      setCurrentView("wardDepartment");
      // setPageTitle(`Prabhag : ${wardName}`);
      setSelectedWard({ wardId, wardName });
      setBreadcrumb([{ label: "Prabhag", onClick: () => handleWardBack() }]);
    } catch (err) {
      console.error("Department by Ward API Error:", err);
      Swal.fire("Error", "Failed to fetch department data", "error");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  const fetchServiceData = async (deptId, deptName) => {
    try {
      setLoading(true);
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const fromDt = formatDateForAPI(fromDate);
      const toDt = formatDateForAPI(toDate);

      const payload = {
        deptId: deptId,
        dept: deptName,
        fromDate: fromDt,
        toDate: toDt,
        ulbId: ulbId,
      };

      if (selectedWard) {
        payload.wardId = selectedWard.wardId;
        payload.ward = selectedWard.wardName;
      }

      const response = await axios.post(
        `${BASE_URL}/api/FrmDashboardAll/service-details`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data?.data || [];
      setServiceData(data);
      setCurrentView("service");
      // setPageTitle(`Department : ${deptName}`);
      setSelectedDepartment({ deptId, deptName });
      setBreadcrumb([
        ...(selectedWard
          ? [
              {
                label: `Prabhag : ${selectedWard.wardName}`,
                onClick: () => handleWardBack(),
              },
            ]
          : []),
        {
          label: `Department : ${deptName}`,
          onClick: () => handleDepartmentBack(),
        },
      ]);
    } catch (err) {
      console.error("Service API Error:", err);
      Swal.fire("Error", "Failed to fetch service data", "error");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  const fetchApplicationData = async (servId, servName) => {
    try {
      setLoading(true);
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const fromDt = formatDateForAPI(fromDate);
      const toDt = formatDateForAPI(toDate);

      const payload = {
        servId: servId,
        serv: servName,
        fromDate: fromDt,
        toDate: toDt,
        ulbId: ulbId,
        deptId: selectedDepartment?.deptId,
        dept: selectedDepartment?.deptName,
      };

      if (selectedWard) {
        payload.wardId = selectedWard.wardId;
        payload.ward = selectedWard.wardName;
      }

      const response = await axios.post(
        `${BASE_URL}/api/FrmDashboardAll/application-details`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data?.data || [];
      setApplicationData(data);
      setCurrentView("application");
      // setPageTitle(`Service : ${servName}`);
      setSelectedService({ servId, servName });
      setBreadcrumb([
        ...(selectedWard
          ? [
              {
                label: `Prabhag : ${selectedWard.wardName}`,
                onClick: () => handleWardBack(),
              },
            ]
          : []),
        {
          label: `Department : ${selectedDepartment?.deptName}`,
          onClick: () => handleDepartmentBack(),
        },
        { label: `Service : ${servName}`, onClick: () => handleServiceBack() },
      ]);
    } catch (err) {
      console.error("Application API Error:", err);
      Swal.fire("Error", "Failed to fetch application data", "error");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  const fetchStepsData = async (appNo) => {
    try {
      setLoading(true);
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await axios.post(
        `${BASE_URL}/api/FrmDashboardAll/steps`,
        { appNo: appNo, ulbId: ulbId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data?.data || [];
      setStepsData(data);
      setCurrentView("steps");
      setPageTitle(`Application : ${appNo}`);
      setSelectedApplication(appNo);
      setBreadcrumb([
        ...(selectedWard
          ? [
              {
                label: `Prabhag : ${selectedWard.wardName}`,
                onClick: () => handleWardBack(),
              },
            ]
          : []),
        {
          label: `Department : ${selectedDepartment?.deptName}`,
          onClick: () => handleDepartmentBack(),
        },
        {
          label: `Service : ${selectedService?.servName}`,
          onClick: () => handleServiceBack(),
        },
        {
          label: `Application : ${appNo}`,
          onClick: () => handleApplicationBack(),
        },
      ]);
    } catch (err) {
      console.error("Steps API Error:", err);
      Swal.fire("Error", "Failed to fetch steps data", "error");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  const handleBack = () => {
    if (currentView === "steps") {
      if (selectedService) {
        fetchApplicationData(selectedService.servId, selectedService.servName);
      }
    } else if (currentView === "application") {
      if (selectedDepartment) {
        fetchServiceData(selectedDepartment.deptId, selectedDepartment.deptName);
      }
    } else if (currentView === "service") {
      if (selectedWard) {
        fetchDepartmentByWard(selectedWard.wardId, selectedWard.wardName);
      } else {
        fetchDepartmentData();
      }
    } else if (currentView === "wardDepartment") {
      fetchWardData();
    }
  };

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      Swal.fire("Warning", "Please select both From and To dates", "warning");
      return;
    }
    if (showWardData) {
      fetchWardData();
    } else {
      fetchDepartmentData();
    }
  };

  const handleViewPrahbag = () => {
    fetchWardData();
  };

  const handleViewDepartment = () => {
    fetchDepartmentData();
  };

  const handleWardBack = () => {
    fetchWardData();
  };

  const handleDepartmentBack = () => {
    if (selectedWard) {
      fetchDepartmentByWard(selectedWard.wardId, selectedWard.wardName);
    } else {
      fetchDepartmentData();
    }
  };

  const handleServiceBack = () => {
    if (selectedDepartment) {
      fetchServiceData(selectedDepartment.deptId, selectedDepartment.deptName);
    }
  };

  const handleApplicationBack = () => {
    if (selectedService) {
      fetchApplicationData(selectedService.servId, selectedService.servName);
    }
  };

  const handleRowClick = (row, type) => {
    if (type === "ward" && row.WARDID) {
      fetchDepartmentByWard(row.WARDID, row.WARDNAME);
    } else if (type === "department" && row.DEPARTMENT) {
      fetchServiceData(row.DEPARTMENT, row.DEPARTMENTNAME);
    } else if (type === "service" && row.SERVICE) {
      fetchApplicationData(row.SERVICE, row.SERVENGNAME);
    } 
    // else if (type === "application" && row.APPLINO) {
    //   fetchStepsData(row.APPLINO);
    // }
  };

  useEffect(() => {
    const initialDate = new Date();
    setFromDate(initialDate);
    setToDate(initialDate);
    fetchDepartmentData();
  }, []);

    const renderDepartmentTable = () => {
      const data = departmentData;
      if (data.length === 0) {
        return (
          <div className="text-center py-8 text-gray-500">No records found</div>
        );
      }

      const totals = data.reduce((acc, item) => ({
        APPRECEIVED: (acc.APPRECEIVED || 0) + (Number(item.APPRECEIVED) || 0),
        APPAPPRV: (acc.APPAPPRV || 0) + (Number(item.APPAPPRV) || 0),
        APPREJECT: (acc.APPREJECT || 0) + (Number(item.APPREJECT) || 0),
        APPENDING: (acc.APPENDING || 0) + (Number(item.APPENDING) || 0),
        PAYDONE: (acc.PAYDONE || 0) + (Number(item.PAYDONE) || 0),
        PAYPENDING: (acc.PAYPENDING || 0) + (Number(item.PAYPENDING) || 0),
        CERTDONE: (acc.CERTDONE || 0) + (Number(item.CERTDONE) || 0),
      }), {});

      const totalPercentage = totals.APPRECEIVED > 0 
        ? ((totals.CERTDONE / totals.APPRECEIVED) * 100).toFixed(2) 
        : 0;

    return (
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-blue-900 hover:bg-blue-900">
              <TableHead
                rowSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[180px]"
              >
                Department Name
              </TableHead>
              <TableHead
                colSpan="4"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Application
              </TableHead>
              <TableHead
                colSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Payment
              </TableHead>
              <TableHead
                rowSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Certificate
              </TableHead>
              <TableHead
                rowSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Percentage
              </TableHead>
            </TableRow>
            <TableRow className="bg-blue-900 hover:bg-blue-900">
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Received
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Approved
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Rejected
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Pending
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Received
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Pending
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} cursor-pointer transition-colors hover:bg-blue-100`}
                onClick={() => handleRowClick(item, "department")}
              >
                <TableCell className="px-4 py-3 text-sm font-medium border border-gray-200 text-left">
                  <span className="text-blue-900 underline hover:text-blue-800 cursor-pointer">
                    {item.DEPARTMENTNAME}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPRECEIVED || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPAPPRV || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPREJECT || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPENDING || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.PAYDONE || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.PAYPENDING || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.CERTDONE || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center font-semibold text-blue-600">
                  {item.PERCENTAGE || 0}%
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-blue-900 hover:bg-blue-900 font-bold">
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                Total
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPRECEIVED}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPAPPRV}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPREJECT}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPENDING}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.PAYDONE}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.PAYPENDING}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.CERTDONE}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totalPercentage}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderWardTable = () => {
    const data = wardData;
    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">No records found</div>
      );
    }

    const totals = data.reduce((acc, item) => ({
      APPRECEIVED: (acc.APPRECEIVED || 0) + (Number(item.APPRECEIVED) || 0),
      APPAPPRV: (acc.APPAPPRV || 0) + (Number(item.APPAPPRV) || 0),
      APPREJECT: (acc.APPREJECT || 0) + (Number(item.APPREJECT) || 0),
      APPENDING: (acc.APPENDING || 0) + (Number(item.APPENDING) || 0),
      PAYDONE: (acc.PAYDONE || 0) + (Number(item.PAYDONE) || 0),
      PAYPENDING: (acc.PAYPENDING || 0) + (Number(item.PAYPENDING) || 0),
      CERTDONE: (acc.CERTDONE || 0) + (Number(item.CERTDONE) || 0),
    }), {});

    const totalPercentage = totals.APPRECEIVED > 0 
      ? ((totals.CERTDONE / totals.APPRECEIVED) * 100).toFixed(2) 
      : 0;

    return (
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-blue-900 hover:bg-blue-900">
              <TableHead
                rowSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[150px]"
              >
                Prabhag Name
              </TableHead>
              <TableHead
                colSpan="4"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Application
              </TableHead>
              <TableHead
                colSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Payment
              </TableHead>
              <TableHead
                rowSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Certificate
              </TableHead>
              <TableHead
                rowSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Percentage
              </TableHead>
            </TableRow>
            <TableRow className="bg-blue-900 hover:bg-blue-900">
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Received
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Approved
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Rejected
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Pending
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Received
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Pending
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} cursor-pointer transition-colors hover:bg-blue-100`}
                onClick={() => handleRowClick(item, "ward")}
              >
                <TableCell className="px-4 py-3 text-sm font-medium border border-gray-200 text-left">
                  <span className="text-blue-900 underline hover:text-blue-800 cursor-pointer">
                    {item.WARDNAME}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPRECEIVED || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPAPPRV || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPREJECT || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPENDING || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.PAYDONE || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.PAYPENDING || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.CERTDONE || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center font-semibold text-blue-600">
                  {item.PERCENTAGE || 0}%
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-blue-900 hover:bg-blue-900 font-bold">
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                Total
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPRECEIVED}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPAPPRV}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPREJECT}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPENDING}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.PAYDONE}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.PAYPENDING}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.CERTDONE}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totalPercentage}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderServiceTable = () => {
    const data = serviceData;
    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">No records found</div>
      );
    }

    const totals = data.reduce((acc, item) => ({
      APPRECEIVED: (acc.APPRECEIVED || 0) + (Number(item.APPRECEIVED) || 0),
      APPAPPRV: (acc.APPAPPRV || 0) + (Number(item.APPAPPRV) || 0),
      APPREJECT: (acc.APPREJECT || 0) + (Number(item.APPREJECT) || 0),
      APPENDING: (acc.APPENDING || 0) + (Number(item.APPENDING) || 0),
      PAYDONE: (acc.PAYDONE || 0) + (Number(item.PAYDONE) || 0),
      PAYPENDING: (acc.PAYPENDING || 0) + (Number(item.PAYPENDING) || 0),
      CERTDONE: (acc.CERTDONE || 0) + (Number(item.CERTDONE) || 0),
    }), {});

    const totalPercentage = totals.APPRECEIVED > 0 
      ? ((totals.CERTDONE / totals.APPRECEIVED) * 100).toFixed(2) 
      : 0;

    return (
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-blue-900 hover:bg-blue-900">
              <TableHead
                rowSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[180px]"
              >
                Service Name
              </TableHead>
              <TableHead
                colSpan="4"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Application
              </TableHead>
              <TableHead
                colSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Payment
              </TableHead>
              <TableHead
                rowSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Certificate
              </TableHead>
              <TableHead
                rowSpan="2"
                className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900"
              >
                Percentage
              </TableHead>
            </TableRow>
            <TableRow className="bg-blue-900 hover:bg-blue-900">
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Received
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Approved
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Rejected
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Pending
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Received
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-2 text-xs font-semibold hover:bg-blue-900 min-w-[70px]">
                Pending
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} cursor-pointer transition-colors hover:bg-blue-100`}
                onClick={() => handleRowClick(item, "service")}
              >
                <TableCell className="px-4 py-3 text-sm font-medium border border-gray-200 text-left">
                  <span className="text-blue-900 underline hover:text-blue-800 cursor-pointer">
                    {item.SERVENGNAME}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPRECEIVED || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPAPPRV || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPREJECT || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPENDING || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.PAYDONE || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.PAYPENDING || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.CERTDONE || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center font-semibold text-blue-600">
                  {item.PERCENTAGE || 0}%
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-blue-900 hover:bg-blue-900 font-bold">
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                Total
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPRECEIVED}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPAPPRV}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPREJECT}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.APPENDING}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.PAYDONE}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.PAYPENDING}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totals.CERTDONE}
              </TableCell>
              <TableCell className="text-white text-center border border-blue-900 px-4 py-3 text-sm">
                {totalPercentage}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderApplicationTable = () => {
    const data = applicationData;
    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">No records found</div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-blue-900 hover:bg-blue-900">
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[60px]">
                Sr No
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[150px]">
                Department
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[150px]">
                Service
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[150px]">
                Application No
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[150px]">
                Applicant Name
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[150px]">
                Email
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[100px]">
                Mobile No
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[120px]">
                Application Date
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[150px]">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} cursor-pointer transition-colors hover:bg-blue-100`}
                onClick={() => handleRowClick(item, "application")}
              >
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.DEPARTMENTNAME || "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.SERVENGNAME || "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                    <span
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   if (item.APPLINO) {
                      //     fetchStepsData(item.APPLINO);
                      //   }
                      // }}
                    >
                      {item.APPLINO || "-"}
                    </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPLINAME || "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPLIEMAIL || "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPLIMOBILE || "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.APPLIDATE || "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.STATUS || "Pending"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderStepsTable = () => {
    const data = stepsData;
    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">No records found</div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-blue-900 hover:bg-blue-900">
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[60px]">
                Sr No
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[150px]">
                Step
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[200px]">
                Description
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[180px]">
                Date Time
              </TableHead>
              <TableHead className="text-white text-center border border-white px-4 py-3 font-semibold hover:bg-blue-900 min-w-[100px]">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-left">
                  {item.STEP || "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-left">
                  {item.DESCRIPTION || "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  {item.DATETIME || "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm border border-gray-200 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.STATUS === "Done"
                        ? "bg-green-100 text-green-800"
                        : item.STATUS === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.STATUS || "Pending"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderGraphView = () => {
    let chartData = [];
    let title = "";

    if (currentView === "ward") {
      chartData = wardData.map((item) => ({
        name: item.WARDNAME,
        received: Number(item.APPRECEIVED) || 0,
        approved: Number(item.APPAPPRV) || 0,
        rejected: Number(item.APPREJECT) || 0,
        pending: Number(item.APPENDING) || 0,
        paymentReceived: Number(item.PAYDONE) || 0,
        paymentPending: Number(item.PAYPENDING) || 0,
        certificate: Number(item.CERTDONE) || 0,
      }));
      title = "Ward-wise Performance";
    } else if (currentView === "department" || currentView === "wardDepartment") {
      chartData = departmentData.map((item) => ({
        name: item.DEPARTMENTNAME,
        received: Number(item.APPRECEIVED) || 0,
        approved: Number(item.APPAPPRV) || 0,
        rejected: Number(item.APPREJECT) || 0,
        pending: Number(item.APPENDING) || 0,
        paymentReceived: Number(item.PAYDONE) || 0,
        paymentPending: Number(item.PAYPENDING) || 0,
        certificate: Number(item.CERTDONE) || 0,
      }));
      title = "Department-wise Performance";
    } else if (currentView === "service" || currentView === "application" || currentView === "steps") {
      chartData = serviceData.map((item) => ({
        name: item.SERVENGNAME,
        received: Number(item.APPRECEIVED) || 0,
        approved: Number(item.APPAPPRV) || 0,
        rejected: Number(item.APPREJECT) || 0,
        pending: Number(item.APPENDING) || 0,
        paymentReceived: Number(item.PAYDONE) || 0,
        paymentPending: Number(item.PAYPENDING) || 0,
        certificate: Number(item.CERTDONE) || 0,
      }));
      title = "Service-wise Performance";
    } 
    // else if (currentView === "application") {
    //   chartData = applicationData.map((item) => ({
    //     name: item.APPLINO || "N/A",
    //     status: item.STATUS || "Pending",
    //   }));
    //   title = "Application Status";
      
    //   return (
    //     <div className="border rounded-lg p-4 bg-white">
    //       <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
    //       {chartData.length === 0 ? (
    //         <div className="text-center py-8 text-gray-500">No data available for graph</div>
    //       ) : (
    //         <ResponsiveContainer width="100%" height={400}>
    //           <BarChart
    //             data={chartData}
    //             margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
    //           >
    //             <CartesianGrid strokeDasharray="3 3" />
    //             <XAxis
    //               dataKey="name"
    //               angle={-45}
    //               textAnchor="end"
    //               height={80}
    //               interval={0}
    //             />
    //             <YAxis />
    //             <BarTooltip />
    //             <BarLegend wrapperStyle={{ paddingTop: "10px" }} />
    //             <Bar dataKey="status" fill={COLORS[0]} name="Status" />
    //           </BarChart>
    //         </ResponsiveContainer>
    //       )}
    //     </div>
    //   );
    // } 
    // else if (currentView === "steps") {
    //   chartData = stepsData.map((item) => ({
    //     name: item.STEP || "N/A",
    //     status: item.STATUS || "Pending",
    //   }));
    //   title = "Application Steps";
      
    //   return (
    //     <div className="border rounded-lg p-4 bg-white">
    //       <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
    //       {chartData.length === 0 ? (
    //         <div className="text-center py-8 text-gray-500">No data available for graph</div>
    //       ) : (
    //         <ResponsiveContainer width="100%" height={400}>
    //           <BarChart
    //             data={chartData}
    //             margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
    //           >
    //             <CartesianGrid strokeDasharray="3 3" />
    //             <XAxis
    //               dataKey="name"
    //               angle={-45}
    //               textAnchor="end"
    //               height={80}
    //               interval={0}
    //             />
    //             <YAxis />
    //             <BarTooltip />
    //             <BarLegend wrapperStyle={{ paddingTop: "10px" }} />
    //             <Bar dataKey="status" fill={COLORS[0]} name="Status" />
    //           </BarChart>
    //         </ResponsiveContainer>
    //       )}
    //     </div>
    //   );
    // }

    if (chartData.length === 0) {
      return (
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
          <div className="text-center py-8 text-gray-500">
            No data available for graph
          </div>
        </div>
      );
    }

    return (
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              height={60}
              interval={0}
              tick={{ fontSize: 11, fontWeight: 500 }}
              tickMargin={10}
              tickFormatter={(value, index) => {
                if (index % 2 === 0) {
                  return value;
                }
                return '';
              }}
            />
            <YAxis />
            <BarTooltip />
            <BarLegend wrapperStyle={{ paddingTop: "10px" }} />
            <Bar dataKey="received" fill={COLORS[0]} name="Received" />
            <Bar dataKey="approved" fill={COLORS[1]} name="Approved" />
            <Bar dataKey="rejected" fill={COLORS[2]} name="Rejected" />
            <Bar dataKey="pending" fill={COLORS[3]} name="Pending" />
            <Bar
              dataKey="paymentReceived"
              fill={COLORS[4]}
              name="Payment Received"
            />
            <Bar
              dataKey="paymentPending"
              fill={COLORS[5]}
              name="Payment Pending"
            />
            <Bar dataKey="certificate" fill={COLORS[6]} name="Certificate" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderBreadcrumb = () => {
    if (breadcrumb.length === 0) return null;

    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        {breadcrumb.map((item, index) => (
          <span key={index}>
            {index > 0 && <span className="mx-1 text-gray-400">&gt;</span>}
            <span
              className="text-blue-900 underline hover:text-blue-800 cursor-pointer"
              onClick={item.onClick}
            >
              {item.label}
            </span>
          </span>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      );
    }

    if (viewType === "graph") {
      return renderGraphView();
    }

    switch (currentView) {
      case "ward":
        return renderWardTable();
      case "department":
      case "wardDepartment":
        return renderDepartmentTable();
      case "service":
        return renderServiceTable();
      case "application":
        return renderApplicationTable();
      case "steps":
        return renderStepsTable();
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            No data available
          </div>
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold boxHead">
            Administrator Panel
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="sm:w-24 shrink-0 flex justify-start sm:justify-between items-center">
                <Label required text="From Date" />
                <span>:</span>
              </div>
              <DatePicker
                value={fromDate}
                onChange={setFromDate}
                className="w-full h-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="sm:w-24 shrink-0 flex justify-start sm:justify-between items-center">
                <Label required text="To Date" />
                <span>:</span>
              </div>
              <DatePicker
                value={toDate}
                onChange={setToDate}
                className="w-full h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="bg-blue-900 hover:bg-blue-800 text-white"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">{pageTitle}</h2>
             {!showWardData && (currentView === "department" || currentView === "service" || currentView === "application" || currentView === "steps") && (
              <Button
                variant="outline"
                onClick={handleViewPrahbag}
                className="border-green-500 text-green-600 hover:bg-green-50 ml-auto"
              >
                View Prahbag Data
              </Button>
            )}
            
            {showWardData && (currentView === "ward" || currentView === "service" || currentView === "application" || currentView === "steps") && (
              <Button
                variant="outline"
                onClick={handleViewDepartment}
                className="border-green-500 text-green-600 hover:bg-green-50 ml-auto"
              >
                View Department Data
              </Button>
            )}
          </div>

          {renderBreadcrumb()}

          {(currentView === "service" || currentView === "application" || currentView === "steps" || currentView === "wardDepartment") && (
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                Back
              </Button>
              <h3 className="text-lg font-semibold">
                {currentView === "service" && selectedDepartment?.deptName}
                {currentView === "application" && selectedService?.servName}
                {currentView === "steps" && selectedApplication}
                {currentView === "wardDepartment" && selectedWard?.wardName}
              </h3>
            </div>
          )}

          <div className="border-b mb-4">
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 font-medium transition-colors relative ${
                  viewType === "list"
                    ? "text-blue-900 border-b-2 border-blue-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setViewType("list")}
              >
                List View
              </button>
              <button
                className={`px-4 py-2 font-medium transition-colors relative ${
                  viewType === "graph"
                    ? "text-blue-900 border-b-2 border-blue-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setViewType("graph")}
              >
                Graph View
              </button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            {renderContent()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FrmDashboardAll;