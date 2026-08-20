import { useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserIcon } from "@/components/icons/user";
import { LockIcon } from "@/components/icons/lock";
import { RefreshCWIcon } from "@/components/icons/refresh-cw";
import { ShieldCheckIcon } from "@/components/icons/shield-check";
import { Mail } from "lucide-react";
import GetIPAddress from "@/utils/ipHelper";
import config from "@/utils/config";
import { DatePicker } from "@/components/ui/calendar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Registration = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const applicationState = location.state || {};
    const ulbId = applicationState.ulbId || 3;
    const serviceUrl = applicationState.serviceUrl || "";
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const redirectAfterRegistration = () => {
        if (serviceUrl) {
            navigate("/login", {
                state: { ...applicationState, serviceUrl }
            });
            return;
        }

        navigate("/login", { state: { ulbId } });
    };

    const formatOracleDate = (date) => {
        if (!(date instanceof Date) || isNaN(date)) return "";
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        return `${String(date.getDate()).padStart(2, "0")}-${months[date.getMonth()]}-${date.getFullYear()}`;
    };

    const handleSubmit = async (values) => {
        if (!values.name.trim()) {
            await Swal.fire({
                text: "Please enter name",
                confirmButtonText: "OK"
            });
            return;
        }
        if (!values.email.trim()) {
            await Swal.fire({
                text: "Please enter email",
                confirmButtonText: "OK"
            });
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
            await Swal.fire({
                text: "Please enter valid email",
                confirmButtonText: "OK"
            });
            return;
        }
        if (!/^\d{10}$/.test(values.mobile)) {
            await Swal.fire({
                text: "Please enter valid 10 digit mobile number",
                confirmButtonText: "OK"
            });
            return;
        }
        if (!values.dob) {
            await Swal.fire({
                text: "Please select date of birth",
                confirmButtonText: "OK"
            });
            return;
        }
        if (!values.password) {
            await Swal.fire({
                text: "Please enter password",
                confirmButtonText: "OK"
            });
            return;
        }
        if (!values.confirmPassword) {
            await Swal.fire({
                text: "Please enter confirm password",
                confirmButtonText: "OK"
            });
            return;
        }
        if (values.password !== values.confirmPassword) {
            await Swal.fire({
                text: "Password and confirm password do not match",
                confirmButtonText: "OK"
            });
            return;
        }

        setLoading(true);

        Swal.fire({
            title: "Registering...",
            text: "Please wait",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {

            const ipAddress = await GetIPAddress();

            const payload = {
                userId: sessionStorage.getItem("userId") || "SMCTT",
                orgId: Number(ulbId),
                name: values.name.trim(),
                email: values.email.trim(),
                mobile: Number(values.mobile),
                dob: formatOracleDate(values.dob),
                password: values.password,
                confirmPassword: values.confirmPassword,
                ipAddress: ipAddress,
                source: config.source,
                propNo: ""
            };

            const response = await axios.post(`${BASE_URL}/api/auth/register`,payload);

            const result = response.data;
            const data = result?.data;

            if (!result?.ok || Number(data?.errorCode) !== 9999) {
                throw new Error(data?.errorMsg || result?.message || "Registration failed");
            }

            await Swal.fire({
                // icon: "success",
                // title: "Registration Successful",
                text: data?.errorMsg || "User Registered Successfully",
                confirmButtonText: "OK"
            });

            redirectAfterRegistration();
        } catch (error) {
            await Swal.fire({
                icon: "error",
                // title: "Registration Failed",
                text: error?.response?.data?.error || error?.response?.data?.message || error?.message || "Unable to register user",
                confirmButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center px-4 py-6 sm:py-3">
            <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative flex w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-300 bg-white shadow-[0px_10px_30px_10px_rgba(0,0,0,0.15)]"
            >
                <div className="relative hidden shrink-0 overflow-hidden bg-[#bad2fa] lg:block lg:w-[40%]">
                    <div className="absolute -right-110 top-1/2 h-160 w-160 -translate-y-1/2 rounded-full bg-white" />
                    <div className="absolute left-32 top-1/2 z-20 flex h-32.5 w-32.5 -translate-y-1/2 items-center justify-center rounded-full border-10 border-white bg-[#184aa6]">
                        <img src="/login-label.png" alt="Registration" className="h-16 w-16 object-contain shadow" />
                    </div>
                </div>

                <div className="z-10 w-full p-5 lg:w-[60%] lg:px-1.5 lg:py-5">
                    <div className="mb-5 text-center">
                        <h1 className="text-2xl font-bold text-[#184aa6]">TMC Online Service</h1>
                        <p className="mt-1 text-sm text-gray-500">New User Registration</p>
                    </div>

                    <Formik initialValues={{ name: "", email: "", mobile: "", dob: null, password: "", confirmPassword: "" }} onSubmit={handleSubmit}>
                        {({ values, handleChange, setFieldValue }) => (
                            <Form className="space-y-4">
                                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                                    <div className="flex items-center gap-2">
                                        <UserIcon size={19} className="shrink-0 text-[#184aa6]" />
                                        <Label text="Name:" required className="w-full" />
                                        <Input
                                            id="name"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            placeholder="Enter name"
                                            autoComplete="name"
                                            className="h-11 rounded-xl border-gray-300 bg-gray-50 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                                    <div className="flex items-center gap-2">
                                        <Mail size={19} className="shrink-0 text-[#184aa6]" />
                                        <Label text="Email:" required className="w-full" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            placeholder="Enter email"
                                            autoComplete="email"
                                            className="h-11 rounded-xl border-gray-300 bg-gray-50 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheckIcon size={19} className="shrink-0 text-[#184aa6]" />
                                        <Label text="Mobile No:" required className="w-full" />
                                        <Input
                                            id="mobile"
                                            name="mobile"
                                            type="tel"
                                            inputMode="numeric"
                                            maxLength={10}
                                            value={values.mobile}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
                                                setFieldValue("mobile", value);
                                            }}
                                            placeholder="Enter mobile number"
                                            autoComplete="tel"
                                            className="h-11 rounded-xl border-gray-300 bg-gray-50 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                                    <div className="flex items-center gap-2">
                                        <Label text="Date of Birth:" required className="w-full" />
                                        <DatePicker
                                            value={values.dob}
                                            onChange={(date) => setFieldValue("dob", date)}
                                            className="h-11 rounded-xl border-gray-300 bg-gray-50 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div className="flex items-center gap-2 w-full" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-2">
                                        <LockIcon size={19} className="shrink-0 text-[#184aa6]" />
                                        <Label text="Password:" required className="w-full" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={values.password}
                                            onChange={handleChange}
                                            placeholder="Enter password"
                                            autoComplete="new-password"
                                            className=" border-gray-300 bg-gray-50 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                        />
                                    </div>

                                    <label className=" flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={showPassword}
                                            onChange={(e) => setShowPassword(e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        Show
                                    </label>
                                </motion.div>

                                <motion.div className="flex gap-2 items-center" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                                >
                                    <div className="flex items-center gap-2">
                                        <LockIcon size={19} className="shrink-0 text-[#184aa6]" />
                                        <Label text="Confirm Password:" required className="w-full" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm password"
                                            autoComplete="new-password"
                                            className=" border-gray-300 bg-gray-50 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                        />
                                    </div>

                                    <label className="flex cursor-pointer justify-center items-center gap-2 text-sm text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={showConfirmPassword}
                                            onChange={(e) => setShowConfirmPassword(e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        Show
                                    </label>
                                </motion.div>

                                <div className="flex justify-center gap-2 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="h-11 rounded-xl bg-[#184aa6] px-7 text-sm font-semibold text-white shadow-md hover:bg-blue-900"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2"><RefreshCWIcon size={16} />Registering...</span>
                                        ) : (
                                            "Register"
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() =>
                                            navigate("/login", {
                                                state: { ...applicationState, serviceUrl }
                                            })
                                        }
                                        className="h-11 rounded-xl px-7 text-sm font-semibold"
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </motion.div>
        </main>
    );
};

export default Registration;