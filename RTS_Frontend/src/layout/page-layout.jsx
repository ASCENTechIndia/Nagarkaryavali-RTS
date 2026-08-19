import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const PageLayout = ({ allowPublic = false }) => {
    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f4f7fb]">
            <Navbar withSidebar={false} />

            <motion.main
                initial={{opacity: 0, y: 8}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.25, ease: "easeOut"}}
                className="flex  w-full min-w-0 flex-1 flex-col overflow-x-hidden px-2 py-3 sm:px-4 sm:py-4 md:px-5 lg:px-6"
            >
                {allowPublic ? (<Outlet />) : (<ProtectedRoute><Outlet /></ProtectedRoute>)}
            </motion.main>
        </div>
    );
};

export default PageLayout;