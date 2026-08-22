import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ShadCNTable from "@/components/ui/table";

const FrmWaterRegister = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const state = location.state || {};
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const ulbId = state.ulbId ?? user?.ulbId ?? 3;
    const userId = state.userId ?? user?.userId ?? 151;
    const serviceId = state.serviceId ?? user?.serviceId ?? 21;
    const source = state.source ?? "WEB";
    const [serviceName, setServiceName] = useState(state.serviceName ?? "Reconnection");
    const [wards, setWards] = useState([]);
    const [services, setServices] = useState([]);
    const [disconnectionTypes, setDisconnectionTypes] = useState([]);
    const [usageTypes, setUsageTypes] = useState([]);
    const [connectionSizes, setConnectionSizes] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [consumerSearch, setConsumerSearch] = useState("");
    const [searching, setSearching] = useState(false);
    const [form, setForm] = useState({
        zoneId: "",
        serviceId: String(serviceId),
        consumerNo: "",
        disConId: "",
        reason: "",
        usageTypeId: "",
        tarifRate: "",
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
        erlDate: new Date().toISOString().split("T")[0]
    });

    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const loadMasters = useCallback(async () => {
        Swal.fire({
            title: "Loading...",
            text: "Please wait",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const results = await Promise.allSettled([
            axios.get(`${baseUrl}/api/FrmWaterRegister/ward-dropdown`, {
                params: { ulbid: Number(ulbId) },
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${baseUrl}/api/FrmWaterRegister/service-dropdown`, {
                params: { rptMode: 4 },
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${baseUrl}/api/FrmWaterRegister/disconnection-dropdown`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${baseUrl}/api/FrmWaterRegister/usage-type-dropdown`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${baseUrl}/api/FrmWaterRegister/connection-size-dropdown`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${baseUrl}/api/FrmWaterRegister/service-name`, {
                params: { serviceId: Number(serviceId) },
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${baseUrl}/api/FrmWaterRegister/documents`, {
                params: { ulbid: Number(ulbId), serviceId: Number(serviceId) },
                headers: { Authorization: `Bearer ${token}` }
            })
        ]);

        Swal.close();

        const getData = (result) => result.status === "fulfilled" ? result.value?.data?.data?.data || [] : [];

        setWards(getData(results[0]));
        setServices(getData(results[1]));
        setDisconnectionTypes(getData(results[2]));
        setUsageTypes(getData(results[3]));
        setConnectionSizes(getData(results[4]));

        const serviceData = getData(results[5]);
        if (serviceData.length) {
            setServiceName(serviceData[0]?.VAR_SERVICE_ENG_NAME || "Reconnection");
        }

        setDocuments(getData(results[6]).map((item) => ({ ...item, file: null })));
    }, [baseUrl, serviceId, token, ulbId]);

    useEffect(() => {
        loadMasters();
    }, [loadMasters]);

    const fetchConnectionDetails = async () => {
        const consumerNo = consumerSearch.trim();

        if (!consumerNo) {
            Swal.fire("Required", "Please enter Consumer No.", "warning");
            return;
        }

        setSearching(true);

        try {
            const response = await axios.get(`${baseUrl}/api/FrmWaterRegister/connection-details`, {
                params: { consumerNo, userId: Number(userId) },
                headers: { Authorization: `Bearer ${token}` }
            });

            const details = response?.data?.data?.connectionOwners;

            if (!details) {
                Swal.fire("Not Found", "Connection details not found.", "warning");
                return;
            }

            const usageMatch = usageTypes.find(
                (item) => String(item.VAR_USAGETYPE_NAME || "").trim().toLowerCase() === String(details.usage_type || "").trim().toLowerCase()
            );

            const sizeMatch = connectionSizes.find(
                (item) => Number(item.NUM_CONNSIZE_SIZE) === Number(details.connsize_size)
            );

            const zoneMatch = wards.find(
                (item) => String(item.WARDNAME || "").trim().toLowerCase() === String(details.zone_name || "").trim().toLowerCase()
            );

            setForm((prev) => ({
                ...prev,
                consumerNo: details.connno || consumerNo,
                zoneId: zoneMatch ? String(zoneMatch.WARDID) : prev.zoneId,
                ownerName: details.owner || "",
                usageType: details.usage_type || "",
                tarifRate: details.rate ?? "",
                connSize: sizeMatch ? String(sizeMatch.NUM_CONNSIZE_ID) : prev.connSize,
                usageTypeId: usageMatch ? String(usageMatch.NUM_USAGETYPE_ID) : prev.usageTypeId,
                detAppliName: details.owner || "",
                detAddress: details.address?.trim() || "",
                conAddressSrch: details.address?.trim() || "",
                ownerNameSrch: details.owner || "",
                curConSizeSrch: details.connsize_size != null ? String(details.connsize_size) : "",
                usageTypeNewSrch: details.usage_type || ""
            }));

            Swal.fire({
                icon: "success",
                title: "Connection Found",
                text: "Connection details fetched successfully.",
                timer: 1200,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire("Error", error?.response?.data?.message || "Unable to fetch connection details.", "error");
        } finally {
            setSearching(false);
        }
    };

    const handleUsageTypeChange = (value) => {
        const selected = usageTypes.find((item) => String(item.NUM_USAGETYPE_ID) === String(value));
        setForm((prev) => ({
            ...prev,
            usageTypeId: value,
            usageType: selected?.VAR_USAGETYPE_NAME || "",
            usageTypeNewSrch: selected?.VAR_USAGETYPE_NAME || ""
        }));
    };

    const handleConnectionSizeChange = (value) => {
        setForm((prev) => ({ ...prev, connSize: value }));
    };

    const handleFileChange = (documentId, file) => {
        if (!file) return;

        const extension = file.name.split(".").pop()?.toLowerCase();

        if (!["jpg", "jpeg", "png", "pdf"].includes(extension)) {
            Swal.fire("Invalid File", "Only JPG, JPEG, PNG and PDF files are allowed.", "warning");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire("Invalid File", "File size should not exceed 5 MB.", "warning");
            return;
        }

        setDocuments((prev) =>
            prev.map((item) => String(item.DOCID) === String(documentId) ? { ...item, file } : item)
        );
    };

    const uploadDocument = async (appNo, document) => {
        const formData = new FormData();
        formData.append("corpid", String(ulbId));
        formData.append("serviceid", String(serviceId));
        formData.append("appno", appNo);
        formData.append("doctype", document.DOCTYPE || "A");
        formData.append("documentid", String(document.DOCID));
        formData.append("file", document.file);

        return axios.post(`${baseUrl}/api/FrmWaterRegister/upload-document`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    };

    const formatOracleDate = (date) => {
        if (!date) return null;

        const [year, month, day] = date.split("-");

        const months = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        return `${day}-${months[Number(month) - 1]}-${year}`;
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.detAppliName.trim()) {
        Swal.fire("Required", "Please enter Applicant Name.", "warning");
        return;
    }

    if (!/^\d{10}$/.test(form.detMobile)) {
        Swal.fire("Invalid", "Please enter valid 10 digit Mobile No.", "warning");
        return;
    }

    if (!/^\d{12}$/.test(form.detAadhaar)) {
        Swal.fire("Invalid", "Please enter valid 12 digit Aadhar No.", "warning");
        return;
    }

    if (!form.detEmail.trim()) {
        Swal.fire("Required", "Please enter Email.", "warning");
        return;
    }

    if (!form.detAddress.trim()) {
        Swal.fire("Required", "Please enter Address.", "warning");
        return;
    }

    if (!form.zoneId) {
        Swal.fire("Required", "Please select Zone.", "warning");
        return;
    }

    if (!form.consumerNo.trim()) {
        Swal.fire("Required", "Please enter Consumer No.", "warning");
        return;
    }

    if (!form.usageTypeId) {
        Swal.fire("Required", "Please select Usage Type.", "warning");
        return;
    }

    if (!form.connSize) {
        Swal.fire("Required", "Please select Connection Size.", "warning");
        return;
    }

    if (!form.disConId) {
        Swal.fire("Required", "Please select Disconnection Type.", "warning");
        return;
    }

    if (!form.reason.trim()) {
        Swal.fire("Required", "Please enter Reason.", "warning");
        return;
    }

    if (!form.remark.trim()) {
        Swal.fire("Required", "Please enter Remark.", "warning");
        return;
    }

    if (!form.erlDate) {
        Swal.fire("Required", "Please select Earlier Connection Close Date.", "warning");
        return;
    }

    if (!documents.length) {
        Swal.fire(
            "Document Required",
            "No documents are configured for this service.",
            "warning"
        );
        return;
    }

    const missingDocuments = documents.filter((item) => !item.file);

    if (missingDocuments.length > 0) {
        Swal.fire(
            "Document Required",
            "Please upload all required documents before submission.",
            "warning"
        );
        return;
    }

    const payload = {
        userId: Number(userId),
        wtregId: 0,
        servId: Number(form.serviceId),
        consNo: form.consumerNo.trim(),
        disConId: Number(form.disConId),
        reason: form.reason.trim(),
        usageTypeId: Number(form.usageTypeId),
        tarifRate: Number(form.tarifRate || 0),
        connSize: Number(form.connSize),
        remark: form.remark.trim(),
        ulbid: Number(ulbId),
        zoneId: Number(form.zoneId),
        source,
        ownerName: form.ownerName,
        usageType: form.usageType,
        detAppliName: form.detAppliName.trim(),
        detMobile: Number(form.detMobile),
        detAadhaar: form.detAadhaar.trim(),
        detEmail: form.detEmail.trim(),
        detAddress: form.detAddress.trim(),
        conAddressSrch: form.conAddressSrch,
        ownerNameSrch: form.ownerNameSrch,
        curConSizeSrch: form.curConSizeSrch,
        usageTypeNewSrch: form.usageTypeNewSrch,
        erlDate: formatOracleDate(form.erlDate)
    };

    try {
        Swal.fire({
            title: "Submitting...",
            text: "Saving water register application",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const response = await axios.post(
            `${baseUrl}/api/FrmWaterRegister/save-water-register`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        Swal.close();

        const result = response?.data?.data;

        if (!result?.success || Number(result?.errorCode) !== 9999) {
            Swal.fire(
                "Error",
                result?.message || "Unable to save water register.",
                "error"
            );
            return;
        }

        const message = result.message || "";

        const appNo =
            message
                .split("Appli no:")[1]
                ?.split("$")[0]
                ?.trim() || "";

        if (!appNo) {
            Swal.fire(
                "Warning",
                "Application saved but Application No. was not returned.",
                "warning"
            );
            return;
        }

        Swal.fire({
            title: "Uploading Documents...",
            text: "Please wait while documents are being uploaded",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const uploadResults = await Promise.allSettled(
            documents.map((document) => uploadDocument(appNo, document))
        );

        Swal.close();

        const failedUploads = uploadResults.filter(
            (item) => item.status === "rejected"
        );

        if (failedUploads.length > 0) {
            console.error("Document Upload Errors:", failedUploads);

            Swal.fire(
                "Upload Failed",
                `${failedUploads.length} document(s) could not be uploaded. Application No: ${appNo}`,
                "error"
            );
            return;
        }

        await Swal.fire({
            icon: "success",
            title: "Application Submitted",
            text: message,
            confirmButtonText: "OK"
        });

        resetForm();
    } catch (error) {
        Swal.close();

        console.error("Water Register Submit Error:", error);

        Swal.fire(
            "Error",
            error?.response?.data?.message ||
                "Unable to save water register.",
            "error"
        );
    }
};

    const resetForm = () => {
        setConsumerSearch("");
        setForm({
            zoneId: "",
            serviceId: String(serviceId),
            consumerNo: "",
            disConId: "",
            reason: "",
            usageTypeId: "",
            tarifRate: "",
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
            erlDate: new Date().toISOString().split("T")[0]
        });
        setDocuments((prev) => prev.map((item) => ({ ...item, file: null })));
    };

    const tableData = documents.map((item, index) => ({
        srNo: index + 1,
        documentName: item.DOCNAME,
        image: (
            <Input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange(item.DOCID, e.target.files?.[0])}
                className="h-9 w-full cursor-pointer"
            />
        )
    }));

    return (
        <div className="w-full bg-[#f4f7fb] p-3 sm:p-4">
            <div className="mx-auto w-full max-w-[1600px] rounded-lg bg-white shadow-sm">
                <div className="border-b border-gray-200 px-4 py-3">
                    <h1 className="text-lg font-semibold text-[#083c76] sm:text-xl">{serviceName}</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-4 sm:p-5">
                    <div className="grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                <Label text="Applicant Name" required className="min-w-fit" />
                                <span>:</span>
                            </div>
                            <Input value={form.detAppliName} onChange={(e) => updateField("detAppliName", e.target.value)} className="w-full" placeholder="Enter Applicant Name" />
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                <Label text="Mobile No" required className="min-w-fit" />
                                <span>:</span>
                            </div>
                            <Input value={form.detMobile} maxLength={10} inputMode="numeric" onChange={(e) => updateField("detMobile", e.target.value.replace(/\D/g, ""))} className="w-full" placeholder="Enter Mobile No" />
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                <Label text="Aadhar No" required className="min-w-fit" />
                                <span>:</span>
                            </div>
                            <Input value={form.detAadhaar} maxLength={12} inputMode="numeric" onChange={(e) => updateField("detAadhaar", e.target.value.replace(/\D/g, ""))} className="w-full" placeholder="Enter Aadhar No" />
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                <Label text="Email" required className="min-w-fit" />
                                <span>:</span>
                            </div>
                            <Input type="email" value={form.detEmail} onChange={(e) => updateField("detEmail", e.target.value)} className="w-full" placeholder="Enter Email" />
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4 md:col-span-2">
                            <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                <Label text="Address" required className="min-w-fit" />
                                <span>:</span>
                            </div>
                            <Textarea value={form.detAddress} onChange={(e) => updateField("detAddress", e.target.value)} className="min-h-20 w-full" placeholder="Enter Address" />
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                <Label text="Zone" required className="min-w-fit" />
                                <span>:</span>
                            </div>
                            <Select value={form.zoneId} onValueChange={(value) => updateField("zoneId", value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="-- Select Zone --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wards.map((item) => (
                                        <SelectItem key={item.WARDID} value={String(item.WARDID)}>{item.WARDNAME}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                <Label text="Service Type" required className="min-w-fit" />
                                <span>:</span>
                            </div>
                            <Select value={form.serviceId} disabled>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="-- Select Service --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map((item) => (
                                        <SelectItem key={item.NUM_SERVICE_SERVICEID} value={String(item.NUM_SERVICE_SERVICEID)}>{item.VAR_SERVICE_ENG_NAME}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                <Label text="Consumer No" required className="min-w-fit" />
                                <span>:</span>
                            </div>
                            <div className="flex w-full gap-2">
                                <Input value={consumerSearch} onChange={(e) => setConsumerSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), fetchConnectionDetails())} className="w-full" placeholder="Enter Consumer No" />
                                <Button type="button" onClick={fetchConnectionDetails} disabled={searching} className="shrink-0 bg-[#083c76] hover:bg-[#062f5d]">{searching ? "..." : "Search"}</Button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 md:col-span-2">
                                <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                    <Label text="Consumer Address" className="min-w-fit" />
                                    <span>:</span>
                                </div>
                                <Textarea value={form.conAddressSrch} onChange={(e) => updateField("conAddressSrch", e.target.value)} className="min-h-17 w-full" />
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                    <Label text="Owner Name" className="min-w-fit" />
                                    <span>:</span>
                                </div>
                                <Input value={form.ownerName} onChange={(e) => updateField("ownerName", e.target.value)} className="w-full" />
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                    <Label text="Current Conn. Size" className="min-w-fit" />
                                    <span>:</span>
                                </div>
                                <Input value={form.curConSizeSrch} onChange={(e) => updateField("curConSizeSrch", e.target.value)} className="w-full" />
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                    <Label text="Usage Type" className="min-w-fit" />
                                    <span>:</span>
                                </div>
                                <Input value={form.usageType} onChange={(e) => updateField("usageType", e.target.value)} className="w-full" />
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                    <Label text="Earlier Conn. Close Date" required className="min-w-fit" />
                                    <span>:</span>
                                </div>
                                <Input type="date" value={form.erlDate} onChange={(e) => updateField("erlDate", e.target.value)} className="w-full" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                    <Label text="Changes Usage Type" className="min-w-fit" />
                                    <span>:</span>
                                </div>
                                <Select value={form.usageTypeId} onValueChange={handleUsageTypeChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- Select Usage Type --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {usageTypes.map((item) => (
                                            <SelectItem key={item.NUM_USAGETYPE_ID} value={String(item.NUM_USAGETYPE_ID)}>{item.VAR_USAGETYPE_NAME}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                    <Label text="New Conn Size" className="min-w-fit" />
                                    <span>:</span>
                                </div>
                                <Select value={form.connSize} onValueChange={handleConnectionSizeChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- Select Connection Size --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {connectionSizes.map((item) => (
                                            <SelectItem key={item.NUM_CONNSIZE_ID} value={String(item.NUM_CONNSIZE_ID)}>{item.NUM_CONNSIZE_SIZE}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                    <Label text="Disconnection Type" className="min-w-fit" />
                                    <span>:</span>
                                </div>
                                <Select value={form.disConId} onValueChange={(value) => updateField("disConId", value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- Select Disconnection Type --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {disconnectionTypes.map((item) => (
                                            <SelectItem key={item.NUM_DISCONN_ID} value={String(item.NUM_DISCONN_ID)}>{item.VAR_DISCONN_NAME}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                    <Label text="Tariff Rate" className="min-w-fit" />
                                    <span>:</span>
                                </div>
                                <Input type="number" value={form.tarifRate} onChange={(e) => updateField("tarifRate", e.target.value)} className="w-full" />
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 md:col-span-2">
                                <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                    <Label text="Reason" className="min-w-fit" />
                                    <span>:</span>
                                </div>
                                <Input value={form.reason} onChange={(e) => updateField("reason", e.target.value)} className="w-full" placeholder="Enter Reason" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex shrink-0 items-center sm:w-40 sm:justify-between">
                                <Label text="Remark" required className="min-w-fit" />
                                <span>:</span>
                            </div>
                            <Textarea value={form.remark} onChange={(e) => updateField("remark", e.target.value)} className="min-h-20 w-full" placeholder="Enter Remark" />
                        </div>
                    </div>

                    {documents.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                            <ShadCNTable
                                headers={["Sr. No.", "Document Name", "Image(jpg,png,pdf)"]}
                                data={tableData}
                                keyMapping={{
                                    "Sr. No.": "srNo",
                                    "Document Name": "documentName",
                                    "Image(jpg,png,pdf)": "image"
                                }}
                                pagination={false}
                            />
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Button type="submit" className="bg-[#083c76] hover:bg-[#062f5d]">Submit</Button>
                        <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
                        <Button type="button" variant="outline" onClick={() => navigate(-1)}>Back</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FrmWaterRegister;