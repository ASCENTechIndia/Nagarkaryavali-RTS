import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { ChevronRight, ChevronLeft, FileText, Download, ExternalLink, Search, Building2, ShieldCheck, ArrowLeft } from "lucide-react";

const  DepartmentSidebar = ({ departments, selectedDepartmentId, onDepartmentSelect }) => {
    const { state, toggleSidebar } = useSidebar();

  
    return (
        <Sidebar collapsible="icon" variant="sidebar"
            onClick={() => { if (state === "collapsed") { toggleSidebar() } }}
        >
            <SidebarHeader className="border-b bg-white">
                <div className="flex items-center gap-2 px-2 py-3">
                    <div className="flex h-8 w-6 shrink-0 items-center justify-center rounded-lg bg-[#184aa6] text-white">
                        <Building2 size={18} />
                    </div>
                    {state === "expanded" && (
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#184aa6]">DEPARTMENT</p>
                            <p className="truncate text-xs text-gray-500">SERVICES</p>
                        </div>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Departments</SidebarGroupLabel>
                    <SidebarMenu>
                        {departments?.map((department) => {
                            const Icon = department.icon || Building2;
                            const isActive = selectedDepartmentId === department.id;
                            return (
                                <SidebarMenuItem key={department.id}>
                                    <SidebarMenuButton
                                        tooltip={department.name}
                                        isActive={isActive}
                                        onClick={() => onDepartmentSelect(department)}
                                        className={` h-10 rounded-md ${isActive ? "bg-[#184aa6] text-white hover:bg-[#123d89] hover:text-white" : "hover:bg-blue-50 hover:text-[#184aa6]"}`}
                                    >
                                        <Icon size={17} />
                                        <span className="truncate">{department.name}</span>
                                        {state === "expanded" && (
                                            <ChevronRight size={15} className="ml-auto shrink-0" />
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            {/* <SidebarFooter className="border-t">
                {state === "expanded" && (<div className="px-2 py-2 text-center text-[10px] text-gray-400">Right to Service</div>)}
            </SidebarFooter> */}
        </Sidebar>
    );
}

export default DepartmentSidebar