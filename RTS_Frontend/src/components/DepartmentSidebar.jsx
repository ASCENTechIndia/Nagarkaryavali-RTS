import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "./ui/sidebar";
import { ChevronRight, ChevronDown, Building2, Circle } from "lucide-react";

const DepartmentSidebar = ({ items = [], selectedId, onSelect, title = "DEPARTMENTS", icon: HeaderIcon = Building2 }) => {
    const navigate = useNavigate();
    const { state, toggleSidebar } = useSidebar();
    const [openMenus, setOpenMenus] = useState({});

    const handleNavigation = (item) => {
        if (!item?.path) return false;

        const serviceUrl = item.path ? item.path.replace(/^\~?\.?\//, "/").replace(/\.aspx(?=\?|$)/i, "") : "";
        if (!serviceUrl) return false;
        navigate(serviceUrl);
        return true;
    };

    const handleItemClick = (item) => {
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;
        if (hasChildren) {
            setOpenMenus((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
            return;
        }

        const navigated = handleNavigation(item);
        if (!navigated) {
            onSelect?.(item);
        } else {
            onSelect?.(item);
        }
    };

    const handleChildClick = (parent, child) => {
        handleNavigation(child);
        onSelect?.({ parent, child });
    };

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            onClick={() => {
                if (state === "collapsed") { toggleSidebar() }
            }}
        >
            <SidebarHeader className="border-b bg-[#184aa6]">
                <div className="flex items-center gap-2 px-1 py-3">
                    <div className="flex h-8 w-6 shrink-0 items-center justify-center rounded-lg bg-white"><HeaderIcon size={16} /></div>
                    {state === "expanded" && (<div className="min-w-0"><p className="truncate text-xs font-bold text-white">{title}</p></div>)}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {items.map((item) => {
                            const Icon = item.icon || Building2;
                            const isActive = selectedId === item.id;
                            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                            const isOpen = openMenus[item.id];
                            return (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        tooltip={item.name || item.title}
                                        isActive={isActive}
                                        onClick={() => handleItemClick(item)}
                                        className={`h-10 rounded-md ${isActive ? "bg-[#184aa6]! text-white! hover:bg-[#123d89] hover:text-white" : "hover:bg-blue-50 hover:text-[#184aa6]"}`}
                                    >
                                        <Icon size={17} />
                                        <span className="truncate">{item.name || item.title}</span>
                                        {state === "expanded" && (
                                            <>
                                                {hasChildren ? (
                                                    <ChevronDown
                                                        size={15}
                                                        className={`ml-auto shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                                    />
                                                ) : (
                                                    <ChevronRight size={15} className="ml-auto shrink-0" />
                                                )}
                                            </>
                                        )}
                                    </SidebarMenuButton>

                                    {hasChildren && isOpen && (
                                        <SidebarMenuSub>
                                            {item.children.map((child) => {
                                                const childActive = selectedId === child.id;
                                                return (
                                                    <SidebarMenuSubItem key={child.id}>
                                                        <SidebarMenuSubButton
                                                            isActive={childActive}
                                                            onClick={() =>
                                                                handleChildClick(item, child)
                                                            }
                                                            className={`cursor-pointer ${childActive ? "bg-blue-50 text-[#184aa6]" : "hover:bg-blue-50 hover:text-[#184aa6]"}`}
                                                        >
                                                            {/* <Circle size={7} className="shrink-0"/> */}
                                                            <span className="truncate"> {child.name || child.title}</span>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export default DepartmentSidebar;