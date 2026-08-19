import { useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserIcon } from "@/components/icons/user";
import { LockIcon } from "@/components/icons/lock";
import { RefreshCWIcon } from "@/components/icons/refresh-cw";
import { ShieldCheckIcon } from "@/components/icons/shield-check";

const Login = () => {
    const location = useLocation();
    const applicationState = location.state || {};
    const ulbId = applicationState.ulbId || null;
    const deptId = applicationState.deptId || null;
    const serviceId = applicationState.serviceId || null;

    console.log({applicationState})

    const [captchaValue, setCaptchaValue] = useState(generateCaptcha());
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function generateCaptcha() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let captcha = "";
        for (let i = 0; i < 5; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return captcha;
    }

    const refreshCaptcha = () => {
        setCaptchaValue(generateCaptcha());
    };

    const blockClipboard = (e) => {
        e.preventDefault();
    };

    const handleLogin = async (values) => {
        setError("");

        if (!values.ulb) {
            setError("Please select ULB");
            return;
        }
        if (!values.in_UserId.trim()) {
            setError("Please enter username");
            return;
        }
        if (!values.in_password.trim()) {
            setError("Please enter password");
            return;
        }
        if (!values.captcha.trim()) {
            setError("Please enter CAPTCHA");
            return;
        }
        if (values.captcha !== captchaValue) {
            setError("Invalid CAPTCHA");
            refreshCaptcha();
            return;
        }

        const loginPayload = {...values, ulbId, deptId, serviceId};
        console.log("LOGIN FORM:", loginPayload);
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#f4f7fb]">
            <header className="relative bg-[#184aa6] px-4 py-3 shadow-md sm:px-6">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 sm:left-6">
                    <img src="/NagarKaryavali.jpeg" alt="AscenTech" className="h-10 w-auto object-contain sm:h-12"/>
                </div>
                <h1 className="text-center text-xl font-bold text-white sm:text-3xl">RTS</h1>
            </header>

            <main className="flex min-h-[calc(100vh-72px)] flex-col items-center px-4 py-6 sm:py-8">
                <motion.div
                    initial={{opacity: 0, y: 25, scale: 0.98}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    transition={{duration: 0.45, ease: "easeOut"}}
                    className="relative flex w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-300 bg-white shadow-[0px_10px_30px_10px_rgba(0,0,0,0.15)]"
                >
                    <div className="relative hidden shrink-0 overflow-hidden bg-[#bad2fa] lg:block lg:w-[40%]">
                        <div className="absolute -right-110 top-1/2 h-160 w-160 -translate-y-1/2 rounded-full bg-white" />
                        <div className="absolute left-32 top-1/2 z-20 flex h-32.5 w-32.5 -translate-y-1/2 items-center justify-center rounded-full border-10 border-white bg-[#184aa6]">
                            <img src="/login-label.png" alt="Login" className="h-16 w-16 object-contain shadow"/>
                        </div>
                    </div>

                    <div className="z-10 w-full p-5 lg:w-[60%] lg:px-1.5 lg:py-5">
                        <Formik
                            initialValues={{
                                ulb: ulbId ? `ulb${ulbId}` : "",
                                in_UserId: "",
                                in_password: "",
                                captcha: "",
                            }}
                            onSubmit={handleLogin}
                        >
                            {({ values, handleChange, setFieldValue }) => (
                                <Form className="space-y-4">
                                    <motion.div
                                        initial={{opacity: 0, x: 15}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: 0.05}}
                                    >
                                        <div className="flex items-center gap-1">
                                            <Building2 size={18} className="shrink-0 text-[#184aa6]"/>

                                            <Label text="ULB:" required/>

                                            <Select
                                                value={values.ulb}
                                                onValueChange={(value) =>
                                                    setFieldValue("ulb", value)
                                                }
                                            >
                                                <SelectTrigger className="w-full rounded-xl border-gray-300 bg-gray-50 text-sm focus:ring-[#184aa6]">
                                                    <SelectValue placeholder="Select ULB" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="ulb1">
                                                        ULB 1
                                                    </SelectItem>

                                                    <SelectItem value="ulb2">
                                                        ULB 2
                                                    </SelectItem>

                                                    <SelectItem value="ulb3">
                                                        ULB 3
                                                    </SelectItem>

                                                    <SelectItem value="ulb4">
                                                        ULB 4
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{opacity: 0, x: 15 }}
                                        animate={{opacity: 1, x: 0 }}
                                        transition={{delay: 0.1 }}
                                    >
                                        <div className="flex items-center gap-1">
                                            <UserIcon size={19} className="shrink-0 text-[#184aa6]"/>
                                            <Label text="Username:" required/>

                                            <Input
                                                id="in_UserId"
                                                name="in_UserId"
                                                value={values.in_UserId}
                                                onChange={handleChange}
                                                placeholder="Enter username"
                                                autoComplete="username"
                                                onCopy={blockClipboard}
                                                onPaste={blockClipboard}
                                                className="h-11 rounded-xl border-gray-300 bg-gray-50 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{opacity: 0, x: 15 }}
                                        animate={{opacity: 1, x: 0 }}
                                        transition={{delay: 0.15 }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <LockIcon size={19} className="shrink-0 text-[#184aa6]"/>
                                            <Label text="Password:" required/>

                                            <Input
                                                id="in_password"
                                                type="password"
                                                name="in_password"
                                                value={values.in_password}
                                                onChange={handleChange}
                                                placeholder="Enter password"
                                                autoComplete="current-password"
                                                onCopy={blockClipboard}
                                                onPaste={blockClipboard}
                                                className="h-11 rounded-xl border-gray-300 bg-gray-50 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{opacity: 0, x: 15}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: 0.2}}
                                    >
                                        <div className="flex items-center gap-2">
                                            <ShieldCheckIcon size={19} className="shrink-0 text-[#184aa6]"/>
                                            <Label text="CAPTCHA:" required className="mb-1.5"/>

                                            <div className="flex flex-1 gap-2">
                                                <div className="flex h-11 flex-1 select-none items-center justify-center overflow-hidden rounded-xl border border-gray-300 bg-gray-100 font-mono text-lg font-bold tracking-[5px] text-[#184aa6]">
                                                    {captchaValue}
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={refreshCaptcha}
                                                    className="h-11 w-11 shrink-0 rounded-xl border-gray-300 p-0"
                                                    title="Refresh CAPTCHA"
                                                >
                                                    <RefreshCWIcon size={17}/>
                                                </Button>
                                            </div>
                                        </div>

                                        <Input
                                            id="captcha"
                                            name="captcha"
                                            value={values.captcha}
                                            onChange={handleChange}
                                            placeholder="Enter CAPTCHA"
                                            autoComplete="off"
                                            onCopy={blockClipboard}
                                            onPaste={blockClipboard}
                                            className="mt-2 h-11 rounded-xl border-gray-300 bg-gray-50 focus-visible:border-[#184aa6] focus-visible:ring-[#184aa6]"
                                        />
                                    </motion.div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="h-11 w-full rounded-xl bg-[#184aa6] text-sm font-semibold text-white shadow-md hover:bg-blue-900"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <RefreshCWIcon size={16}/>
                                                Logging in...
                                            </span>
                                        ) : (
                                            "Login"
                                        )}
                                    </Button>

                                    {error && (
                                        <motion.div
                                            initial={{opacity: 0, y: -5}}
                                            animate={{opacity: 1, y: 0}}
                                            className="text-center text-sm font-medium text-red-600 underline"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="flex flex-col items-center gap-3 text-xs sm:flex-row sm:justify-between">
                                        <Button
                                            path="/forgot-password"
                                            variant="link"
                                        >
                                            Forgot Password?
                                        </Button>

                                        <Button
                                            path="/registration"
                                            variant="link"
                                        >
                                            New User Registration
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <Button
                                            path="/otp-login"
                                            variant="outline"
                                            className="h-9 rounded-lg border-[#184aa6] px-3 text-[#184aa6] hover:bg-[#184aa6] hover:text-white"
                                        >
                                            Login With OTP
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

export default Login;