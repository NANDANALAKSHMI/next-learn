'use client'
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import Image from "next/image";
import Cookies from "js-cookie";

const Navbar = () => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

 
    const hiddenRoutes = ["/", "/otp", "/profile"];
    const shouldHideNavbar = hiddenRoutes.includes(pathname);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        setIsLogoutModalOpen(false);
        router.push("/");
    };

    if (shouldHideNavbar) return null;

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                    <div className="flex items-center">
                        <Image
                        src='/logo.svg'
                        width={200}
                        height={200}
                        />
                    </div>

                    <button
                        onClick={handleLogoutClick}
                        className="bg-[#177A9C] text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
            />
        </nav>
    );
};

export default Navbar;