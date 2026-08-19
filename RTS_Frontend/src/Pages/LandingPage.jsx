//WITHOUT ANIMATION
// import { useMemo, useState } from "react";
// import { ChevronRight, ChevronLeft, FileText, Download, ExternalLink, Search, Building2, ShieldCheck, ArrowLeft } from "lucide-react";
// import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { motion, AnimatePresence } from "framer-motion";

// const defaultDepartments = [
//     {
//         id: 1,
//         name: "सामान्य प्रशासन विभाग",
//         icon: Building2,
//         services: [
//             {
//                 id: 101,
//                 name: "जन्म नोंदणी सेवा",
//                 description: "जन्म प्रमाणपत्रासाठी अर्ज करा.",
//                 documents: ["रुग्णालयाचा जन्म अहवाल", "पालकांचे ओळखपत्र", "पत्त्याचा पुरावा"],
//             },
//             {
//                 id: 102,
//                 name: "मृत्यू नोंदणी सेवा",
//                 description: "मृत्यू प्रमाणपत्रासाठी अर्ज करा.",
//                 documents: ["मृत्यू अहवाल", "मृत व्यक्तीचे ओळखपत्र", "अर्जदाराचे ओळखपत्र"],
//             },
//             {
//                 id: 103,
//                 name: "विवाह नोंदणी सेवा",
//                 description: "विवाह नोंदणी संबंधित सेवा.",
//                 documents: ["विवाहाचा पुरावा", "वधूचे ओळखपत्र", "वराचे ओळखपत्र", "साक्षीदारांचे ओळखपत्र"],
//             },
//         ],
//     },

//     {
//         id: 2,
//         name: "मालमत्ता विभाग",
//         icon: Building2,
//         services: [
//             {
//                 id: 201,
//                 name: "मालमत्ता कर भरणा",
//                 description: "मालमत्ता कर ऑनलाइन भरा.",
//                 documents: ["मालमत्ता क्रमांक", "मालकाचे नाव", "नोंदणीकृत मोबाईल क्रमांक"],
//             },
//             {
//                 id: 202,
//                 name: "मालमत्ता शोध",
//                 description: "मालमत्ता क्रमांक वापरून शोधा.",
//                 documents: ["मालमत्ता क्रमांक", "मालकाचे नाव", "प्रभाग माहिती"],
//             },
//             {
//                 id: 203,
//                 name: "मालमत्ता हस्तांतरण",
//                 description: "मालमत्ता हस्तांतरणासाठी अर्ज.",
//                 documents: ["खरेदीखत / विक्रीखत", "मालमत्ता कर पावती", "ओळखपत्र"],
//             },
//         ],
//     },

//     {
//         id: 3,
//         name: "पाणी पुरवठा विभाग",
//         icon: Building2,
//         services: [
//             {
//                 id: 301,
//                 name: "पाणी बिल भरणा",
//                 description: "पाणी बिल ऑनलाइन भरा.",
//                 documents: ["ग्राहक क्रमांक", "नोंदणीकृत मोबाईल क्रमांक"],
//             },
//             {
//                 id: 302,
//                 name: "नवीन पाणी जोडणी",
//                 description: "नवीन पाणी जोडणीसाठी अर्ज.",
//                 documents: ["मालमत्ता कागदपत्रे", "ओळखपत्र", "पत्त्याचा पुरावा"],
//             },
//         ],
//     },
// ];

// function DepartmentSidebar({ departments, selectedDepartmentId, onDepartmentSelect }) {
//     const { state, toggleSidebar } = useSidebar();
//     return (
//         <Sidebar collapsible="icon" variant="sidebar"
//             onClick={() => { if (state === "collapsed") {toggleSidebar()} }}
//         >
//             <SidebarHeader className="border-b bg-white">
//                 <div className="flex items-center gap-2 px-2 py-3">
//                     <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#184aa6] text-white">
//                         <Building2 size={18} />
//                     </div>
//                     {state === "expanded" && (
//                         <div className="min-w-0">
//                             <p className="truncate text-sm font-bold text-[#184aa6]">DEPARTMENT</p>
//                             <p className="truncate text-xs text-gray-500">SERVICES</p>
//                         </div>
//                     )}
//                 </div>
//             </SidebarHeader>

