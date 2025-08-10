import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LayoutDashboard, TentTree, CalendarDays, Users as UsersIcon, LogOut, Camera } from 'lucide-react'; // Camera icon import karein
import Footer from './Footer';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const getLinkClass = (path) => 
        location.pathname.startsWith(path) 
        ? 'bg-indigo-100 text-indigo-700' 
        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/dashboard" className="text-2xl font-bold text-indigo-600 flex items-center">
                            <UsersIcon size={28} className="mr-2"/> CampusConnect
                        </Link>

                        <nav className="hidden md:flex md:space-x-4">
                            <NavLink to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${getLinkClass('/dashboard')}`}>
                                <LayoutDashboard className="h-5 w-5 mr-2" /> Dashboard
                            </NavLink>
                            <NavLink to="/clubs" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${getLinkClass('/clubs')}`}>
                                <TentTree className="h-5 w-5 mr-2" /> Clubs
                            </NavLink>
                            <NavLink to="/events" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${getLinkClass('/events')}`}>
                                <CalendarDays className="h-5 w-5 mr-2" /> Events
                            </NavLink>
                            {/* --- YEH NAYA LINK ADD KIYA GAYA HAI --- */}
                            <NavLink to="/gallery" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${getLinkClass('/gallery')}`}>
                                <Camera className="h-5 w-5 mr-2" /> Gallery
                            </NavLink>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                                <Bell size={20} />
                            </button>
                            <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                                <img className="h-8 w-8 rounded-full" src={`https://ui-avatars.com/api/?name=${user?.full_name}&background=6366f1&color=fff`} alt="User avatar" />
                                <span className="font-semibold text-sm hidden sm:block">{user?.full_name}</span>
                            </Link>
                            <button onClick={handleLogout} title="Logout" className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-10 flex-grow">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Layout;