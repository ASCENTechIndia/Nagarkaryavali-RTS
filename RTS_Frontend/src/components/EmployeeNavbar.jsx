import React from "react";
import { useAuth } from "@/context/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, Clock3, History, Home, LogOut, ChevronDown } from "lucide-react";

const EmployeeNavbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-blue-800/30 bg-[#184aa6] shadow-sm">
            <div className="flex h-18 w-full items-center px-3 sm:px-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-1 items-center gap-2">
                        <SidebarTrigger className="h-9 w-9 shrink-0 rounded-md text-white hover:bg-white/15 hover:text-white" />
                        <img
                            src={"/tmc_logo.png"} 
                            alt="Logo"
                            className="h-9 w-9 shrink-0 rounded-md bg-white p-0.5 object-contain sm:h-10 sm:w-10"
                        />                       
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2">
                        <h1 className="whitespace-nowrap text-base font-bold tracking-wide text-white sm:text-lg">Administrator Panel</h1>
                    </div>

                    <div className="flex flex-1 justify-end">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 gap-2 rounded-lg px-2 text-white hover:bg-white/15 hover:text-white"
                                >
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20"><User size={16} /></div>
                                    <span className="hidden max-w-32 truncate sm:block">{user?.username || "Employee"}</span>
                                    <ChevronDown size={15} className="hidden sm:block"/>
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent align="end" sideOffset={10} className="w-64 p-0">
                                <div className="border-b bg-[#184aa6] px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                                            <User size={18} className="text-white"/>
                                        </div>

                                        <div className="min-w-0">
                                            {/* <p className="text-xs text-blue-100">Welcome</p> */}
                                            {/* <p className="truncate font-semibold text-white">{user?.username || "Employee"}</p> */}
                                            <p className="mt-0.5 text-xs text-blue-100">User ID: {user?.userId || "-"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1 px-3">
                                    <div className="flex items-center gap-3 rounded-md  hover:bg-blue-50">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-[#184aa6]">
                                            <Clock3 size={16} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">Last Login</p>
                                            <p className="text-sm font-medium">{user?.lastLogin || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-md  hover:bg-blue-50">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-[#184aa6]">
                                            <History size={16} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">Last Logout</p>
                                            <p className="text-sm font-medium">{user?.lastLogout || "-"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 border-t p-1">
                                    <Button path="/home" variant="outline" size="sm" className="flex-1"><Home size={15}/>Home</Button>
                                    <Button type="button" variant="destructive" size="sm" onClick={handleLogout} className="flex-1"><LogOut size={15}/>Sign Out</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default EmployeeNavbar;