//             <SidebarContent>
//                 <SidebarGroup>
//                     <SidebarGroupLabel>Departments</SidebarGroupLabel>
//                     <SidebarMenu>
//                         {departments.map((department) => {
//                             const Icon = department.icon || Building2;
//                             const isActive = selectedDepartmentId === department.id;
//                             return (
//                                 <SidebarMenuItem key={department.id}>
//                                     <SidebarMenuButton
//                                         tooltip={department.name}
//                                         isActive={isActive}
//                                         onClick={() =>onDepartmentSelect(department)}
//                                         className={` h-10 rounded-md ${isActive ? "bg-[#184aa6] text-white hover:bg-[#123d89] hover:text-white" : "hover:bg-blue-50 hover:text-[#184aa6]"}`}
//                                     >
//                                         <Icon size={17} />
//                                         <span className="truncate">{department.name}</span>
//                                         {state === "expanded" && (
//                                             <ChevronRight size={15} className="ml-auto shrink-0"/>
//                                         )}
//                                     </SidebarMenuButton>
//                                 </SidebarMenuItem>
//                             );
//                         })}
//                     </SidebarMenu>
//                 </SidebarGroup>
//             </SidebarContent>
//             {/* <SidebarFooter className="border-t">
//                 {state === "expanded" && (<div className="px-2 py-2 text-center text-[10px] text-gray-400">Right to Service</div>)}
//             </SidebarFooter> */}
//         </Sidebar>
//     );
// }

// function ServicesPanel({ department, selectedServiceId, onServiceSelect, mobileShowDetails }) {
//     const [search, setSearch] = useState("");
//     const filteredServices = useMemo(() => {
//         const list = department?.services || [];
//         if (!search.trim()) {return list}
//         const value = search.toLowerCase();

//         return list.filter((service) =>[service.name, service.description].filter(Boolean).some((text) =>text.toLowerCase().includes(value)));
//     }, [department, search]);

//     return (
//         <section className={` flex min-h-0 min-w-0 flex-1 flex-col border-r bg-white ${mobileShowDetails ? "hidden md:flex" : "flex"}`}>
//             <div className=" shrink-0 border-b bg-[#080080] px-4 py-2">
//                 <h2 className="truncate text-center text-sm font-bold text-white"> {department?.name || "Department Services"}</h2>
//             </div>
//             <div className="shrink-0 border-b bg-white p-3">
//                 <div className="relative">
//                     <Search size={15} className=" absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
//                     <Input
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         placeholder="Search service..."
//                         className="h-9 pl-9 text-xs"
//                     />
//                 </div>
//             </div>

//             <ScrollArea className="min-h-0 flex-1">
//                 <div className="p-3">
//                     {!department ? (
//                         <div className="py-20 text-center text-sm text-gray-400">Select a department</div>
//                     ) : filteredServices.length === 0 ? (
//                         <div className="py-20 text-center">
//                             <FileText size={35} className="mx-auto mb-2 text-gray-300"/>
//                             <p className="text-sm text-gray-400">No services found</p>
//                         </div>
//                     ) : (
//                         <div className="space-y-1">
//                             {filteredServices.map((service, index) => {
//                                     const active = selectedServiceId === service.id;
//                                     return (
//                                         <button
//                                             key={service.id}
//                                             type="button"
//                                             onClick={() =>onServiceSelect(service)}
//                                             className={` group flex w-full items-start gap-2 rounded-md border-b px-2 py-2.5 text-left transition-all ${active ? "bg-blue-50" : "hover:bg-blue-50"}`}
//                                         >
//                                             <span className={` mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${active ? "bg-[#184aa6] text-white" : "bg-gray-100 text-gray-500"}`}>
//                                                 {index + 1}
//                                             </span>

//                                             <div className="min-w-0 flex-1">
//                                                 <p className={`text-xs font-medium leading-5 ${active ? "text-[#184aa6]" : "text-gray-700"}`}
//                                                 >
//                                                     {service.name}
//                                                 </p>

//                                                 {service.description && (
//                                                     <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-gray-400">
//                                                         {service.description}
//                                                     </p>
//                                                 )}

//                                             </div>

//                                             <ChevronRight
//                                                 size={15}
//                                                 className={` mt-1 shrink-0 ${active ? "text-[#184aa6]" : "text-gray-300"}`}
//                                             />
//                                         </button>
//                                     );
//                                 }
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </ScrollArea>
//         </section>
//     );
// }

