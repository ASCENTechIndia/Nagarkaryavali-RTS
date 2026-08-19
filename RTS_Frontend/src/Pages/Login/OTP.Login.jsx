import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, } from "@/components/ui/input-otp";
import { PhoneIcon } from "@/components/icons/phone";
import { RefreshCWIcon } from "@/components/icons/refresh-cw";
import { ShieldCheckIcon } from "@/components/icons/shield-check";

const OTPLogin = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [resendTimer, setResendTimer] = useState(30);
    const [resendLoading, setResendLoading] = useState(false);
    const blockClipboard = (e) => { e.preventDefault() };

    useEffect(() => {
        if (!otpSent || resendTimer <= 0) { return }

        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [otpSent, resendTimer]);

    const handleGetOtp = async (values) => {
        setError("");
        if (!values.mobile.trim()) {
            setError("Please enter mobile number");
            return;
        }
        if (values.mobile.length !== 10) {
            setError("Please enter a valid 10 digit mobile number");
            return;
        }
        console.log("OTP FORM:", values);
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setOtpSent(true);
            setOtp("");
            setResendTimer(30);
        }, 1000);
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0 || resendLoading) { return }
        setError("");
        setResendLoading(true);
        console.log("RESEND OTP");

        setTimeout(() => {
            setResendLoading(false);
            setOtp("");
            setResendTimer(30);
        }, 1000);
    };

    const handleVerifyOtp = async () => {
        setError("");
        if (otp.length !== 6) {
            setError("Please enter complete 6 digit OTP");
            return;
        }

        console.log("VERIFY OTP:", otp);
    };


    return (
        <div className="min-h-screen bg-[#f4f7fb]">
            <header className="relative bg-[#184aa6] px-4 py-3 shadow-md sm:px-6">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 sm:left-6">
                    <img
                        src="/NagarKaryavali.jpeg"
                        alt="AscenTech"
                        className="h-10 w-auto object-contain sm:h-12"
                    />
                </div>
                <h1 className="text-center text-xl font-bold text-white sm:text-3xl">RTS</h1>
            </header>
            <main className="flex min-h-[calc(100vh-72px)] flex-col items-center px-4 py-6 sm:py-8">
                <motion.div
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className=" relative flex w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-300 bg-white shadow-[0px_10px_30px_10px_rgba(0,0,0,0.15)]"
                >
                    <div className="relative hidden shrink-0 overflow-hidden bg-[#bad2fa] lg:block lg:w-[40%]">
                        <div className=" absolute -right-110 top-1/2 h-160 w-160 -translate-y-1/2 rounded-full bg-white" />
                        <div className="absolute left-32 top-1/2 z-20 flex h-32.5 w-32.5 -translate-y-1/2 items-center              justify-center rounded-full border-10 border-white bg-[#184aa6]">
                            <img
                                src="/login-label.png"
                                alt="Login"
                                className="h-16 w-16 object-contain shadow"
                            />
                        </div>
                    </div>

                    <div className="z-10 w-full p-5 sm:p-8 lg:w-1/2">
                        <Formik initialValues={{ mobile: "" }} onSubmit={handleGetOtp}>
                            {({ values, handleChange }) => (
                                <Form className="space-y-5" autoComplete="off">
                                    <motion.div
                                        initial={{ opacity: 0, x: 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <Label text="Mobile Number" required />
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon size={19} className="shrink-0 text-[#184aa6]" />

                                            <Input
                                                id="mobile"
                                                name="mobile"
                                                type="tel"
                                                inputMode="numeric"
                                                maxLength={10}
                                                value={values.mobile}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "");
                                                    handleChange({ target: { name: "mobile", value } });
                                                }}
                                                placeholder="Enter mobile number"
                                                autoComplete="off"
                                                onCopy={blockClipboard}
                                                onPaste={blockClipboard}
                                                className=" h-11 rounded-xl border-gray-300 bg-gray-50 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                            />
                                        </div>
                                    </motion.div>
                                    {!otpSent && (
                                        <>
                                            <div
                                                className=" flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-[#184aa6]"
                                            >
                                                <ShieldCheckIcon size={17} /><span> OTP will be sent to your registered mobile number.</span>
                                            </div>

                                        </>
                                    )}
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className=" h-11 w-full rounded-xl bg-[#184aa6] text-sm font-semibold text-white shadow-md hover:bg-blue-900"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <RefreshCWIcon size={16} />Sending OTP...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <PhoneIcon size={17} />Get OTP
                                            </span>

                                        )}
                                    </Button>
                                    {otpSent && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4"
                                        >
                                            <div className="text-center">
                                                <Label
                                                    text="Enter OTP"
                                                    required
                                                    className="justify-center"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">Enter the 6 digit OTP sent to your mobile number.</p>
                                            </div>
                                            <div className="flex justify-center">
                                                <InputOTP
                                                    maxLength={6}
                                                    value={otp}
                                                    onChange={(value) => setOtp(value)}
                                                    autoComplete="one-time-code"
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                    </InputOTPGroup>

                                                    <InputOTPSeparator />

                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={otp.length !== 6}
                                                className=" h-10 w-full rounded-xl bg-[#184aa6] text-sm font-semibold text-white hover:bg-blue-900"
                                            >
                                                Verify OTP
                                            </Button>

                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-xs text-gray-500">Didn't receive the OTP?</span>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleResendOtp}
                                                    disabled={resendTimer > 0 || resendLoading}
                                                    className=" h-9 rounded-lg border-[#184aa6] px-4 text-[#184aa6] hover:bg-[#184aa6] hover:text-white"
                                                >
                                                    {resendLoading ? (
                                                        <span className="flex items-center gap-2">
                                                            <RefreshCWIcon size={16} />Resending...
                                                        </span>
                                                    ) : resendTimer > 0 ? (
                                                        `Resend OTP in ${resendTimer}s`
                                                    ) : (
                                                        <span className="flex items-center gap-2">
                                                            <RefreshCWIcon size={16} />Resend OTP
                                                        </span>
                                                    )}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className=" text-center text-sm font-medium text-red-600"
                                        >
                                            {error}
                                        </motion.div>

                                    )}

                                    <div className="flex justify-center">
                                        <Button
                                            path="/login"
                                            variant="link"
                                            className=" h-auto p-0 text-sm font-medium text-[#184aa6]"
                                        >
                                            Login with Username & Password
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default OTPLogin;