import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FrmAppeal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const appNo = location.state?.appNo ?? location.state?.appealAppNo ?? "MRGMR3105220001" ;
    const appealBy = location.state?.userId ?? user?.userId ?? "2275cc01-5724-419a-afb9-72c8d03c1c0a";
    const userUniqueId = location.state?.userUniqueId ?? user?.userUniqueId ?? "1001";

    const [application, setApplication] = useState(null);

    const initialValues = {
        citizenRemark: "",
        appealType: "",
    };

    useEffect(() => {
        if (!token || !appNo) return;

        const loadApplicationDetails = async () => {
            Swal.fire({
                text: "Loading application details...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            try {
                const response = await axios.get(`${baseUrl}/api/FrmAppeal/application-details`,
                    {
                        params: {appNo},
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );

                const result = response?.data?.data;
                const applicationData = result?.data?.[0];

                if (!result?.success || !applicationData) {
                    Swal.close();
                    await Swal.fire({
                        // icon: "error",
                        text: result?.message || "Application details not found.",
                    });
                    return;
                }

                setApplication(applicationData);
            } catch (error) {
                console.error("Application Details Error:", error);

                Swal.fire({
                    // icon: "error",
                    text: error?.response?.data?.message || error?.response?.data?.error || "Unable to load application details.",
                });
            } finally {
                Swal.close();
            }
        };

        loadApplicationDetails();
    }, [appNo, baseUrl, token]);

    const handleSubmit = async (values, { resetForm }) => {
        if (!appNo) {
            Swal.fire({
                text: "Application No. can not be blank.",
            });
            return;
        }
        if (!values.citizenRemark.trim()) {
            Swal.fire({
                text: "Remark can not be blank.",
            });
            return;
        }
        if (values.citizenRemark.trim().length > 500) {
            Swal.fire({
                text: "Remark length can not be more than 500.",
            });
            return;
        }
        if (!values.appealType || values.appealType === "0") {
            Swal.fire({
                text: "Select valid Appeal Type from the list.",
            });
            return;
        }
        if (!appealBy) {
            Swal.fire({
                text: "User ID not found.",
            });
            return;
        }
        if (!userUniqueId) {
            Swal.fire({
                text: "User Unique ID not found.",
            });
            return;
        }

        try {
            Swal.fire({
                title: "Submitting...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            const response = await axios.post(`${baseUrl}/api/FrmAppeal/raise-appeal`,
                {
                    appId: appNo,
                    citizenRemark: values.citizenRemark.trim(),
                    appealType: Number(values.appealType),
                    appealBy: String(appealBy),
                    userUniqueId: Number(userUniqueId),
                    mode: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = response?.data?.data;
            Swal.close();
            if (!result?.success || Number(result?.errorCode) !== 9999) {
                await Swal.fire({
                    // icon: "error",
                    text: result?.message || "Unable to raise appeal.",
                });
                return;
            }

            resetForm();
            const successResult = await Swal.fire({
                // icon: "success",
                // title: "Success",
                text: result?.message || "Appeal has been raised successfully.",
                confirmButtonText: "OK",
            });

            if (successResult.isConfirmed) {
                navigate("/");
            }
        } catch (error) {
            Swal.close();
            console.error("Raise Appeal Error:", error);
            Swal.fire({
                icon: "error",
                text: error?.response?.data?.message || error?.response?.data?.error || "Unable to raise appeal.",
            });
        }
    };

    if (!appNo) {
        return (
            <Card className="w-full">
                <CardContent className="p-5">
                    <div className="py-8 text-center text-sm text-red-600">
                        Application No. not found.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, setFieldValue, resetForm }) => (
                <Form className="w-full">
                    <Card className="w-full">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg font-semibold text-[#083c76]">Appeal / अपील</CardTitle>
                        </CardHeader>

                        <CardContent className="p-5">
                                <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                        <div className="flex shrink-0 items-center sm:w-52 sm:justify-between">
                                            <Label text="Application No. / अर्ज क्रमांक" />
                                            <span>:</span>
                                        </div>
                                        <Input value={appNo} disabled className="bg-gray-50"/>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                        <div className="flex shrink-0 items-center sm:w-52 sm:justify-between">
                                            <Label text="Amount / रक्कम" />
                                            <span>:</span>
                                        </div>
                                        <Input value={application?.AMOUNT ?? "-"} disabled className="bg-gray-50"/>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                        <div className="flex shrink-0 items-center sm:w-52 sm:justify-between">
                                            <Label text="Receipt No. / पावती क्रमांक" />
                                            <span>:</span>
                                        </div>
                                        <Input value={application?.RECIEPTNO ?? "-"} disabled className="bg-gray-50"/>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                        <div className="flex shrink-0 items-center sm:w-52 sm:justify-between">
                                            <Label text="Certificate Copies / एकूण प्रती" />
                                            <span>:</span>
                                        </div>
                                        <Input value={application?.NOOFCOPY ?? "-"} disabled className="bg-gray-50"/>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 md:col-span-2">
                                        <div className="flex shrink-0 items-center sm:w-52 sm:justify-between">
                                            <Label text="Status / सद्यस्थिती" />
                                            <span>:</span>
                                        </div>
                                        <Input value={application?.STATUS ?? "-"} disabled className="bg-gray-50"/>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                                        <div className="flex shrink-0 items-center sm:w-52 sm:justify-between">
                                            <Label text="Remark / शेरा" required />
                                            <span>:</span>
                                        </div>

                                        <div className="w-full">
                                            <Textarea
                                                value={values.citizenRemark}
                                                maxLength={500}
                                                onChange={(e) =>
                                                    setFieldValue("citizenRemark", e.target.value)
                                                }
                                                className="min-h-24 w-full"
                                                placeholder="Enter remark"
                                            />
                                            <div className="mt-1 text-right text-xs text-gray-500">
                                                {values.citizenRemark.length}/500
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                        <div className="flex shrink-0 items-center sm:w-52 sm:justify-between">
                                            <Label text="Appeal Type / अपील प्रकार" required />
                                            <span>:</span>
                                        </div>

                                        <div className="w-full">
                                            <Select
                                                value={values.appealType}
                                                onValueChange={(value) =>
                                                    setFieldValue("appealType", value)
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="-- Select --" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="1">Delay</SelectItem>
                                                    <SelectItem value="2">Wrong</SelectItem>
                                                    <SelectItem value="3">Deny</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-3 pt-7">
                                    <Button type="submit">Submit</Button>
                                    <Button type="button" variant="outline" onClick={() => resetForm()}>Reset</Button>
                                </div>
                        </CardContent>
                    </Card>
                </Form>
            )}
        </Formik>
    );
};

export default FrmAppeal;