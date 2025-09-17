import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavLink = ({ to, children }) => (
    <li>
        <Link to={to} className="font-josefin transition-all duration-300 hover:text-orange-500/90 hover:scale-110 transform inline-block">
            {children}
        </Link>
    </li>
);

const Button = ({ to, children, primary = false }) => (
    <li>
        <Link to={to}>
            <button className={`px-5 py-2 font-josefin font-semibold rounded-lg transition-all transform hover:scale-105 ${
                primary ? 'bg-orange-500 hover:bg-orange-600 text-white-smoke' : 'bg-white-smoke/10 hover:bg-white-smoke/20 text-white-smoke'
            }`}>
                {children}
            </button>
        </Link>
    </li>
);

const MobileNavLink = ({ to, children, onClick }) => (
    <li>
        <Link to={to} onClick={onClick} className="block py-3 px-4 font-josefin transition-all duration-300 hover:pl-6 hover:text-orange-500/90">
            {children}
        </Link>
    </li>
);

const Navbar = ({ isLandingPage = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const desktopNavItems = isLandingPage ? (
        <>
            <Button to="/login">Log In</Button>
            <Button to="/signup" primary>Sign Up</Button>
        </>
    ) : (
        <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/profile">Profile</NavLink>
        </>
    );

    const mobileNavItems = isLandingPage ? (
        <>
            <MobileNavLink to="/login" onClick={closeMenu}>Log In</MobileNavLink>
            <MobileNavLink to="/signup" onClick={closeMenu}>Sign Up</MobileNavLink>
        </>
    ) : (
        <>
            <MobileNavLink to="/" onClick={closeMenu}>Home</MobileNavLink>
            <MobileNavLink to="/projects" onClick={closeMenu}>Projects</MobileNavLink>
            <MobileNavLink to="/pricing" onClick={closeMenu}>Pricing</MobileNavLink>
            <MobileNavLink to="/about" onClick={closeMenu}>About</MobileNavLink>
            <MobileNavLink to="/profile" onClick={closeMenu}>Profile</MobileNavLink>
        </>
    );

    return (
        <nav className="sticky top-0 z-50 bg-rich-black/80 backdrop-blur-lg text-white-smoke shadow-lg">
            <div className="flex justify-between items-center max-w-screen-xl mx-auto p-4">
                <Link to="/" id="profectus-logo" className="font-k95 text-white-smoke text-3xl">Profectus</Link>

                {/* Desktop Menu */}
                <div className="hidden md:block">
                    <ul className="flex space-x-8 items-center">
                        {desktopNavItems}
                    </ul>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white-smoke focus:outline-none transition-transform duration-300 hover:scale-110">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMenuOpen ?
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> :
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <ul className="flex flex-col space-y-2 py-2">
                    {mobileNavItems}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