// function DetailsPanel({ service, onBack }) {
//     return (
//         <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f8fafc]">
//             <div className="flex shrink-0 items-center border-b bg-[#080080] px-3 py-2">
//                 <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     onClick={onBack}
//                     className=" mr-2 h-7 w-7 text-white hover:bg-white/10 hover:text-white md:hidden"
//                 >
//                     <ArrowLeft size={16} />
//                 </Button>
//                 <h2 className="flex-1 text-center text-sm font-bold text-white">Documents Required</h2>
//                 <div className="w-7 md:hidden" />
//             </div>

//             <ScrollArea className="min-h-0 flex-1">
//                 {!service ? (
//                     <div className=" flex min-h-85 items-center justify-center px-5">
//                         <div className="text-center">
//                             <FileText size={42} className="mx-auto mb-3 text-gray-300"/>
//                             <p className="text-sm font-medium text-gray-500">Select a service</p>
//                             <p className="mt-1 text-xs text-gray-400">Select a service from the left section to view details.</p>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="space-y-4 p-3 sm:p-4">
//                         <Card className="border-blue-100 shadow-sm">
//                             <CardHeader className="pb-2">
//                                 <CardTitle className="text-base text-[#184aa6]">{service.name}</CardTitle>
//                                 {service.subtitle && (
//                                     <p className="text-xs text-gray-500">{service.subtitle}</p>
//                                 )}
//                             </CardHeader>
//                             <CardContent>
//                                 {service.description && (
//                                     <p className="text-xs leading-5 text-gray-600">{service.description}</p>
//                                 )}
//                             </CardContent>
//                         </Card>

//                         <Card className="border-gray-200 shadow-sm">
//                             <CardHeader className="pb-2">
//                                 <CardTitle className="text-sm">Documents Required</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 {!service.documents || service.documents.length === 0 ? (
//                                     <p className="text-xs text-gray-400">No documents specified.</p>
//                                 ) : (
//                                     <div className="space-y-2">
//                                         {service.documents.map(
//                                             (document, index) => (
//                                                 <div key={index} className=" flex items-start gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
//                                                     <span className=" flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#184aa6] text-[10px] font-bold text-white">
//                                                         {index + 1}
//                                                     </span>
//                                                     <span className="text-xs leading-5 text-gray-600">{document}</span>
//                                                 </div>
//                                             )
//                                         )}
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>

//                         <div className="flex flex-wrap gap-2">
//                             <Button className=" bg-[#184aa6] text-xs hover:bg-blue-900" path="/login">Apply Now<ChevronRight size={15} /></Button>
//                             {service.downloadUrl && (
//                                 <Button asChild variant="outline" className="text-xs">
//                                     <a href={service.downloadUrl} target="_blank" rel="noreferrer">
//                                         <Download size={15} />
//                                         Download
//                                     </a>
//                                 </Button>
//                             )}

//                             {service.detailsUrl && (
//                                 <Button asChild variant="outline" className="text-xs">
//                                     <a href={service.detailsUrl} target="_blank" rel="noreferrer">
//                                         <ExternalLink size={15} />
//                                         More Details
//                                     </a>
//                                 </Button>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </ScrollArea>
//         </section>
//     );
// }

// const LandingPage = ({ departments = defaultDepartments }) => {

//     const [selectedDepartment, setSelectedDepartment] = useState(departments?.[0] || null);
//     const [selectedService, setSelectedService] = useState(null);
//     const [mobileDetails, setMobileDetails] = useState(false);

//     const handleDepartmentSelect = (department) => {
//         setSelectedDepartment(department);
//         setSelectedService(null);
//         setMobileDetails(false);
//     };

//     const handleServiceSelect = (service) => {
//         setSelectedService(service);
//         setMobileDetails(true);
//     };

//     const handleBackToServices = () => {
//         setMobileDetails(false);
//     };

//     return (
//         <SidebarProvider>
//             <div
//                 className=" flex h-screen w-full overflow-hidden bg-[#f4f7fb]"
//             >

//                 <DepartmentSidebar
//                     departments={departments}
//                     selectedDepartmentId={selectedDepartment?.id}
//                     onDepartmentSelect={handleDepartmentSelect}
//                 />
//                 <div className=" flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
//                     <header className=" relative flex h-16 shrink-0 items-center border-b bg-white px-3 shadow-sm sm:px-5">
//                         <SidebarTrigger className="z-10" />
//                         <div className=" absolute left-12 flex items-center sm:left-14">
//                             <img
//                                 src="/NagarKaryavali.jpeg"
//                                 alt="Municipal Corporation"
//                                 className=" h-9 w-auto object-contain sm:h-11"
//                             />
//                         </div>

