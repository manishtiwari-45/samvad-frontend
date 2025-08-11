import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LayoutDashboard, TentTree, CalendarDays, LogOut, Camera, PanelLeftClose, PanelLeftOpen, User as UserIcon, Settings, Sparkles } from 'lucide-react';
import Footer from './Footer';

// Sidebar Component
const Sidebar = ({ isOpen }) => {
    const location = useLocation();

    const getLinkClass = (path) => 
        location.pathname.startsWith(path) 
        ? 'bg-accent/10 text-accent' // Active link style
        : 'text-secondary hover:bg-border hover:text-primary'; // Inactive link style

    return (
        <aside className={`bg-card text-primary space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-all duration-300 ease-in-out z-50 border-r border-border ${isOpen ? "w-64" : "w-20"}`}>
            <Link to="/dashboard" className="text-2xl font-bold text-primary flex items-center px-4 space-x-2 overflow-hidden">
                <Sparkles size={28} className="flex-shrink-0 text-accent"/>
                <span className={`whitespace-nowrap transition-opacity duration-200 ${!isOpen && "opacity-0"}`}>StellarHub</span>
            </Link>
            
            <nav className="flex flex-col space-y-1">
                <NavLink to="/dashboard" title="Dashboard" className={`w-full p-3 rounded-lg flex items-center overflow-hidden ${getLinkClass('/dashboard')}`}>
                    <LayoutDashboard className="h-6 w-6 flex-shrink-0" />
                    <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${!isOpen && "opacity-0"}`}>Dashboard</span>
                </NavLink>
                <NavLink to="/clubs" title="Clubs" className={`w-full p-3 rounded-lg flex items-center overflow-hidden ${getLinkClass('/clubs')}`}>
                    <TentTree className="h-6 w-6 flex-shrink-0" />
                    <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${!isOpen && "opacity-0"}`}>Clubs</span>
                </NavLink>
                <NavLink to="/events" title="Events" className={`w-full p-3 rounded-lg flex items-center overflow-hidden ${getLinkClass('/events')}`}>
                    <CalendarDays className="h-6 w-6 flex-shrink-0" />
                    <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${!isOpen && "opacity-0"}`}>Events</span>
                </NavLink>
                <NavLink to="/gallery" title="Gallery" className={`w-full p-3 rounded-lg flex items-center overflow-hidden ${getLinkClass('/gallery')}`}>
                    <Camera className="h-6 w-6 flex-shrink-0" />
                    <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${!isOpen && "opacity-0"}`}>Gallery</span>
                </NavLink>
            </nav>
        </aside>
    );
};

// Main Layout Component
const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    const handleLogout = () => { logout(); navigate('/auth'); };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileMenuRef]);

    const getPageTitle = (pathname) => { /* ... yeh function waise hi rahega ... */ };

    return (
        <div className="min-h-screen bg-background flex">
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"></div>}
            <Sidebar isOpen={isSidebarOpen} />
            
            <div className="flex-1 flex flex-col">
                <header className="bg-card border-b border-border sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <button className="p-2 text-secondary hover:bg-border rounded-full" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                {isSidebarOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
                                </button>
                                <h1 className="text-xl font-semibold text-primary ml-4 hidden md:block">
                                    {getPageTitle(location.pathname)}
                                </h1>
                            </div>
                            
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <button className="p-2 rounded-full text-secondary hover:bg-border"><Bell size={20} /></button>
                                
                                <div className="relative" ref={profileMenuRef}>
                                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-border">
                                        <img className="h-8 w-8 rounded-full" src={`https://ui-avatars.com/api/?name=${user?.full_name}&background=388BFD&color=fff`} alt="User avatar" />
                                        <span className="font-semibold text-sm text-primary hidden sm:block">{user?.full_name}</span>
                                    </button>
                                    
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-50 animate-fade-in">
                                            <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-secondary hover:bg-border hover:text-primary">
                                                <UserIcon size={16} className="mr-2"/> My Profile
                                            </Link>
                                            <a href="#" className="flex items-center px-4 py-2 text-sm text-secondary hover:bg-border hover:text-primary">
                                                <Settings size={16} className="mr-2"/> Settings
                                            </a>
                                            <div className="border-t border-border my-1"></div>
                                            <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">
                                                <LogOut size={16} className="mr-2"/> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-10 flex-grow">
                    {children}
                </main>
                
                <Footer />
            </div>
        </div>
    );
};

const getPageTitle = (pathname) => {
    if (pathname.startsWith('/admin/user-management')) return 'User Management';
    if (pathname.startsWith('/admin/club-oversight')) return 'Club Oversight';
    if (pathname.startsWith('/profile')) return 'My Profile';
    if (pathname.startsWith('/clubs/') && pathname.endsWith('/edit')) return 'Edit Club';
    if (pathname.startsWith('/clubs/')) return 'Club Details';
    if (pathname.startsWith('/clubs')) return 'Discover Clubs';
    if (pathname.startsWith('/events')) return 'Discover Events';
    if (pathname.startsWith('/gallery')) return 'Photo Gallery';
    if (pathname.startsWith('/enroll-face')) return 'Face Enrollment';
    if (pathname.startsWith('/attendance/live')) return 'Live AI Attendance';
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    return 'StellarHub';
};

export default Layout;