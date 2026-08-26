import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const NavbarContent = ({ withSidebar }) => {
    const { user, requestInitialized, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const ulbID = user?.ulbId;
    const [corpInfo, setCorpInfo] = useState({name: "", logo: ""});

    const locationState = location.state || {};
    const serviceId = locationState.serviceId || user?.serviceId;
    const userId = user?.userId || locationState.userId;

    const isAuthPage = ["/login", "/otp-login", "/registration", "/forgot-password"].includes(location.pathname);

    const fetchCorporationInfo = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/Dashboard/corporation-details`,
                {params: {corporationId: ulbID}}
            );

            if (res.data?.ok) {
                const data = res.data?.data?.data;

                setCorpInfo({
                    name: data?.corporation?.VAR_CORPORATION_NAME || "",
                    logo: data?.logo ? `data:image/png;base64,${data.logo}` : "",
                });
            }
        } catch (error) {
            console.error("Corporation fetch error:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleTrackApplication = () => {
        navigate("/app/FrmTrackApplication", {
            state: { 
                serviceId: serviceId,
                userId: userId,
                ulbId: ulbID
            }
        });
    };

    useEffect(() => {
        if (!requestInitialized || !ulbID) {
          return;
        }

        fetchCorporationInfo();
    }, [ulbID, requestInitialized]);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-[#184aa6] shadow-sm">
            <div className="flex h-14 w-full items-center px-3 sm:h-18 sm:px-5">
                <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                    <div className="flex gap-5">
                        {withSidebar && (
                            <SidebarTrigger className="h-9 w-9 shrink-0 rounded-md text-white hover:bg-white/20 hover:text-white" />
                        )}

                        {corpInfo.logo ? (
                            <img
                                src={corpInfo.logo}
                                alt="Corporation Logo"
                                className="h-9 w-9 shrink-0 rounded-md bg-white p-0.5 object-contain sm:h-12 sm:w-12"
                            />
                        ) : (
                            <div className="h-9 w-9 shrink-0 rounded-md bg-white/20 sm:h-12 sm:w-12" />
                        )}
                    </div>

                    <h1 className="flex-1 text-center truncate text-sm font-bold text-white sm:text-xl md:text-xl">
                        {corpInfo.name || "Municipal Corporation"}
                    </h1>
                    <div />
                    {(user && serviceId && !isAuthPage) && (
                        <div className="flex items-center gap-2 min-w-30 justify-end">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleTrackApplication}
                                className="text-white bg-[#1ab394] border-[#1ab394] px-3 py-1 h-8 text-xs sm:text-sm hover:bg-[#1ab394] hover:opacity-90"
                            >
                                <span className="hidden sm:inline">Application Tracking</span>
                                <span className="sm:hidden">Track</span>
                            </Button>
                            
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleLogout}
                                className="text-white bg-[#ed5565] border-[#ed5565] px-3 py-1 h-8 text-xs sm:text-sm hover:bg-[#ed5565] hover:opacity-90"
                            >
                                <span className="hidden sm:inline">Logout</span>
                                <span className="sm:hidden">Logout</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const NavbarWithSidebar = () => {
    useSidebar();
    return (
        <NavbarContent withSidebar={true} />
    );
};

const NavbarWithoutSidebar = () => {
    return (
        <NavbarContent withSidebar={false} />
    );
};

const Navbar = ({ withSidebar = true }) => {
    if (withSidebar) {
        return <NavbarWithSidebar />;
    }

    return <NavbarWithoutSidebar />;
};

export default Navbar;