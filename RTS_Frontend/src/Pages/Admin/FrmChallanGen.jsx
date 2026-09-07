import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { DatePicker } from "@/components/ui/calendar";

const FrmChallanGen = () => {
    const { user, token } = useAuth();
    const [wards, setWards] = useState([]);
    const [departments, setDepartments] = useState([]);
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const formatDate = (date) => {
        if (!date) return "";

        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        const selectedDate = new Date(date);
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const month = months[selectedDate.getMonth()];
        const year = selectedDate.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const loadDropdowns = async () => {
        try {
            Swal.fire({
                title: "Loading...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const [wardResult, departmentResult] = await Promise.allSettled([
                axios.get(`${baseUrl}/api/FrmChallanGen/ward-dropdown`, {
                    headers: {
                        Authorization: `Bearer ${token || localStorage.getItem("token")}`,
                    },
                    params: {
                        ulbid: user?.ulbId,
                    },
                }),
                axios.get(`${baseUrl}/api/FrmChallanGen/department-dropdown`, {
                    headers: {
                        Authorization: `Bearer ${token || localStorage.getItem("token")}`,
                    },
                }),
            ]);

            if (wardResult.status === "fulfilled") {
                const response = wardResult.value.data;
                setWards(response?.data?.data || response?.data || []);
            } else {
                setWards([]);
            }

            if (departmentResult.status === "fulfilled") {
                const response = departmentResult.value.data;
                setDepartments(response?.data?.data || response?.data || []);
            } else {
                setDepartments([]);
            }

            Swal.close();

            if (wardResult.status === "rejected" && departmentResult.status === "rejected") {
                Swal.fire({
                    // icon: "error",
                    // title: "Error",
                    text: "Failed to load dropdown data",
                });
            }
        } catch (error) {
            Swal.close();

            Swal.fire({
                // icon: "error",
                // title: "Error",
                text: error?.response?.data?.message || error?.response?.data?.error || "Failed to load dropdown data",
            });
        }
    };

    useEffect(() => {
        if (user?.ulbId) {
            loadDropdowns();
        }
    }, [user?.ulbId]);

    const initialValues = {
        challanDate: new Date(),
        fromDate: new Date(),
        toDate: new Date(),
        wardId: "",
        deptId: "",
    };

    const handleSubmit = async (values, { resetForm }) => {
        if (!values.challanDate) {
            Swal.fire({
                // icon: "warning",
                // title: "Validation",
                text: "Please select Challan Date",
            });
            return;
        }
        if (!values.fromDate) {
            Swal.fire({
                // icon: "warning",
                // title: "Validation",
                text: "Please select From Date",
            });
            return;
        }
        if (!values.toDate) {
            Swal.fire({
                // icon: "warning",
                // title: "Validation",
                text: "Please select To Date",
            });
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const fromDate = new Date(values.fromDate);
        const toDate = new Date(values.toDate);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (fromDate > toDate) {
            Swal.fire({
                // icon: "warning",
                // title: "Validation",
                text: "To date Should be greater than from date",
            });
            return;
        }
        if (fromDate > today) {
            Swal.fire({
                // icon: "warning",
                // title: "Validation",
                text: "From Date Cannot be greater than System Date",
            });
            return;
        }
        if (toDate > today) {
            Swal.fire({
                // icon: "warning",
                // title: "Validation",
                text: "To Date Cannot be greater than System Date",
            });
            return;
        }
        if (!values.wardId) {
            Swal.fire({
                // icon: "warning",
                // title: "Validation",
                text: "Please select Prabhag",
            });
            return;
        }
        if (!values.deptId) {
            Swal.fire({
                // icon: "warning",
                text: "Validation",
                text: "Please select Department",
            });
            return;
        }
        try {
            Swal.fire({
                text: "Generating Challan...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const payload = {
                userName: user?.userId,
                challanDate: formatDate(values.challanDate),
                receiptFromDate: formatDate(values.fromDate),
                receiptToDate: formatDate(values.toDate),
                wardId: Number(values.wardId),
                payMode: 0,
                deptId: Number(values.deptId),
                ulbid: Number(user?.ulbId),
            };

            const response = await axios.post(`${baseUrl}/api/FrmChallanGen/generate-challan`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token || localStorage.getItem("token")}`,
                    },
                }
            );

            Swal.close();

            await Swal.fire({
                // icon: "success",
                // title: "Success",
                text: response?.data?.message || "Challan generated successfully",
            });

            resetForm({
                values: {
                    challanDate: new Date(),
                    fromDate: new Date(),
                    toDate: new Date(),
                    wardId: "",
                    deptId: "",
                },
            });
        } catch (error) {
            Swal.close();

            Swal.fire({
                // icon: "error",
                // title: "Error",
                text: error?.response?.data?.message || error?.response?.data?.error || "Failed to generate challan",
            });
        }
    };

    return (
        <Card className="w-full">
            <CardHeader><CardTitle>Challan Generation</CardTitle></CardHeader>

            <CardContent>
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }) => (
                        <Form className="space-y-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Label text="Challan Date" required className="min-w-fit" />
                                        <span>:</span>
                                    </div>
                                    <DatePicker
                                        value={values.challanDate}
                                        onChange={(date) => setFieldValue("challanDate", date)}
                                        className="w-full sm:flex-1 h-9 sm:h-10"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Label text="From Date" required className="min-w-fit" />
                                        <span>:</span>
                                    </div>
                                    <DatePicker
                                        value={values.fromDate}
                                        onChange={(date) => setFieldValue("fromDate", date)}
                                        className="w-full sm:flex-1 h-9 sm:h-10"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Label text="To Date" required className="min-w-fit" />
                                        <span>:</span>
                                    </div>
                                    <DatePicker
                                        value={values.toDate}
                                        onChange={(date) => setFieldValue("toDate", date)}
                                        className="w-full sm:flex-1 h-9 sm:h-10"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Label text="Prabhag" required className="min-w-fit" />
                                        <span>:</span>
                                    </div>
                                    <Select
                                        value={values.wardId}
                                        onValueChange={(value) => setFieldValue("wardId", value)}
                                    >
                                        <SelectTrigger className="w-full sm:flex-1 h-9 sm:h-10">
                                            <SelectValue placeholder="Select Prabhag" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {wards.map((item) => (
                                                <SelectItem
                                                    key={item.WARDID ?? item.wardid}
                                                    value={String(item.WARDID ?? item.wardid)}
                                                >
                                                    {item.WARDNAME ?? item.wardname}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Label text="Department" required className="min-w-fit" />
                                        <span>:</span>
                                    </div>
                                    <Select
                                        value={values.deptId}
                                        onValueChange={(value) => setFieldValue("deptId", value)}
                                    >
                                        <SelectTrigger className="w-full sm:flex-1 h-9 sm:h-10">
                                            <SelectValue placeholder="Select Department" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {departments.map((item) => (
                                                <SelectItem
                                                    key={item.DEPTID ?? item.deptid}
                                                    value={String(item.DEPTID ?? item.deptid)}
                                                >
                                                    {item.DEPTNAME ?? item.deptname}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-center pt-2">
                                <Button type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    );
};

export default FrmChallanGen;