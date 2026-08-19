import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const NavbarContent = ({ withSidebar }) => {
    const { user, requestInitialized } = useAuth();
    const ulbID = user?.ulbId || 3;
    const [corpInfo, setCorpInfo] = useState({name: "", logo: ""});

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

                    <h1 className="max-w-45 truncate text-sm font-bold text-white sm:max-w-125 sm:text-xl md:text-xl">
                        {corpInfo.name || "Municipal Corporation"}
                    </h1>
                    <div />
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