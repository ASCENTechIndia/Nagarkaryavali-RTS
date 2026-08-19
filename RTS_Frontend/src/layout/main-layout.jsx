// import React from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "@/components/Navbar";
// import ProtectedRoute from "@/routes/ProtectedRoute";
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// import { motion } from "framer-motion";

// const Layout = () => {
//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full bg-[#f4f7fb]">    
//         <SidebarInset className="min-w-0">         
//           <Navbar />
//           <motion.main
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.25, ease: "easeOut" }}
//             className="flex min-h-[calc(100vh-4rem)] w-full min-w-0 flex-1 flex-col overflow-x-hidden px-2 py-3 sm:px-4 sm:py-4 md:px-5 lg:px-6"
//           >
//             {/* <ProtectedRoute> */}
//               <Outlet />
//             {/* </ProtectedRoute> */}
//           </motion.main>
//         </SidebarInset>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Layout;


import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import DepartmentSidebar from "@/components/DepartmentSidebar";
import { ChevronRight, ChevronLeft, FileText, Download, ExternalLink, Search, Building2, ShieldCheck, ArrowLeft } from "lucide-react";

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

const Layout = () => {

   const [selectedDepartment, setSelectedDepartment] = useState(defaultDepartments?.[0] || null);

  
      const handleDepartmentSelect = (department) => {
          setSelectedDepartment(department);
      };


  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f4f7fb]">
        <DepartmentSidebar
          departments={defaultDepartments}
          selectedDepartmentId={selectedDepartment?.id}
          onDepartmentSelect={handleDepartmentSelect}
        />
        <SidebarInset className="min-w-0">
          <Navbar />
          <motion.main
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className=" flex min-h-[calc(100vh-4rem)] w-full min-w-0 flex-1 flex-col overflow-x-hidden px-2 py-3 sm:px-4 sm:py-4 md:px-5 lg:px-6"
          >
            {/* <ProtectedRoute> */}
            <Outlet />
            {/* </ProtectedRoute> */}
          </motion.main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;