import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, FileText, Download, Search, Building2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { selectedDepartment } = useOutletContext();
    const ulbId = user?.ulbId;

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [downloadDocs, setDownloadDocs] = useState([]);
    const [search, setSearch] = useState("");
    const [mobileDetails, setMobileDetails] = useState(false);

    const showLoader = (title) => {
        Swal.fire({
            title,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    };

    useEffect(() => {
        if (!selectedDepartment) {
            setServices([]);
            setSelectedService(null);
            setDocuments([]);
            setDownloadDocs([]);
            return;
        }

        const fetchServices = async () => {
            setSelectedService(null);
            setServices([]);
            setDocuments([]);
            setDownloadDocs([]);
            setSearch("");
            setMobileDetails(false);

            showLoader("Loading services...");

            try {
                const res = await axios.get(`${BASE_URL}/api/Dashboard/services-by-dept`,
                    { params: { ulbid: ulbId, deptId: selectedDepartment.id } }
                );

                const data = res.data?.data?.data || [];

                const mappedServices = data.map((item) => ({
                    id: item.NUM_SERVICE_SERVICEID,
                    name: item.DISPLAYNAME,
                    departmentId: item.NUM_DEPT_ID,
                    departmentName: item.VAR_DEPT_ENGNAME,
                }));

                setServices(mappedServices);
            } catch (error) {
                console.error("Services fetch error:", error);

                setServices([]);

                await Swal.fire({
                    icon: "error",
                    text: error?.response?.data?.message || error?.response?.data?.error || "Unable to fetch services.",
                });
            } finally {
                if (Swal.isVisible()) {
                    Swal.close();
                }
            }
        };

        fetchServices();
    }, [selectedDepartment, ulbId]);

    const handleServiceSelect = async (service) => {
        setSelectedService(service);
        setDocuments([]);
        setDownloadDocs([]);
        setMobileDetails(true);

        showLoader("Loading documents...");

        try {
            const [documentsResponse, downloadResponse] = await Promise.allSettled([
                axios.get(`${BASE_URL}/api/Dashboard/documents-for-service`,
                    { params: { serviceId: service.id, ulbid: ulbId } }
                ),
                axios.get(`${BASE_URL}/api/Dashboard/download-docs`,
                    { params: { serviceName: service.id, ulbid: ulbId } }
                ),
            ]);

            if (documentsResponse.status === "fulfilled") {
                const documentData = documentsResponse.value?.data?.data?.data || [];

                const mappedDocuments = documentData.filter((item) => item?.VAR_DOC_ENGNAME).map((item, index) => ({
                    id: item.NUM_SERDOC_SERVID || item.NUM_SERVICE_SERVICEID || index,
                    name: item.VAR_DOC_ENGNAME,
                }));

                setDocuments(mappedDocuments);
            } else {
                console.error("Documents API error:", documentsResponse.reason);
                setDocuments([]);
            }

            if (downloadResponse.status === "fulfilled") {
                const downloadData = downloadResponse.value?.data?.data?.data || [];

                const mappedDownloadDocs = downloadData.map((item, index) => ({
                    id: item.DOCID || index,
                    name: item.DOCNAME || item.VAR_DOWNLAODOC_SERVNAME || "Document",
                    serviceName: item.VAR_DOWNLAODOC_SERVNAME,
                    ulbid: item.NUM_DOWNLAODOC_ULBID,
                }));

                setDownloadDocs(mappedDownloadDocs);
            } else {
                console.error("Download documents API error:", downloadResponse.reason);
                setDownloadDocs([]);
            }
        } catch (error) {
            console.error("Document loading error:", error);

            setDocuments([]);
            setDownloadDocs([]);
        } finally {
            if (Swal.isVisible()) {
                Swal.close();
            }
        }
    };

    const filteredServices = useMemo(() => {
        if (!search.trim()) {
            return services;
        }

        const value = search.toLowerCase();

        return services.filter((service) => service.name?.toLowerCase().includes(value));
    }, [services, search]);

    const handleApply = () => {
        if (!selectedDepartment || !selectedService) {
            return;
        }

        navigate("/login", {
            state: {
                ulbId,
                deptId: selectedDepartment.id,
                serviceId: selectedService.id,
            },
        });
    };

    const handleDownload = (document) => {
        if (!document?.id) {
            return;
        }

        console.log("Download document:", document);
    };

    return (
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden bg-[#f4f7fb]">

            <section className={`flex min-h-0 min-w-0 flex-1 flex-col border-r bg-white ${mobileDetails ? "hidden md:flex" : "flex"}`}>
                <div className="shrink-0 border-b bg-[#080080] px-4 py-2">
                    <h2 className="truncate text-center text-sm font-bold text-white">{selectedDepartment?.name || "Department Services"}</h2>
                </div>

                <div className="shrink-0 border-b bg-white p-3">
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <Input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search service..."
                            disabled={!selectedDepartment}
                            className="h-9 pl-9 text-xs"
                        />
                    </div>
                </div>

                <ScrollArea className="min-h-0 flex-1">
                    <div className="p-3">
                        {!selectedDepartment ? (
                            <div className="py-20 text-center">
                                <Building2 size={35} className="mx-auto mb-2 text-gray-300" />
                                <p className="text-sm text-gray-400"> Select a department</p>
                            </div>
                        ) : filteredServices.length === 0 ? (
                            <div className="py-20 text-center">
                                <FileText size={35} className="mx-auto mb-2 text-gray-300" />
                                <p className="text-sm text-gray-400"> No services found</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredServices.map(
                                    (service, index) => {
                                        const active = selectedService?.id === service.id;
                                        return (
                                            <motion.button
                                                key={service.id}
                                                type="button"
                                                onClick={() =>
                                                    handleServiceSelect(service)
                                                }
                                                whileHover={{ x: 3 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`group flex w-full items-start gap-2 rounded-md border-b px-2 py-2.5 text-left ${active ? "bg-blue-50" : "hover:bg-blue-50"}`}
                                            >
                                                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${active ? "bg-[#184aa6] text-white" : "bg-gray-100 text-gray-500"}`}>
                                                    {index + 1}
                                                </span>

                                                <div className="min-w-0 flex-1">
                                                    <p className={`text-xs font-medium leading-5 ${active ? "text-[#184aa6]" : "text-gray-700"}`}>
                                                        {service.name}
                                                    </p>
                                                </div>

                                                <ChevronRight size={15} className="mt-1 shrink-0 text-gray-300" />
                                            </motion.button>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </section>

            <section className={`flex min-h-0 min-w-0 flex-1 flex-col bg-[#f8fafc] ${!mobileDetails ? "hidden md:flex" : "flex"}`}>
                <div className="flex shrink-0 items-center border-b bg-[#080080] px-3 py-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            setMobileDetails(false)
                        }
                        className="mr-2 h-7 w-7 text-white hover:bg-white/10 hover:text-white md:hidden"
                    >
                        <ArrowLeft size={16} />
                    </Button>

                    <h2 className="flex-1 text-center text-sm font-bold text-white">Service Details</h2>
                    <div className="w-7 md:hidden" />
                </div>

                <ScrollArea className="min-h-0 flex-1">
                    <div className="space-y-4 p-3 sm:p-4">
                        <Card className="border-blue-100 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-[#184aa6]">{selectedService?.name || "Select a service"}</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="text-xs leading-5 text-gray-600"> {selectedService ? "Documents required for this service." : "Select a service to view documents."} </p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Documents Required</CardTitle>
                            </CardHeader>

                            <CardContent>
                                {!selectedService ? (
                                    <div className="rounded-md border border-dashed p-4 text-center">
                                        <FileText size={28} className="mx-auto mb-2 text-gray-300" />
                                        <p className="text-xs text-gray-400">Select a service to view documents.</p>
                                    </div>
                                ) : documents.length === 0 ? (
                                    <div className="rounded-md border border-dashed p-4 text-center">
                                        <FileText size={28} className="mx-auto mb-2 text-gray-300" />
                                        <p className="text-xs text-gray-400">No documents specified.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {documents.map(
                                            (document, index) => (
                                                <div
                                                    key={document.id || index}
                                                    className="flex items-start gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
                                                >
                                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#184aa6] text-[10px] font-bold text-white">
                                                        {index + 1}
                                                    </span>

                                                    <span className="text-xs leading-5 text-gray-600">
                                                        {document.name}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {selectedService &&
                            downloadDocs.length > 0 && (
                                <Card className="border-gray-200 shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Download Documents</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-2">
                                            {downloadDocs.map(
                                                (document, index) => (
                                                    <div
                                                        key={document.id || index}
                                                        className="flex items-center gap-2 rounded-md border bg-white px-3 py-2"
                                                    >
                                                        <FileText size={16} className="shrink-0 text-[#184aa6]" />
                                                        <span className="min-w-0 flex-1 truncate text-xs text-gray-600"> {document.name}</span>

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDownload(document)
                                                            }
                                                            className="h-7 shrink-0 text-xs"
                                                        >
                                                            <Download size={13} />
                                                            Download
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                onClick={handleApply}
                                disabled={!selectedDepartment || !selectedService}
                                className="bg-[#184aa6] text-xs hover:bg-blue-900"
                            >
                                Apply Now
                                <ChevronRight size={15} />
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </section>
        </div>
    );
};

export default LandingPage;