import { useCallback, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ShadCNTable from "@/components/ui/table";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FrmWaterRegister = () => {
    const location = useLocation();
    const { user, token: authToken } = useAuth();
    const state = location.state || {};
    const ulbId = state.ulbId ?? user?.ulbId ?? 3;
    const deptId = state.deptId ?? user?.deptId ?? 24;
    const serviceId = state.serviceId ?? user?.serviceId ?? 21;
    const serviceName = state.serviceName ?? user?.serviceName ?? "Reconnection";
    const serviceRate = state.serviceRate ?? 0;
    const userId = state.userId ?? user?.userId ?? 1001;
    const token = state.token || authToken || user?.token || sessionStorage.getItem("token") || "TEST_TOKEN";

    const [zones, setZones] = useState([]);
    const [services, setServices] = useState([]);
    const [disconnectionTypes, setDisconnectionTypes] = useState([]);
    const [usageTypes, setUsageTypes] = useState([]);
    const [connectionSizes, setConnectionSizes] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [serviceDisplayName, setServiceDisplayName] = useState(serviceName);
    const [payFlag, setPayFlag] = useState("");
    const [connectionDetails, setConnectionDetails] = useState(null);
    const [files, setFiles] = useState({});
    const [searching, setSearching] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const initialValues = {
        zoneId: "",
        serviceId: String(serviceId),
        consumerNo: "",
        disConId: "",
        reason: "",
        usageTypeId: "",
        tarifRate: serviceRate,
        connSize: "",
        remark: "",
        ownerName: "",
        usageType: "",
        detAppliName: "",
        detMobile: "",
        detAadhaar: "",
        detEmail: "",
        detAddress: "",
        conAddressSrch: "",
        ownerNameSrch: "",
        curConSizeSrch: "",
        usageTypeNewSrch: "",
        erlDate: new Date().toISOString().split("T")[0],
        source: "WEB",
    };

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const loadMasters = useCallback(async () => {
        if (!ulbId || !serviceId || !token) return;

        Swal.fire({
            title: "Loading...",
            text: "Loading water register data",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading(),
        });

        const results = await Promise.allSettled([
            axios.get(`${BASE_URL}/api/FrmWaterRegister/ward-dropdown`, {
                params: { ulbid: Number(ulbId) },
                headers,
            }),
            axios.get(`${BASE_URL}/api/FrmWaterRegister/service-dropdown`, {
                params: { rptMode: 4 },
                headers,
            }),
            axios.get(`${BASE_URL}/api/FrmWaterRegister/disconnection-dropdown`, {
                headers,
            }),
            axios.get(`${BASE_URL}/api/FrmWaterRegister/usage-type-dropdown`, {
                headers,
            }),
            axios.get(`${BASE_URL}/api/FrmWaterRegister/connection-size-dropdown`, {
                headers,
            }),
            axios.get(`${BASE_URL}/api/FrmWaterRegister/service-name`, {
                params: { serviceId: Number(serviceId) },
                headers,
            }),
            axios.get(`${BASE_URL}/api/FrmWaterRegister/documents`, {
                params: {
                    ulbid: Number(ulbId),
                    serviceId: Number(serviceId),
                },
                headers,
            }),
            axios.get(`${BASE_URL}/api/FrmWaterRegister/service-pay-flag`, {
                params: { serviceId: Number(serviceId) },
                headers,
            }),
        ]);

        const [zoneResult, serviceResult, disconnectionResult, usageResult, connectionSizeResult, serviceNameResult, documentResult, payFlagResult] = results;

        if (zoneResult.status === "fulfilled") {
            setZones(zoneResult.value?.data?.data?.data || []);
        }

        if (serviceResult.status === "fulfilled") {
            setServices(serviceResult.value?.data?.data?.data || []);
        }

        if (disconnectionResult.status === "fulfilled") {
            setDisconnectionTypes(disconnectionResult.value?.data?.data?.data || []);
        }

        if (usageResult.status === "fulfilled") {
            setUsageTypes(usageResult.value?.data?.data?.data || []);
        }

        if (connectionSizeResult.status === "fulfilled") {
            setConnectionSizes(connectionSizeResult.value?.data?.data?.data || []);
        }

        if (serviceNameResult.status === "fulfilled") {
            const data = serviceNameResult.value?.data?.data?.data || [];
            setServiceDisplayName(data?.[0]?.VAR_SERVICE_ENG_NAME || serviceName);
        }

        if (documentResult.status === "fulfilled") {
            setDocuments(documentResult.value?.data?.data?.data || []);
        }

        if (payFlagResult.status === "fulfilled") {
            const data = payFlagResult.value?.data?.data?.data || [];
            setPayFlag(data?.[0]?.VAR_SERVICE_PAYFLAG || "");
        }

        const rejected = results.filter((result) => result.status === "rejected");

        if (rejected.length === results.length) {
            Swal.close();
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to load water register data",
            });
            return;
        }

        Swal.close();
    }, [ulbId, serviceId, token, serviceName]);

    useEffect(() => {
        loadMasters();
    }, [loadMasters]);

    const searchConnection = async (consumerNo, setFieldValue) => {
        if (!consumerNo?.trim()) {
            Swal.fire({
                icon: "warning",
                text: "Please enter Consumer No",
            });
            return;
        }

        setSearching(true);

        try {
            const response = await axios.get(
                `${BASE_URL}/api/FrmWaterRegister/connection-details`,
                {
                    params: {
                        consumerNo: consumerNo.trim(),
                        userId: Number(userId),
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const details = response?.data?.data;

            console.log("Connection Details Response:", details);

            if (!details) {
                setConnectionDetails(null);
                Swal.fire({
                    icon: "warning",
                    title: "Not Found",
                    text: "Connection details not found",
                });
                return;
            }

            setConnectionDetails(details);

            Swal.fire({
                icon: "success",
                title: "Connection Found",
                text: "Connection details loaded successfully",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Connection Search Error:", error);
            setConnectionDetails(null);
            Swal.fire({
                icon: "error",
                title: "Search Failed",
                text:
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Unable to fetch connection details",
            });
        } finally {
            setSearching(false);
        }
    };

    const handleFileChange = (event, documentItem) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            event.target.value = "";
            Swal.fire({
                icon: "error",
                text: "Document size should not exceed 5 MB",
            });
            return;
        }

        const extension = file.name.split(".").pop()?.toLowerCase();

        if (!["pdf", "jpg", "jpeg", "png"].includes(extension)) {
            event.target.value = "";
            Swal.fire({
                icon: "error",
                text: "Only PDF, JPG, JPEG and PNG files are allowed",
            });
            return;
        }

        setFiles((prev) => ({
            ...prev,
            [documentItem.DOCID]: {
                file,
                docId: documentItem.DOCID,
                docType: documentItem.DOCTYPE,
                docName: documentItem.DOCNAME,
            },
        }));
    };

    const removeFile = (docId) => {
        setFiles((prev) => {
            const updated = { ...prev };
            delete updated[docId];
            return updated;
        });
    };

    const extractApplicationNo = (message) => {
        const match = message?.match(/Appli no:([^$]+)/i);
        return match?.[1]?.trim() || "";
    };

    const uploadDocuments = async (applicationNo, selectedServiceId) => {
        const uploadedFiles = Object.values(files);

        if (!documents.length) return;

        if (uploadedFiles.length !== documents.length) {
            throw new Error("Please upload all required documents");
        }

        const results = await Promise.allSettled(
            uploadedFiles.map((item) => {
                const formData = new FormData();
                formData.append("corpid", String(ulbId));
                formData.append("serviceid", String(selectedServiceId));
                formData.append("appno", applicationNo);
                formData.append("doctype", item.docType);
                formData.append("documentid", String(item.docId));
                formData.append("file", item.file);

                return axios.post(
                    `${BASE_URL}/api/FrmWaterRegister/upload-document`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            })
        );

        const failed = results.find(
            (result) => result.status === "rejected"
        );

        if (failed) {
            throw new Error(
                failed.reason?.response?.data?.message ||
                failed.reason?.response?.data?.error ||
                failed.reason?.message ||
                "One or more documents failed to upload"
            );
        }
    };

    const handleSubmit = async (values, { resetForm }) => {
        if (!ulbId || !serviceId || !userId || !token) {
            Swal.fire({
                icon: "error",
                text: "Required login information is missing",
            });
            return;
        }

        if (!values.zoneId) {
            Swal.fire({
                icon: "warning",
                text: "Please select Zone",
            });
            return;
        }

        if (!values.consumerNo?.trim()) {
            Swal.fire({
                icon: "warning",
                text: "Please enter Consumer No",
            });
            return;
        }

        if (!values.disConId) {
            Swal.fire({
                icon: "warning",
                text: "Please select Disconnection Type",
            });
            return;
        }

        if (!values.usageTypeId) {
            Swal.fire({
                icon: "warning",
                text: "Please select Usage Type",
            });
            return;
        }

        if (!values.connSize) {
            Swal.fire({
                icon: "warning",
                text: "Please select Connection Size",
            });
            return;
        }

        if (!values.detAppliName?.trim()) {
            Swal.fire({
                icon: "warning",
                text: "Please enter Applicant Name",
            });
            return;
        }

        if (!/^\d{10}$/.test(values.detMobile)) {
            Swal.fire({
                icon: "warning",
                text: "Please enter valid 10 digit Mobile Number",
            });
            return;
        }

        if (!/^\d{12}$/.test(values.detAadhaar)) {
            Swal.fire({
                icon: "warning",
                text: "Please enter valid 12 digit Aadhaar Number",
            });
            return;
        }

        if (!values.detEmail?.trim()) {
            Swal.fire({
                icon: "warning",
                text: "Please enter Email",
            });
            return;
        }

        if (!values.detAddress?.trim()) {
            Swal.fire({
                icon: "warning",
                text: "Please enter Address",
            });
            return;
        }

        if (!values.remark?.trim()) {
            Swal.fire({
                icon: "warning",
                text: "Please enter Remark",
            });
            return;
        }

        if (
            documents.length &&
            Object.keys(files).length !== documents.length
        ) {
            Swal.fire({
                icon: "warning",
                title: "Documents Required",
                text: "Please upload all required documents",
            });
            return;
        }

        setSubmitting(true);

        Swal.fire({
            title: "Submitting...",
            text: "Please wait",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const payload = {
                userId: Number(userId),
                wtregId: 0,
                servId: Number(serviceId),
                consNo: values.consumerNo.trim(),
                disConId: Number(values.disConId),
                reason: values.reason?.trim() || null,
                usageTypeId: Number(values.usageTypeId),
                tarifRate:
                    values.tarifRate === ""
                        ? null
                        : Number(values.tarifRate),
                connSize: Number(values.connSize),
                remark: values.remark.trim(),
                ulbid: Number(ulbId),
                zoneId: Number(values.zoneId),
                source: values.source || "WEB",
                ownerName: values.ownerName || "",
                usageType: values.usageType || "",
                detAppliName: values.detAppliName.trim(),
                detMobile: Number(values.detMobile),
                detAadhaar: values.detAadhaar.trim(),
                detEmail: values.detEmail.trim(),
                detAddress: values.detAddress.trim(),
                conAddressSrch: values.conAddressSrch || "",
                ownerNameSrch: values.ownerNameSrch || "",
                curConSizeSrch: values.curConSizeSrch || "",
                usageTypeNewSrch: values.usageTypeNewSrch || "",
                erlDate: values.erlDate,
            };

            console.log("Water Register Payload:", payload);

            const response = await axios.post(
                `${BASE_URL}/api/FrmWaterRegister/save-water-register`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response?.data?.ok) {
                throw new Error(
                    response?.data?.error ||
                    response?.data?.message ||
                    "Unable to save water register"
                );
            }

            const result = response?.data?.data;
            const message =
                result?.message ||
                response?.data?.message ||
                "";

            const applicationNo = extractApplicationNo(message);

            if (!applicationNo) {
                throw new Error(
                    "Application number was not returned"
                );
            }

            if (documents.length) {
                Swal.update({
                    title: "Uploading Documents...",
                    text: "Please wait while documents are uploaded",
                });

                await uploadDocuments(
                    applicationNo,
                    serviceId
                );
            }

            Swal.close();

            await Swal.fire({
                icon: "success",
                title: "Application Submitted",
                html: `Application No: <strong>${applicationNo}</strong>`,
                confirmButtonText: "OK",
            });

            resetForm({
                values: {
                    ...initialValues,
                    serviceId: String(serviceId),
                    tarifRate: serviceRate,
                },
            });

            setConnectionDetails(null);
            setFiles({});
        } catch (error) {
            console.error(
                "Water Register Submit Error:",
                error
            );

            Swal.close();

            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text:
                    error?.response?.data?.error ||
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to save water register",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const documentHeaders = [
        "Sr. No.",
        "Document",
        "Type",
        "Upload",
        "Status",
    ];

    const documentKeyMapping = {
        "Sr. No.": "srNo",
        Document: "docName",
        Type: "docType",
        Upload: "upload",
        Status: "status",
    };

    const documentData = documents.map((item, index) => ({
        ...item,
        srNo: index + 1,
        docName: item.DOCNAME,
        docType: item.DOCTYPE,
        upload: item.DOCID,
        status: files[item.DOCID]
            ? "Uploaded"
            : "Required",
    }));

    return (
        <div className="w-full bg-[#f4f7fb] p-3 sm:p-4 md:p-5">
            <div className="mx-auto w-full max-w-[1600px] overflow-hidden rounded-lg border bg-white shadow-sm">
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        setFieldValue,
                        resetForm,
                    }) => (
                        <Form>
                            <div className="bg-[#083c76] px-4 py-3 sm:px-6">
                                <h1 className="text-center text-lg font-bold text-white">
                                    {serviceDisplayName ||
                                        "Reconnection"}
                                </h1>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>Zone :</Label>
                                        <Select
                                            value={
                                                values.zoneId
                                            }
                                            onValueChange={(
                                                value
                                            ) =>
                                                setFieldValue(
                                                    "zoneId",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Zone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {zones.map(
                                                    (
                                                        item
                                                    ) => (
                                                        <SelectItem
                                                            key={
                                                                item.WARDID
                                                            }
                                                            value={String(
                                                                item.WARDID
                                                            )}
                                                        >
                                                            {
                                                                item.WARDNAME
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            Service Type :
                                        </Label>
                                        <Select
                                            value={
                                                values.serviceId
                                            }
                                            onValueChange={(
                                                value
                                            ) =>
                                                setFieldValue(
                                                    "serviceId",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {services.map(
                                                    (
                                                        item
                                                    ) => (
                                                        <SelectItem
                                                            key={
                                                                item.NUM_SERVICE_SERVICEID
                                                            }
                                                            value={String(
                                                                item.NUM_SERVICE_SERVICEID
                                                            )}
                                                        >
                                                            {
                                                                item.VAR_SERVICE_ENG_NAME
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            Consumer No :
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={
                                                    values.consumerNo
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFieldValue(
                                                        "consumerNo",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                placeholder="Enter Consumer No"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    searchConnection(
                                                        values.consumerNo,
                                                        setFieldValue
                                                    )
                                                }
                                                disabled={
                                                    searching
                                                }
                                            >
                                                {searching
                                                    ? "..."
                                                    : "Search"}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            Disconnection Type :
                                        </Label>
                                        <Select
                                            value={
                                                values.disConId
                                            }
                                            onValueChange={(
                                                value
                                            ) =>
                                                setFieldValue(
                                                    "disConId",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {disconnectionTypes.map(
                                                    (
                                                        item
                                                    ) => (
                                                        <SelectItem
                                                            key={
                                                                item.NUM_DISCONN_ID
                                                            }
                                                            value={String(
                                                                item.NUM_DISCONN_ID
                                                            )}
                                                        >
                                                            {
                                                                item.VAR_DISCONN_NAME
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            Usage Type :
                                        </Label>
                                        <Select
                                            value={
                                                values.usageTypeId
                                            }
                                            onValueChange={(
                                                value
                                            ) =>
                                                setFieldValue(
                                                    "usageTypeId",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Usage Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {usageTypes.map(
                                                    (
                                                        item
                                                    ) => (
                                                        <SelectItem
                                                            key={
                                                                item.NUM_USAGETYPE_ID
                                                            }
                                                            value={String(
                                                                item.NUM_USAGETYPE_ID
                                                            )}
                                                        >
                                                            {
                                                                item.VAR_USAGETYPE_NAME
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            New Connection Size :
                                        </Label>
                                        <Select
                                            value={
                                                values.connSize
                                            }
                                            onValueChange={(
                                                value
                                            ) =>
                                                setFieldValue(
                                                    "connSize",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Size" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {connectionSizes.map(
                                                    (
                                                        item
                                                    ) => (
                                                        <SelectItem
                                                            key={
                                                                item.NUM_CONNSIZE_ID
                                                            }
                                                            value={String(
                                                                item.NUM_CONNSIZE_ID
                                                            )}
                                                        >
                                                            {
                                                                item.NUM_CONNSIZE_SIZE
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            Tariff Rate :
                                        </Label>
                                        <Input
                                            type="number"
                                            value={
                                                values.tarifRate
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setFieldValue(
                                                    "tarifRate",
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder="Enter Tariff Rate"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            Reason :
                                        </Label>
                                        <Input
                                            value={
                                                values.reason
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setFieldValue(
                                                    "reason",
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder="Enter Reason"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            Date :
                                        </Label>
                                        <Input
                                            type="date"
                                            value={
                                                values.erlDate
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setFieldValue(
                                                    "erlDate",
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="md:col-span-2 xl:col-span-3">
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                            <Label>
                                                Remark :
                                            </Label>
                                            <Input
                                                value={
                                                    values.remark
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFieldValue(
                                                        "remark",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                placeholder="Enter Remark"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t p-4 sm:p-6">
                                <h2 className="mb-4 border-b pb-2 text-sm font-semibold text-gray-700 sm:text-base">
                                    Existing Connection Details
                                </h2>

                                {connectionDetails ? (
                                    <pre className="max-h-80 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
                                        {JSON.stringify(
                                            connectionDetails,
                                            null,
                                            2
                                        )}
                                    </pre>
                                ) : (
                                    <div className="rounded-md bg-gray-50 p-4 text-center text-sm text-gray-500">
                                        Enter Consumer No and click Search to fetch connection details.
                                    </div>
                                )}
                            </div>

                            <div className="border-t p-4 sm:p-6">
                                <h2 className="mb-4 border-b pb-2 text-sm font-semibold text-gray-700 sm:text-base">
                                    Applicant Details
                                </h2>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            Applicant Name :
                                        </Label>
                                        <Input
                                            value={
                                                values.detAppliName
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setFieldValue(
                                                    "detAppliName",
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder="Enter Applicant Name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            Mobile :
                                        </Label>
                                        <Input
                                            value={
                                                values.detMobile
                                            }
                                            maxLength={10}
                                            onChange={(
                                                e
                                            ) =>
                                                setFieldValue(
                                                    "detMobile",
                                                    e.target.value
                                                        .replace(
                                                            /\D/g,
                                                            ""
                                                        )
                                                        .slice(
                                                            0,
                                                            10
                                                        )
                                                )
                                            }
                                            placeholder="Enter Mobile Number"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            Aadhaar :
                                        </Label>
                                        <Input
                                            value={
                                                values.detAadhaar
                                            }
                                            maxLength={12}
                                            onChange={(
                                                e
                                            ) =>
                                                setFieldValue(
                                                    "detAadhaar",
                                                    e.target.value
                                                        .replace(
                                                            /\D/g,
                                                            ""
                                                        )
                                                        .slice(
                                                            0,
                                                            12
                                                        )
                                                )
                                            }
                                            placeholder="Enter Aadhaar Number"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                        <Label>
                                            Email :
                                        </Label>
                                        <Input
                                            value={
                                                values.detEmail
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setFieldValue(
                                                    "detEmail",
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder="Enter Email"
                                        />
                                    </div>

                                    <div className="md:col-span-2 xl:col-span-3">
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[145px_minmax(0,1fr)] sm:items-center">
                                            <Label>
                                                Address :
                                            </Label>
                                            <Input
                                                value={
                                                    values.detAddress
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFieldValue(
                                                        "detAddress",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                placeholder="Enter Address"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t p-4 sm:p-6">
                                <h2 className="mb-4 border-b pb-2 text-sm font-semibold text-gray-700 sm:text-base">
                                    Document Upload
                                </h2>

                                <ShadCNTable
                                    headers={
                                        documentHeaders
                                    }
                                    data={
                                        documentData
                                    }
                                    keyMapping={
                                        documentKeyMapping
                                    }
                                    pagination={false}
                                    className="max-h-95"
                                    columnStyles={{
                                        "Sr. No.": {
                                            width: "80px",
                                        },
                                        Document: {
                                            width: "35%",
                                        },
                                        Type: {
                                            width: "100px",
                                        },
                                        Upload: {
                                            width: "30%",
                                        },
                                        Status: {
                                            width: "130px",
                                        },
                                    }}
                                />
                            </div>

                            {documents.length > 0 && (
                                <div className="border-t p-4 sm:p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <tbody>
                                                {documents.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (
                                                        <tr
                                                            key={
                                                                item.DOCID
                                                            }
                                                            className="border-b"
                                                        >
                                                            <td className="p-2 text-center">
                                                                {index +
                                                                    1}
                                                            </td>
                                                            <td className="p-2">
                                                                {
                                                                    item.DOCNAME
                                                                }
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                {
                                                                    item.DOCTYPE
                                                                }
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    type="file"
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleFileChange(
                                                                            e,
                                                                            item
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                {files[
                                                                    item
                                                                        .DOCID
                                                                ] ? (
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            removeFile(
                                                                                item.DOCID
                                                                            )
                                                                        }
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        Required
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {payFlag && (
                                <div className="border-t px-4 py-4 sm:px-6">
                                    <div className="rounded-md bg-gray-50 px-4 py-3 text-sm">
                                        <span className="font-semibold">
                                            Payment Required :
                                        </span>{" "}
                                        {payFlag === "Y"
                                            ? "Yes"
                                            : "No"}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col items-center justify-center gap-3 border-t p-4 sm:flex-row sm:p-6">
                                <Button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        submitting
                                    }
                                    onClick={() => {
                                        resetForm();
                                        setConnectionDetails(
                                            null
                                        );
                                        setFiles({});
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default FrmWaterRegister;