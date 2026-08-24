import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import DepartmentSidebar from "@/components/DepartmentSidebar";
import {
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ULB3_DEPARTMENTS = [
    { id: 1, key: "BirthDeath", name: "Birth & Death" },
    { id: 7, key: "Property", name: "Property" },
    { id: 23, key: "Town Planning", name: "Town Planning" },
    { id: 18, key: "Market", name: "Market" },
    { id: 25, key: "Marraige", name: "Marriage" },
    { id: 10, key: "FireBrigade", name: "Fire Brigade" },
    { id: 290, key: "NOC", name: "NOC" },
    { id: 1901, key: "Bombay Nursing", name: "Bombay Nursing" },
    { id: 24, key: "Water", name: "Water" },
    { id: 841, key: "TradeLicense", name: "Trade License" },
    { id: 26, key: "PWD", name: "PWD" },
    { id: 1041, key: "Sewerage", name: "Sewerage" },
    { id: 503, key: "Health", name: "Health" },
    { id: 1042, key: "TreeCutting", name: "Tree Cutting" },
    { id: 725, key: "InformationRelations", name: "Information Relations" },
    { id: 689, key: "Encroachment", name: "Encroachment" },
    { id: 683, key: "SolidWaste", name: "Solid Waste" },
    { id: 3, key: "Advertisement", name: "Advertisement" },
];

const Layout = () => {
    const { user, requestInitialized } = useAuth();
    const ulbId = Number(user?.ulbId) || 3;
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    useEffect(() => {
        if (!requestInitialized) {
            return;
        }

        const fetchDepartments = async () => {
            if (ulbId === 3) {
                setDepartments(ULB3_DEPARTMENTS.map((department) => ({...department, icon: Building2, ulbId: 3})));
                return;
            }

            Swal.fire({
            title: "Loading departments..",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

            try {
                const res = await axios.get(
                    `${BASE_URL}/api/Dashboard/department-menu`,
                    {
                      params: {ulbid: ulbId},
                    }
                );

                const data = res.data?.data?.data || [];

                const mappedDepartments =
                    data.map((item) => ({
                        id: item.DEPTID,
                        name: item.ACCORNAME || item.DEPTNAME,
                        icon: Building2,
                        seqId: item.SEQID,
                        entryId: item.ENTRYID,
                        path: item.VAR_ENTRY_PATH,
                        deptName: item.DEPTNAME,
                        ulbId: item.ULBID,
                    }));

                setDepartments(mappedDepartments);
            } catch (error) {
                console.error( "Department fetch error:", error);
                setDepartments([]);

                await Swal.fire({
                    icon: "error",
                    text: error?.response?.data?.message || error?.response?.data?.error || "Unable to fetch departments.",
                });
            } finally {
                if (Swal.isVisible()) {
                    Swal.close();
                }
            }
        };

        fetchDepartments();
    }, [requestInitialized, ulbId]);

    const handleDepartmentSelect = (department) => {
        setSelectedDepartment(department);
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-[#f4f7fb]">
                <DepartmentSidebar
                    departments={departments}
                    selectedDepartmentId={selectedDepartment?.id}
                    onDepartmentSelect={handleDepartmentSelect}
                />

                <SidebarInset className="min-w-0 flex-1">
                    <Navbar />
                    <motion.main
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.25, ease: "easeOut"}}
                        className="flex w-full min-w-0 flex-1 flex-col overflow-x-hidden px-2 py-3 sm:px-4 sm:py-4 md:px-5 lg:px-6"
                    >
                        <Outlet context={{departments, selectedDepartment, setSelectedDepartment, handleDepartmentSelect}}/>
                    </motion.main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default Layout;