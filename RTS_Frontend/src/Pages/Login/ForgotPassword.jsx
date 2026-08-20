import { useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { PhoneIcon } from "@/components/icons/phone";
import { RefreshCWIcon } from "@/components/icons/refresh-cw";
import { ShieldCheckIcon } from "@/components/icons/shield-check";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ForgotPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const applicationState = location.state || {};
    const ulbId = applicationState.ulbId || null;
    const userId = applicationState.userId || "SMCTT";
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [mobile, setMobile] = useState("");
    const [forgotDetails, setForgotDetails] = useState(null);
    const [error, setError] = useState("");

    const sendOtp = async (mobileNumber) => {
        const response = await axios.post(
            `${BASE_URL}/api/auth/send-login-otp`,
            {
                userId,
                ulbId: Number(ulbId),
                mobileNumber,
                mode: 1
            }
        );

        const result = response.data;
        const data = result?.data;

        if (!result?.ok || Number(data?.errorCode) !== 9999) {
            throw new Error(
                data?.errorMsg ||
                result?.message ||
                "Unable to send OTP"
            );
        }

        return data;
    };

    const fetchForgotDetails = async (mobileNumber) => {
        const response = await axios.post(
            `${BASE_URL}/api/auth/forgot-password-details`,
            {
                mobile: mobileNumber
            }
        );

        if (!response.data?.ok) {
            throw new Error(
                response.data?.message ||
                "Unable to fetch user details"
            );
        }

        const data = response.data?.data;

        if (!data?.email) {
            throw new Error("Registered email not found");
        }

        if (!data?.password) {
            throw new Error("Stored password not found");
        }

        return data;
    };

    const changePassword = async (values) => {
        if (!forgotDetails?.email) {
            throw new Error("Registered email not found");
        }

        if (!forgotDetails?.password) {
            throw new Error("Stored password not found");
        }

        const response = await axios.post(
            `${BASE_URL}/api/auth/change-password`,
            {
                corpId: applicationState.corpId || 10001,
                oldPassword: forgotDetails.password,
                newPassword: values.password,
                userId: forgotDetails.email,
                mode: 2
            }
        );

        if (!response.data?.ok) {
            throw new Error(
                response.data?.message ||
                "Password change failed"
            );
        }

        return response.data;
    };

    const handleGetOtp = async (values) => {
        setError("");

        const mobileNumber = values.mobile.trim();

        if (!mobileNumber) {
            setError("Please enter mobile number");
            return;
        }

        if (!/^\d{10}$/.test(mobileNumber)) {
            setError("Please enter a valid 10 digit mobile number");
            return;
        }

        if (!ulbId) {
            setError("ULB information not found");
            return;
        }

        setLoading(true);

        Swal.fire({
            text: "Sending OTP...",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await sendOtp(mobileNumber);

            setMobile(mobileNumber);
            setOtpSent(true);
            setOtp("");

            await Swal.fire({
                text: "OTP has been sent to your registered mobile number.",
                confirmButtonText: "OK"
            });
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Unable to send OTP";

            setError(message);

            await Swal.fire({
                icon: "error",
                text: message,
                confirmButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setError("");

        if (otp.length !== 4) {
            const message = "Please enter complete OTP";
            setError(message);

            await Swal.fire({
                text: message,
                confirmButtonText: "OK"
            });

            return;
        }

        setLoading(true);

        Swal.fire({
            text: "Verifying OTP...",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const details = await fetchForgotDetails(mobile);

            setForgotDetails(details);

            await Swal.fire({
                text: "OTP verified successfully.",
                confirmButtonText: "OK"
            });

            setOtpSent(false);
            setOtp("");
            setError("");
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "OTP verification failed";

            setError(message);

            await Swal.fire({
                icon: "error",
                text: message,
                confirmButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangeMobile = () => {
        setOtpSent(false);
        setOtp("");
        setMobile("");
        setForgotDetails(null);
        setError("");
    };

    const handleSubmitPassword = async (values) => {
        setError("");

        if (!values.password) {
            setError("Please enter password");
            return;
        }

        if (!values.confirmPassword) {
            setError("Please enter confirm password");
            return;
        }

        if (values.password !== values.confirmPassword) {
            setError("Confirm password doesn't match");
            return;
        }

        setLoading(true);

        Swal.fire({
            text: "Updating password...",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await changePassword(values);

            await Swal.fire({
                icon: "success",
                text: "Password changed successfully.",
                confirmButtonText: "OK"
            });

            navigate("/login", {
                state: {
                    ...applicationState,
                    mobile,
                    forgotPassword: true
                }
            });
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Password change failed";

            setError(message);

            await Swal.fire({
                icon: "error",
                text: message,
                confirmButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center px-4 py-6 sm:py-8">
            <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative flex w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-300 bg-white shadow-[0px_10px_30px_10px_rgba(0,0,0,0.15)]"
            >
                <div className="relative hidden shrink-0 overflow-hidden bg-[#bad2fa] lg:block lg:w-[40%]">
                    <div className="absolute -right-110 top-1/2 h-160 w-160 -translate-y-1/2 rounded-full bg-white" />
                    <div className="absolute left-32 top-1/2 z-20 flex h-32.5 w-32.5 -translate-y-1/2 items-center justify-center rounded-full border-10 border-white bg-[#184aa6]">
                        <img
                            src="/login-label.png"
                            alt="Forgot Password"
                            className="h-16 w-16 object-contain shadow"
                        />
                    </div>
                </div>

                <div className="z-10 w-full p-5 sm:p-8 lg:w-1/2">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-[#184aa6]">
                            Forgot Password
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            {!otpSent && !forgotDetails && "Enter your registered mobile number"}
                            {otpSent && "Enter the OTP sent to your mobile"}
                            {forgotDetails && "Create your new password"}
                        </p>
                    </div>

                    {!forgotDetails ? (
                        <Formik
                            initialValues={{ mobile: "" }}
                            onSubmit={handleGetOtp}
                        >
                            {({ values, handleChange }) => (
                                <Form className="space-y-5" autoComplete="off">
                                    <motion.div
                                        initial={{ opacity: 0, x: 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <Label text="Mobile Number" required />

                                        <div className="flex items-center gap-2">
                                            <PhoneIcon
                                                size={19}
                                                className="shrink-0 text-[#184aa6]"
                                            />

                                            <Input
                                                id="mobile"
                                                name="mobile"
                                                type="tel"
                                                inputMode="numeric"
                                                maxLength={10}
                                                value={values.mobile}
                                                disabled={otpSent}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            ""
                                                        );

                                                    handleChange({
                                                        target: {
                                                            name: "mobile",
                                                            value
                                                        }
                                                    });

                                                    setMobile(value);
                                                }}
                                                placeholder="Enter mobile number"
                                                autoComplete="off"
                                                onCopy={(e) =>
                                                    e.preventDefault()
                                                }
                                                onPaste={(e) =>
                                                    e.preventDefault()
                                                }
                                                className="h-11 rounded-xl border-gray-300 bg-gray-50 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                            />
                                        </div>
                                    </motion.div>

                                    {!otpSent && (
                                        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-[#184aa6]">
                                            <ShieldCheckIcon size={17} />
                                            <span>
                                                OTP will be sent to your
                                                registered mobile number.
                                            </span>
                                        </div>
                                    )}

                                    {!otpSent && (
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="h-11 w-full rounded-xl bg-[#184aa6] text-sm font-semibold text-white shadow-md hover:bg-blue-900"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <RefreshCWIcon size={16} />
                                                    Sending OTP...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <PhoneIcon size={17} />
                                                    Get OTP
                                                </span>
                                            )}
                                        </Button>
                                    )}

                                    {otpSent && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: 15
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4"
                                        >
                                            <div className="text-center">
                                                <Label
                                                    text="Enter OTP"
                                                    required
                                                    className="justify-center"
                                                />

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Enter the 4 digit OTP sent
                                                    to your mobile number.
                                                </p>
                                            </div>

                                            <div className="flex justify-center">
                                                <InputOTP
                                                    maxLength={4}
                                                    value={otp}
                                                    onChange={setOtp}
                                                    autoComplete="one-time-code"
                                                    disabled={loading}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                    </InputOTPGroup>

                                                    <InputOTPSeparator />

                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>

                                            <Button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={
                                                    otp.length !== 4 ||
                                                    loading
                                                }
                                                className="h-10 w-full rounded-xl bg-[#184aa6] text-sm font-semibold text-white hover:bg-blue-900"
                                            >
                                                {loading
                                                    ? "Verifying..."
                                                    : "Verify OTP"}
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleChangeMobile}
                                                disabled={loading}
                                                className="h-9 w-full rounded-lg border-[#184aa6] text-[#184aa6] hover:bg-[#184aa6] hover:text-white"
                                            >
                                                Change Mobile Number
                                            </Button>
                                        </motion.div>
                                    )}

                                    {error && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -5
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}
                                            className="text-center text-sm font-medium text-red-600"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="flex justify-center">
                                        <Button
                                            type="button"
                                            variant="link"
                                            onClick={() =>
                                                navigate("/login", {
                                                    state: applicationState
                                                })
                                            }
                                            className="h-auto p-0 text-sm font-medium text-[#184aa6]"
                                        >
                                            Login with Username & Password
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <Formik
                            initialValues={{
                                password: "",
                                confirmPassword: ""
                            }}
                            onSubmit={handleSubmitPassword}
                        >
                            {({ values, setFieldValue }) => (
                                <Form className="space-y-5" autoComplete="off">
                                    <div>
                                        <Label text="Mobile Number" required />
                                        <Input
                                            value={mobile}
                                            disabled
                                            className="mt-2 h-11 rounded-xl bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <Label text="New Password" required />
                                        <Input
                                            type="password"
                                            value={values.password}
                                            placeholder="Enter new password"
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2 h-11 rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            text="Confirm Password"
                                            required
                                            className="sm:min-w-full"
                                        />
                                        <Input
                                            type="password"
                                            value={
                                                values.confirmPassword
                                            }
                                            placeholder="Confirm new password"
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "confirmPassword",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2 h-11 rounded-xl"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="h-11 w-full rounded-xl bg-[#184aa6] hover:bg-blue-900"
                                    >
                                        {loading ? "Updating..." : "Change Password"}
                                    </Button>

                                    {error && (
                                        <div className="text-center text-sm font-medium text-red-600">
                                            {error}
                                        </div>
                                    )}
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </motion.div>
        </main>
    );
};

export default ForgotPassword;