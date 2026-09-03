import { useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserIcon } from "@/components/icons/user";
import { LockIcon } from "@/components/icons/lock";
import { Eye, EyeOff, ArrowRight, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FrmEmpLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const showError = (message) => {
        Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: message,
            confirmButtonColor: "#184aa6",
        });
    };

    const handleLogin = async (values) => {
        const userId = values.userId.trim();
        const password = values.password.trim();

        if (!userId) {
            showError("Please enter User ID");
            return;
        }

        if (!password) {
            showError("Please enter Password");
            return;
        }

        try {
            Swal.fire({
                title: "Signing in...",
                text: "Please wait while we verify your credentials.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await axios.post(`${BASE_URL}/api/auth/employee-login`,{ userId, password });

            const result = response.data;
            const loginData = result?.data;

            if (!result?.ok) {
                throw new Error(result?.message || "Login failed");
            }
            if (!loginData?.success || Number(loginData?.errCode) !== 9999) {
                throw new Error(loginData?.message || "Invalid User ID or Password");
            }
            if (!loginData?.token || !loginData?.user) {
                throw new Error("Login token or user information was not returned");
            }

            Swal.close();

            login(loginData.user, loginData.token);

            // if (String(loginData.user?.otpValidate).toUpperCase() === "Y") {
            //     navigate("/FrmVerifyOTP");
            //     return;
            // }

            await Swal.fire({
                // icon: "success",
                // title: "Welcome Back!",
                text: `Hello ${loginData.user?.username || ""}`,
                timer: 1200,
                showConfirmButton: false,
                confirmButtonColor: "#184aa6",
            });

            navigate("/forgot-password");
        } catch (error) {
            Swal.close();

            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || "Unable to login. Please try again.";

            Swal.fire({
                // icon: "error",
                title: "Login Failed",
                text: errorMessage,
                confirmButtonColor: "#184aa6",
            });
        }
    };

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-blue-50 via-white to-sky-100 ">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="relative z-10 w-full max-w-lg"
            >
                <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
                        whileHover={{ scale: 1.08, rotate: 3 }}
                        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#184aa6] to-blue-500 shadow-lg shadow-blue-500/30"
                    >
                        <Building2 className="h-6 w-6 text-white" />
                    </motion.div>

                    <div className="mt-5 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#184aa6]">RTS Portal</p>
                        <h1 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">Employee Login</h1>
                        <p className="mt-2 text-sm text-slate-500">Sign in to access your workspace</p>
                    </div>

                    <Formik initialValues={{ userId: "", password: "" }} onSubmit={handleLogin}>
                        {({ values, handleChange }) => (
                            <Form className="mt-7 space-y-5">
                                <motion.div
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-1">
                                            <UserIcon size={19} className="shrink-0 text-[#184aa6]"/>
                                            <Label text="User ID" required />
                                        </div>

                                        <div className="relative">
                                            <Input
                                                id="userId"
                                                name="userId"
                                                type="text"
                                                value={values.userId}
                                                onChange={handleChange}
                                                placeholder="Enter your User ID"
                                                autoComplete="username"
                                                autoFocus
                                                className="h-11 rounded-xl border-gray-300 bg-white/80 text-slate-800 placeholder:text-slate-400 transition-all hover:border-blue-300 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-1">
                                            <LockIcon size={19} className="shrink-0 text-[#184aa6]" />
                                            <Label text="Password" required />
                                        </div>

                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                value={values.password}
                                                onChange={handleChange}
                                                placeholder="Enter your password"
                                                autoComplete="current-password"
                                                className="h-11 rounded-xl border-gray-300 bg-white/80 pr-12 text-slate-800 placeholder:text-slate-400 transition-all hover:border-blue-300 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword((prev) => !prev)
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-[#184aa6]"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? (<EyeOff size={19} />) : (<Eye size={19} />)}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        type="submit"
                                        className="group h-11 w-full rounded-xl bg-linear-to-r from-[#184aa6] to-blue-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-500 hover:shadow-blue-500/40"
                                    >
                                        Login
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Button>
                                </motion.div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </motion.div>

            <p className="absolute bottom-4 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} RTS Portal
            </p>
        </main>
    );
};

export default FrmEmpLogin;