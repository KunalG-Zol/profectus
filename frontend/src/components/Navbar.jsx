import React, { useState } from 'react';

const Navbar = ({ isLandingPage = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Content to display based on page type
    const renderDesktopNavItems = () => {
        if (isLandingPage) {
            return (
                <>
                    <li>
                        <button className="px-5 py-2 font-semibold transition-all hover:text-gray-300 border border-transparent hover:border-gray-500 rounded">
                            Log In
                        </button>
                    </li>
                    <li>
                        <button className="px-5 py-2 bg-orange-500 hover:bg-orange-600 rounded font-semibold transition-all transform hover:scale-105">
                            Sign Up
                        </button>
                    </li>
                </>
            );
        }

        return (
            <>
                <li className="relative group">
                    <span className="cursor-pointer transition-all duration-300 hover:text-gray-300 hover:scale-110 transform inline-block">Home</span>
                </li>
                <li className="relative group">
                    <span className="cursor-pointer transition-all duration-300 hover:text-gray-300 hover:scale-110 transform inline-block">Projects</span>
                </li>
                <li className="relative group">
                    <span className="cursor-pointer transition-all duration-300 hover:text-gray-300 hover:scale-110 transform inline-block">Pricing</span>
                </li>
                <li className="relative group">
                    <span className="cursor-pointer transition-all duration-300 hover:text-gray-300 hover:scale-110 transform inline-block">About</span>
                </li>
                <li className="relative group">
                    <span className="cursor-pointer transition-all duration-300 hover:text-gray-300 hover:scale-110 transform inline-block">Profile</span>
                </li>
            </>
        );
    };

    const renderMobileNavItems = () => {
        if (isLandingPage) {
            return (
                <>
                    <li className="transition-all duration-300 hover:pl-2 hover:text-gray-300 cursor-pointer py-2">
                        Log In
                    </li>
                    <li className="bg-orange-500 hover:bg-orange-600 rounded text-center py-2 transition-all">
                        Sign Up
                    </li>
                </>
            );
        }

        return (
            <>
                <li className="transition-all duration-300 hover:pl-2 hover:text-gray-300 cursor-pointer">Home</li>
                <li className="transition-all duration-300 hover:pl-2 hover:text-gray-300 cursor-pointer">Projects</li>
                <li className="transition-all duration-300 hover:pl-2 hover:text-gray-300 cursor-pointer">Pricing</li>
                <li className="transition-all duration-300 hover:pl-2 hover:text-gray-300 cursor-pointer">About</li>
                <li className="transition-all duration-300 hover:pl-2 hover:text-gray-300 cursor-pointer">Profile</li>
            </>
        );
    };

    return (
        <div className="bg-rich-black p-4 text-white-smoke">
            <div className="flex justify-between items-center max-w-screen-xl mx-auto">
                <div id="profectus-logo" className="font-k95 text-white-smoke text-2xl">Profectus</div>

                {/* Desktop Menu */}
                <div className="hidden md:block font-josefin">
                    <ul className="flex space-x-6 items-center">
                        {renderDesktopNavItems()}
                    </ul>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white-smoke focus:outline-none transition-transform duration-300 hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMenuOpen ?
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> :
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden mt-2 py-2">
                    <ul className="flex flex-col font-josefin space-y-3">
                        {renderMobileNavItems()}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;