//                         <div className="mx-auto max-w-[65%] text-center">
//                             <h1 className="truncate text-xs font-bold text-gray-800 sm:text-base">परमाणी शहर महानगरपालिका</h1>
//                             <p className="text-[10px] font-semibold text-[#184aa6] sm:text-xs">Right to Service</p>
//                             <p className="hidden text-[8px] text-gray-500 sm:block">महाराष्ट्र लोकसेवा हक्क अधिनियम</p>
//                         </div>

//                         <div className="absolute right-3 flex sm:right-5">
//                             <div className=" flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-[#184aa6] sm:h-10 sm:w-10">
//                                 <ShieldCheck size={20}/>
//                             </div>
//                         </div>
//                     </header>

//                     <main className=" flex min-h-0 flex-1 overflow-hidden">

//                         <ServicesPanel
//                             department={selectedDepartment}
//                             selectedServiceId={selectedService?.id}
//                             onServiceSelect={handleServiceSelect}
//                             mobileShowDetails={mobileDetails}
//                         />
//                         <div className={` flex min-h-0 min-w-0 flex-1 ${!mobileDetails ? "hidden md:flex" : "flex"}`}>
//                             <DetailsPanel service={selectedService} onBack={handleBackToServices}/>
//                         </div>

//                     </main>

//                     <footer className=" flex h-7 shrink-0 items-center justify-between border-t bg-white px-3 text-[9px] text-gray-400 sm:px-5">
//                         <span> Right to Service Portal</span>
//                         <span> © 2026</span>
//                     </footer>
//                 </div>
//             </div>
//         </SidebarProvider>
//     );
// };

// export default LandingPage;


//WITH ANIMATION
import { useMemo, useState } from "react";
import { ChevronRight, ChevronLeft, FileText, Download, ExternalLink, Search, Building2, ShieldCheck, ArrowLeft } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const defaultDepartments = [
    {
        id: 1,
        name: "सामान्य प्रशासन विभाग",
        icon: Building2,
        services: [
            {
                id: 101,
                name: "जन्म नोंदणी सेवा",
                description: "जन्म प्रमाणपत्रासाठी अर्ज करा.",
                documents: ["रुग्णालयाचा जन्म अहवाल", "पालकांचे ओळखपत्र", "पत्त्याचा पुरावा"],
            },
            {
                id: 102,
                name: "मृत्यू नोंदणी सेवा",
                description: "मृत्यू प्रमाणपत्रासाठी अर्ज करा.",
                documents: ["मृत्यू अहवाल", "मृत व्यक्तीचे ओळखपत्र", "अर्जदाराचे ओळखपत्र"],
            },
            {
                id: 103,
                name: "विवाह नोंदणी सेवा",
                description: "विवाह नोंदणी संबंधित सेवा.",
                documents: ["विवाहाचा पुरावा", "वधूचे ओळखपत्र", "वराचे ओळखपत्र", "साक्षीदारांचे ओळखपत्र"],
            },
        ],
    },

    {
        id: 2,
        name: "मालमत्ता विभाग",
        icon: Building2,
        services: [
            {
                id: 201,
                name: "मालमत्ता कर भरणा",
                description: "मालमत्ता कर ऑनलाइन भरा.",
                documents: ["मालमत्ता क्रमांक", "मालकाचे नाव", "नोंदणीकृत मोबाईल क्रमांक"],
            },
            {
                id: 202,
                name: "मालमत्ता शोध",
                description: "मालमत्ता क्रमांक वापरून शोधा.",
                documents: ["मालमत्ता क्रमांक", "मालकाचे नाव", "प्रभाग माहिती"],
            },
            {
                id: 203,
                name: "मालमत्ता हस्तांतरण",
                description: "मालमत्ता हस्तांतरणासाठी अर्ज.",
                documents: ["खरेदीखत / विक्रीखत", "मालमत्ता कर पावती", "ओळखपत्र"],
            },
        ],
    },

    {
        id: 3,
        name: "पाणी पुरवठा विभाग",
        icon: Building2,
        services: [
            {
                id: 301,
                name: "पाणी बिल भरणा",
                description: "पाणी बिल ऑनलाइन भरा.",
                documents: ["ग्राहक क्रमांक", "नोंदणीकृत मोबाईल क्रमांक"],
            },
            {
                id: 302,
                name: "नवीन पाणी जोडणी",
                description: "नवीन पाणी जोडणीसाठी अर्ज.",
                documents: ["मालमत्ता कागदपत्रे", "ओळखपत्र", "पत्त्याचा पुरावा"],
            },
        ],
    },
];

