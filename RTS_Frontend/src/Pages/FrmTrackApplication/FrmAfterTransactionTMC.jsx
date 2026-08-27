import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const FrmAfterTransactionTMC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [paymentResponse, setPaymentResponse] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [appNo, setAppNo] = useState("");
    const [amount, setAmount] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [email, setEmail] = useState("");
    const [userUniqueId, setUserUniqueId] = useState("");
    const [userFullName, setUserFullName] = useState("");
    const [ulbId, setUlbId] = useState("");
    const [receiptUrl, setReceiptUrl] = useState("");
    const [certificateUrl, setCertificateUrl] = useState("");
    const [paymentProcessed, setPaymentProcessed] = useState(false);

    useEffect(() => {
        const loadPaymentSession = async () => {
            const params = new URLSearchParams(location.search);
            const currentTransactionId = params.get("transactionId");
            const currentPaymentResponse = params.get("paymentResponse");

            if (!currentTransactionId) {
                setLoading(false);
                setPaymentStatus("Transaction ID not found.");
                await Swal.fire({
                    // icon: "error",
                    // title: "Payment Failed",
                    text: "Transaction ID not found."
                });
                return;
            }

            if (!currentPaymentResponse) {
                setLoading(false);
                setPaymentStatus("Payment gateway response not found.");
                await Swal.fire({
                    // icon: "error",
                    // title: "Payment Failed",
                    text: "Payment gateway response not found."
                });
                return;
            }

            setTransactionId(currentTransactionId);
            setPaymentResponse(currentPaymentResponse);

            try {
                const sessionResponse = await axios.get(
                    `${baseUrl}/api/FrmAppFrmAfterTransactionTMCliFee/payment-session-details`,
                    {
                        params: {paymentSessionId: currentTransactionId},
                        headers: {Authorization: `Bearer ${token}`}
                    }
                );

                const sessionResult = sessionResponse?.data?.data;

                if (!sessionResult?.success || !sessionResult?.data?.length) {
                    throw new Error(sessionResult?.message || "Payment session details not found.");
                }

                const sessionData = sessionResult.data[0];
                setAppNo(sessionData.APPNO ?? "");
                setAmount(sessionData.AMOUNT ?? "");
                setServiceId(sessionData.SERVICEID ?? "");
                setEmail(sessionData.EMAIL ?? "");
                setUserUniqueId(sessionData.USERUNIQUEID ?? "");
                setUserFullName(sessionData.USERFULLNAME ?? "");
                setUlbId(user?.ulbId ?? "");

                const gatewayParts = String(currentPaymentResponse).split("~");
                const gatewayStatus = gatewayParts[5] || "";
                const currentPaymentStatus = gatewayStatus === "0300" ? "S" : "F";

                setPaymentStatus(currentPaymentStatus === "S" ? "Payment Successful" : "Payment Failed");
                setLoading(false);
            } catch (error) {
                console.error("Payment session error:", error);
                setLoading(false);
                setPaymentStatus("Unable to fetch payment details.");
                await Swal.fire({
                    // icon: "error",
                    // title: "Payment Failed",
                    text: error?.response?.data?.message || error?.message || "Unable to fetch payment session details."
                });
            }
        };

        if (token) {
            loadPaymentSession();
        }
    }, [location.search, token, user?.ulbId]);

    useEffect(() => {
        if (loading || processingPayment || paymentProcessed || !appNo || !amount || !paymentResponse) {
            return;
        }

        const processPayment = async () => {
            try {
                setProcessingPayment(true);
                const gatewayParts = String(paymentResponse).split("~");
                const gatewayStatus = gatewayParts[5] || "";
                const currentPaymentStatus = gatewayStatus === "0300" ? "S" : "F";

                const paymentInsResponse = await axios.post(`${baseUrl}/api/FrmAppFrmAfterTransactionTMCliFee/payment-ins`,
                    { appNo, amount, paymentStatus: currentPaymentStatus, paymentResponse },
                    {
                        headers: {Authorization: `Bearer ${token}`}
                    }
                );

                const paymentInsResult = paymentInsResponse?.data?.data;

                if (!paymentInsResult?.success || Number(paymentInsResult?.errorCode) !== 9999) {
                    throw new Error(paymentInsResult?.message || paymentInsResponse?.data?.message || "Payment processing failed.");
                }

                setPaymentProcessed(true);

                if (currentPaymentStatus !== "S") {
                    setProcessingPayment(false);
                    await Swal.fire({
                        // icon: "error",
                        // title: "Payment Failed",
                        text: paymentInsResult?.message || "Bank response indicates that the payment was not successful.",
                        confirmButtonText: "OK"
                    });
                    return;
                }

                setPaymentStatus("Payment Successful");
                setProcessingPayment(false);

                await Swal.fire({
                    icon: "success",
                    // title: "Payment Successful",
                    text: "Payment has been successfully processed.",
                    confirmButtonText: "OK",
                    allowOutsideClick: false
                });

                setReceiptUrl("");
                setCertificateUrl("");

                let receiptGenerated = false;
                let certificateGenerated = false;

                Swal.fire({
                    // title: "Generating Receipt...",
                    text: "Please wait while your payment receipt is being generated.",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                try {
                    const receiptResponse = await axios.post(`${baseUrl}/api/FrmAfterTransactionTMC/paymentacknowledgement`,
                        {
                            serviceId: String(serviceId), appNo: String(appNo), ulbId: String(ulbId)
                        },
                        {
                            headers: {Authorization: `Bearer ${token}`},
                            responseType: "blob"
                        }
                    );

                    const receiptContentType = receiptResponse?.headers?.["content-type"] || "";

                    if (!receiptContentType.includes("application/pdf")) {
                        const errorText = await receiptResponse.data.text();
                        let errorMessage = "Unable to generate receipt.";

                        try {
                            const errorData = JSON.parse(errorText);
                            errorMessage = errorData?.message || errorData?.data?.message || errorMessage;
                        } catch {
                            if (errorText) {
                                errorMessage = errorText;
                            }
                        }

                        Swal.close();

                        await Swal.fire({
                            // icon: "error",
                            // title: "Receipt Generation Failed",
                            text: errorMessage,
                            confirmButtonText: "OK",
                            allowOutsideClick: false
                        });
                    } else {
                        const receiptBlob = new Blob([receiptResponse.data], { type: "application/pdf" });

                        const generatedReceiptUrl = window.URL.createObjectURL(receiptBlob);
                        setReceiptUrl(generatedReceiptUrl);
                        receiptGenerated = true;
                        Swal.close();
                    }
                } catch (error) {
                    let errorMessage = "Unable to generate payment receipt.";

                    if (error?.response?.data instanceof Blob) {
                        try {
                            const errorText = await error.response.data.text();
                            const errorData = JSON.parse(errorText);
                            errorMessage = errorData?.message || errorData?.data?.message || errorMessage;
                        } catch {
                            errorMessage = "Unable to generate payment receipt.";
                        }
                    } else {
                        errorMessage = error?.response?.data?.message || error?.message || errorMessage;
                    }

                    console.error("Receipt generation error:", error);

                    Swal.close();

                    await Swal.fire({
                        // icon: "error",
                        // title: "Receipt Generation Failed",
                        text: errorMessage,
                        confirmButtonText: "OK",
                        allowOutsideClick: false
                    });
                }

                Swal.fire({
                    // title: "Generating Certificate...",
                    text: "Please wait while your certificate is being generated.",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                try {
                    const certificateResponse = await axios.post(`${baseUrl}/api/FrmTrackApplication/generate-certificate-report`,
                        {
                            serviceId: String(serviceId), appNo: String(appNo), ulbId: String(ulbId)
                        },
                        {
                            headers: {Authorization: `Bearer ${token}`},
                            responseType: "blob"
                        }
                    );

                    const certificateContentType = certificateResponse?.headers?.["content-type"] || "";

                    if (!certificateContentType.includes("application/pdf")) {
                        const errorText = await certificateResponse.data.text();
                        let errorMessage = "Unable to generate certificate.";

                        try {
                            const errorData = JSON.parse(errorText);
                            errorMessage = errorData?.message || errorData?.data?.message || errorMessage;
                        } catch {
                            if (errorText) {
                                errorMessage = errorText;
                            }
                        }

                        Swal.close();

                        await Swal.fire({
                            // icon: "error",
                            // title: "Certificate Generation Failed",
                            text: errorMessage,
                            confirmButtonText: "OK",
                            allowOutsideClick: false
                        });
                    } else {
                        const certificateBlob = new Blob([certificateResponse.data], { type: "application/pdf" });
                        const generatedCertificateUrl = window.URL.createObjectURL(certificateBlob);

                        setCertificateUrl(generatedCertificateUrl);
                        certificateGenerated = true;

                        Swal.close();
                    }
                } catch (error) {
                    let errorMessage = "Unable to generate certificate.";

                    if (error?.response?.data instanceof Blob) {
                        try {
                            const errorText = await error.response.data.text();
                            const errorData = JSON.parse(errorText);

                            errorMessage = errorData?.message || errorData?.data?.message || errorMessage;
                        } catch {
                            errorMessage = "Unable to generate certificate.";
                        }
                    } else {
                        errorMessage = error?.response?.data?.message || error?.message || errorMessage;
                    }

                    console.error("Certificate generation error:", error);
                    Swal.close();

                    await Swal.fire({
                        // icon: "error",
                        // title: "Certificate Generation Failed",
                        text: errorMessage,
                        confirmButtonText: "OK",
                        allowOutsideClick: false
                    });
                }

                if (receiptGenerated && certificateGenerated) {
                    await Swal.fire({
                        // icon: "success",
                        // title: "Documents Generated",
                        text: "Receipt and certificate generated successfully.",
                        confirmButtonText: "OK",
                        allowOutsideClick: false
                    });
                } else if (receiptGenerated) {
                    await Swal.fire({
                        // icon: "success",
                        // title: "Receipt Generated",
                        text: "Payment receipt generated successfully.",
                        confirmButtonText: "OK",
                        allowOutsideClick: false
                    });
                } else if (certificateGenerated) {
                    await Swal.fire({
                        // icon: "success",
                        // title: "Certificate Generated",
                        text: "Certificate generated successfully.",
                        confirmButtonText: "OK",
                        allowOutsideClick: false
                    });
                }
            } catch (error) {
                console.error("Payment processing error:", error);
                Swal.close();
                setProcessingPayment(false);

                await Swal.fire({
                    // icon: "error",
                    title: "Payment Processing Failed",
                    text: error?.response?.data?.message || error?.message || "Unable to complete payment processing.",
                    confirmButtonText: "OK"
                });
            }
        };

        processPayment();
    }, [loading, appNo, amount, serviceId, ulbId, paymentResponse, paymentProcessed, processingPayment, token]);

    const handleViewReceipt = () => {
        if (!receiptUrl) {
            Swal.fire({
                // icon: "warning",
                text: "Receipt is not available."
            });
            return;
        }

        window.open(receiptUrl, "_blank");
    };

    const handleDownloadReceipt = () => {
        if (!receiptUrl) {
            Swal.fire({
                // icon: "warning",
                text: "Receipt is not available."
            });
            return;
        }

        const link = document.createElement("a");
        link.href = receiptUrl;
        link.download = `${appNo}-Receipt.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleViewCertificate = () => {
        if (!certificateUrl) {
            Swal.fire({
                // icon: "warning",
                text: "Certificate is not available."
            });
            return;
        }

        window.open(certificateUrl, "_blank");
    };

    const handleDownloadCertificate = () => {
        if (!certificateUrl) {
            Swal.fire({
                // icon: "warning",
                text: "Certificate is not available."
            });
            return;
        }

        const link = document.createElement("a");
        link.href = certificateUrl;
        link.download = `${appNo}-Certificate.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#f4f7fb]">
                <div className="text-center">
                    <div className="mb-2 text-lg font-semibold text-gray-800">
                        Loading Transaction Details...
                    </div>
                    <div className="text-sm text-gray-500">
                        Please wait.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f7fb] px-4 py-8">
            <div className="mx-auto w-full max-w-5xl">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-[#f8fafc] px-5 py-4">
                        <h1 className="text-lg font-semibold text-gray-800">
                            Payment Transaction Details
                        </h1>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                            <div className="flex items-center gap-4">
                                <div className="flex w-40 shrink-0 items-center justify-between">
                                    <Label text="Transaction No." />
                                    <span>:</span>
                                </div>
                                <div className="min-w-0 flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                    {transactionId || "-"}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex w-40 shrink-0 items-center justify-between">
                                    <Label text="Application No." />
                                    <span>:</span>
                                </div>
                                <div className="min-w-0 flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                    {appNo || "-"}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex w-40 shrink-0 items-center justify-between">
                                    <Label text="Transaction Amount" />
                                    <span>:</span>
                                </div>
                                <div className="min-w-0 flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                    {amount || "-"}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex w-40 shrink-0 items-center justify-between">
                                    <Label text="Applicant Name" />
                                    <span>:</span>
                                </div>
                                <div className="min-w-0 flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                    {userFullName || "-"}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex w-40 shrink-0 items-center justify-between">
                                    <Label text="Applicant Email" />
                                    <span>:</span>
                                </div>
                                <div className="min-w-0 flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                    {email || "-"}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex w-40 shrink-0 items-center justify-between">
                                    <Label text="Service ID" />
                                    <span>:</span>
                                </div>
                                <div className="min-w-0 flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                    {serviceId || "-"}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex w-40 shrink-0 items-center justify-between">
                                    <Label text="User Unique ID" />
                                    <span>:</span>
                                </div>
                                <div className="min-w-0 flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                    {userUniqueId || "-"}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex w-40 shrink-0 items-center justify-between">
                                    <Label text="ULB ID" />
                                    <span>:</span>
                                </div>
                                <div className="min-w-0 flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                    {ulbId || "-"}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 md:col-span-2">
                                <div className="flex w-40 shrink-0 items-center justify-between">
                                    <Label text="Payment Status" />
                                    <span>:</span>
                                </div>
                                <div className={`min-w-0 flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm ${paymentStatus === "Payment Successful" ? "font-semibold text-green-600" : "font-semibold text-red-600"}`}>
                                    {paymentStatus || "-"}
                                </div>
                            </div>
                        </div>
                        {processingPayment && (
                            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm text-blue-700">
                                Processing payment and generating documents...
                            </div>
                        )}
                        {paymentStatus === "Payment Successful" && paymentProcessed && (
                            <div className="mt-6 flex flex-wrap justify-center gap-3 border-t border-gray-200 pt-5">
                                {receiptUrl && (
                                    <>
                                        <Button type="button" variant="outline" onClick={handleViewReceipt}>Download Receipt</Button>
                                        {/* <Button type="button" variant="outline" onClick={handleDownloadReceipt}>Download Receipt</Button> */}
                                    </>
                                )}

                                {certificateUrl && (
                                    <>
                                        <Button type="button" onClick={handleViewCertificate}>Download Certificate</Button>
                                        {/* <Button type="button" onClick={handleDownloadCertificate}>Download Certificate</Button> */}
                                    </>
                                )}
                                <Button type="button" variant="outline" path="/app/TrackApplication">Back</Button>
                            </div>
                        )}
                        {paymentStatus === "Payment Failed" && !processingPayment && (
                            <div className="mt-6 flex justify-center border-t border-gray-200 pt-5">
                                <Button type="button" variant="outline" path="/app/TrackApplication">Back</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FrmAfterTransactionTMC;