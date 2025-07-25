import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
const { user, logout } = useAuth();
const navigate = useNavigate();
const [isMenuOpen, setIsMenuOpen] = useState(false);

const handleLogout = () => {
    logout();
    navigate('/auth');
};

const activeLinkClass = "text-indigo-600 font-bold";
const inactiveLinkClass = "text-gray-600 hover:text-indigo-600";

const getLinkClass = ({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass;

return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
                CampusConnect
            </Link>
          {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
                <NavLink to="/explore" className={getLinkClass}>Explore</NavLink>
                <NavLink to="/dashboard" className={getLinkClass}>Dashboard</NavLink>
                {user && (
            <>
                <span className="text-gray-800">Hi, {user.full_name.split(' ')[0]}!</span>
                <button
                    onClick={handleLogout}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    Logout
                </button>
            </>
            )}
        </div>
          {/* Mobile Menu Button */}
        <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? (
                    <XMarkIcon className="h-8 w-8 text-gray-700" />
            ) : (
                    <Bars3Icon className="h-8 w-8 text-gray-700" />
            )}
                </button>
            </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="md:hidden mt-4 space-y-2">
                <NavLink to="/explore" className={({isActive}) => `block py-2 ${isActive ? activeLinkClass : inactiveLinkClass}`}>Explore</NavLink>
                <NavLink to="/dashboard" className={({isActive}) => `block py-2 ${isActive ? activeLinkClass : inactiveLinkClass}`}>Dashboard</NavLink>
            <button
                onClick={handleLogout}
                className="w-full text-left bg-indigo-600 text-white px-4 py-2 mt-2 rounded-md hover:bg-indigo-700 transition"
            >
                Logout
            </button>
            </div>
        )}
        </nav>
    </header>
    );
};

export default Header;