function DepartmentSidebar({ departments, selectedDepartmentId, onDepartmentSelect }) {
    const { state, toggleSidebar } = useSidebar();
    return (
        <Sidebar collapsible="icon" variant="sidebar"
            onClick={() => { if (state === "collapsed") { toggleSidebar() } }}
        >
            <SidebarHeader className="border-b bg-white">
                <div className="flex items-center gap-2 px-2 py-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#184aa6] text-white">
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
                        {departments.map((department) => {
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

function ServicesPanel({ department, selectedServiceId, onServiceSelect, mobileShowDetails }) {
    const [search, setSearch] = useState("");
    const filteredServices = useMemo(() => {
        const list = department?.services || [];
        if (!search.trim()) { return list }
        const value = search.toLowerCase();

        return list.filter((service) => [service.name, service.description].filter(Boolean).some((text) => text.toLowerCase().includes(value)));
    }, [department, search]);

    return (
        <section className={` flex min-h-0 min-w-0 flex-1 flex-col border-r bg-white ${mobileShowDetails ? "hidden md:flex" : "flex"}`}>
            <div className=" shrink-0 border-b bg-[#080080] px-4 py-2">
                <h2 className="truncate text-center text-sm font-bold text-white"> {department?.name || "Department Services"}</h2>
            </div>
            <div className="shrink-0 border-b bg-white p-3">
                <div className="relative">
                    <Search size={15} className=" absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search service..."
                        className="h-9 pl-9 text-xs"
                    />
                </div>
            </div>

            <ScrollArea className="min-h-0 flex-1">
                <div className="p-3">
                    {!department ? (
                        <div className="py-20 text-center text-sm text-gray-400">Select a department</div>
                    ) : filteredServices.length === 0 ? (
                        <div className="py-20 text-center">
                            <FileText size={35} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-sm text-gray-400">No services found</p>
                        </div>
                    ) : (
                        <motion.div
                            className="space-y-1"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.04 } },
                            }}
                        >
                            {filteredServices.map((service, index) => {
                                const active = selectedServiceId === service.id;
                                return (
                                    <motion.button
                                        key={service.id}
                                        type="button"
                                        onClick={() => onServiceSelect(service)}
                                        variants={{
                                            hidden: { opacity: 0, x: -10 },
                                            visible: { opacity: 1, x: 0 },
                                        }}
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        className={`group flex w-full items-start gap-2 rounded-md border-b px-2 py-2.5 text-left ${active ? "bg-blue-50" : "hover:bg-blue-50"}`}
                                    >
                                        <span className={` mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${active ? "bg-[#184aa6] text-white" : "bg-gray-100 text-gray-500"}`}>
                                            {index + 1}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p className={`text-xs font-medium leading-5 ${active ? "text-[#184aa6]" : "text-gray-700"}`}
                                            >
                                                {service.name}
                                            </p>

                                            {service.description && (
                                                <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-gray-400">
                                                    {service.description}
                                                </p>
                                            )}

                                        </div>

                                        <ChevronRight
                                            size={15}
                                            className={` mt-1 shrink-0 ${active ? "text-[#184aa6]" : "text-gray-300"}`}
                                        />
                                    </motion.button>
                                );
                            }
                            )}
                        </motion.div>
                    )}
                </div>
            </ScrollArea>
        </section>
    );
}

function DetailsPanel({ service, onBack }) {
    return (
        <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f8fafc]">
            <div className="flex shrink-0 items-center border-b bg-[#080080] px-3 py-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className=" mr-2 h-7 w-7 text-white hover:bg-white/10 hover:text-white md:hidden"
                >
                    <ArrowLeft size={16} />
                </Button>
                <h2 className="flex-1 text-center text-sm font-bold text-white">Documents Required</h2>
                <div className="w-7 md:hidden" />
            </div>

            <ScrollArea className="min-h-0 flex-1">
                {!service ? (
                    <div className=" flex min-h-85 items-center justify-center px-5">
                        <div className="text-center">
                            <FileText size={42} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-sm font-medium text-gray-500">Select a service</p>
                            <p className="mt-1 text-xs text-gray-400">Select a service from the left section to view details.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 p-3 sm:p-4">
                        <Card className="border-blue-100 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-[#184aa6]">{service.name}</CardTitle>
                                {service.subtitle && (
                                    <p className="text-xs text-gray-500">{service.subtitle}</p>
                                )}
                            </CardHeader>
                            <CardContent>
                                {service.description && (
                                    <p className="text-xs leading-5 text-gray-600">{service.description}</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Documents Required</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!service.documents || service.documents.length === 0 ? (
                                    <p className="text-xs text-gray-400">No documents specified.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {service.documents.map(
                                            (document, index) => (
                                                <div key={index} className=" flex items-start gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
                                                    <span className=" flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#184aa6] text-[10px] font-bold text-white">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-xs leading-5 text-gray-600">{document}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex flex-wrap gap-2">
                            <Button className=" bg-[#184aa6] text-xs hover:bg-blue-900" path="/login">Apply Now<ChevronRight size={15} /></Button>
                            {service.downloadUrl && (
                                <Button asChild variant="outline" className="text-xs">
                                    <a href={service.downloadUrl} target="_blank" rel="noreferrer">
                                        <Download size={15} />
                                        Download
                                    </a>
                                </Button>
                            )}

                            {service.detailsUrl && (
                                <Button asChild variant="outline" className="text-xs">
                                    <a href={service.detailsUrl} target="_blank" rel="noreferrer">
                                        <ExternalLink size={15} />
                                        More Details
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </section>
    );
}

const LandingPage = ({ departments = defaultDepartments }) => {

    const [selectedDepartment, setSelectedDepartment] = useState(departments?.[0] || null);
    const [selectedService, setSelectedService] = useState(null);
    const [mobileDetails, setMobileDetails] = useState(false);

    const handleDepartmentSelect = (department) => {
        setSelectedDepartment(department);
        setSelectedService(null);
        setMobileDetails(false);
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setMobileDetails(true);
    };

    const handleBackToServices = () => {
        setMobileDetails(false);
    };

    return (
        <SidebarProvider>
            <div
                className=" flex h-screen w-full overflow-hidden bg-[#f4f7fb]"
            >

                <DepartmentSidebar
                    departments={departments}
                    selectedDepartmentId={selectedDepartment?.id}
                    onDepartmentSelect={handleDepartmentSelect}
                />
                <div className=" flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                    <motion.header
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.35,
                            ease: "easeOut",
                        }}
                        className="relative flex h-16 shrink-0 items-center border-b bg-white px-3 shadow-sm sm:px-5"
                    >
                        <SidebarTrigger className="z-10" />
                        <div className=" absolute left-12 flex items-center sm:left-14">
                            <img
                                src="/NagarKaryavali.jpeg"
                                alt="Municipal Corporation"
                                className=" h-9 w-auto object-contain sm:h-11"
                            />
                        </div>

                        <div className="mx-auto max-w-[65%] text-center">
                            <h1 className="truncate text-xs font-bold text-gray-800 sm:text-base">परमाणी शहर महानगरपालिका</h1>
                            <p className="text-[10px] font-semibold text-[#184aa6] sm:text-xs">Right to Service</p>
                            <p className="hidden text-[8px] text-gray-500 sm:block">महाराष्ट्र लोकसेवा हक्क अधिनियम</p>
                        </div>

                        <div className="absolute right-3 flex sm:right-5">
                            <div className=" flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-[#184aa6] sm:h-10 sm:w-10">
                                <ShieldCheck size={20} />
                            </div>
                        </div>
                    </motion.header>

                    <main className=" flex min-h-0 flex-1 overflow-hidden">
                        <div className="flex min-h-0 min-w-0 flex-1">
                            <ServicesPanel
                                department={selectedDepartment}
                                selectedServiceId={selectedService?.id}
                                onServiceSelect={handleServiceSelect}
                                mobileShowDetails={mobileDetails}
                            />
                        </div>
                        {/* <AnimatePresence mode="wait"> */}

                        {selectedService && (
                            <motion.div
                                key={selectedService.id}
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className={`min-h-0 min-w-0 flex-1 ${!mobileDetails ? "hidden md:flex" : "flex"}`}
                            >
                                <DetailsPanel service={selectedService} onBack={handleBackToServices} />
                            </motion.div>
                        )}
                        {/* </AnimatePresence> */}
                    </main>

                    <footer className=" flex h-7 shrink-0 items-center justify-between border-t bg-white px-3 text-[9px] text-gray-400 sm:px-5">
                        <span> Right to Service Portal</span>
                        <span> © 2026</span>
                    </footer>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default LandingPage;