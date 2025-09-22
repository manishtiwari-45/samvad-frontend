import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LayoutDashboard, TentTree, CalendarDays, LogOut, Camera, PanelLeftClose, PanelLeftOpen, User as UserIcon, Settings, Sparkles, ScanFace, Users, Plus, MessageSquare } from 'lucide-react';
import NotificationBell from './common/NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

// Enhanced Sidebar Component
const Sidebar = ({ isOpen, onToggle }) => {
    const location = useLocation();
    const { user } = useAuth();

    const getLinkClass = (path) => {
        const isActive = location.pathname.startsWith(path);
        return `w-full p-3 rounded-xl flex items-center overflow-hidden transition-all duration-200 group ${
            isActive 
                ? 'bg-accent text-white shadow-lg shadow-accent/25' 
                : 'text-secondary hover:bg-card-hover hover:text-primary'
        }`;
    };

    const navigationItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Overview & stats' },
        { path: '/clubs', icon: TentTree, label: 'Clubs', description: 'Discover & join' },
        { path: '/events', icon: CalendarDays, label: 'Events', description: 'Upcoming activities' },
        { path: '/forums', icon: MessageSquare, label: 'Forums', description: 'Community discussions' },
        { path: '/gallery', icon: Camera, label: 'Gallery', description: 'Photo memories' },
    ];

    // Add role-specific navigation items
    if (user?.role === 'student') {
        navigationItems.push({ 
            path: '/enroll-face', 
            icon: ScanFace, 
            label: 'AI Attendance', 
            description: 'Face enrollment',
            badge: !user.face_encoding ? 'New' : null
        });
    }

    if (user?.role === 'club_admin' || user?.role === 'super_admin') {
        navigationItems.push({ 
            path: '/admin/clubs/create', 
            icon: Plus, 
            label: 'Create Club', 
            description: 'Add new club' 
        });
        navigationItems.push({ 
            path: '/attendance/live', 
            icon: Users, 
            label: 'Live Attendance', 
            description: 'AI-powered tracking' 
        });
    }

    return (
        <motion.aside 
            className={`bg-card text-primary flex flex-col fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-all duration-300 ease-in-out z-50 border-r border-border shadow-xl ${isOpen ? "w-72" : "w-20"}`}
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {/* Logo Section */}
            <div className="p-6 border-b border-border">
                <Link to="/dashboard" className="flex items-center space-x-3 group">
                    <motion.div 
                        className="w-10 h-10 bg-gradient-to-br from-accent to-accent-hover rounded-xl flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Sparkles size={20} className="text-white"/>
                    </motion.div>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div 
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1 className="text-xl font-bold text-primary">SAMVAD</h1>
                                <p className="text-xs text-secondary font-medium">Campus Community</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Link>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    
                    return (
                        <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * navigationItems.indexOf(item) }}
                        >
                            <NavLink 
                                to={item.path} 
                                title={!isOpen ? item.label : undefined}
                                className={({ isActive }) => 
                                    `w-full p-3 rounded-xl flex items-center overflow-hidden transition-all duration-300 group relative ${
                                        isActive 
                                            ? 'bg-gradient-to-r from-accent to-accent-hover text-white shadow-lg shadow-accent/25' 
                                            : 'text-secondary hover:bg-card-hover hover:text-primary hover:shadow-md'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-all duration-300 ${
                                            isActive ? 'text-white scale-110' : 'text-current group-hover:scale-110 group-hover:text-accent'
                                        }`}>
                                            <Icon size={20} />
                                        </div>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div 
                                                    className="ml-4 min-w-0 flex-1"
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="min-w-0">
                                                            <p className="font-semibold truncate">{item.label}</p>
                                                            <p className={`text-xs truncate transition-colors ${
                                                                isActive ? 'text-white/80' : 'text-secondary'
                                                            }`}>
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                        {item.badge && (
                                                            <motion.span 
                                                                className="ml-2 px-2 py-0.5 bg-warning text-white text-xs rounded-full font-medium"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: 0.3 }}
                                                            >
                                                                {item.badge}
                                                            </motion.span>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {/* Hover effect */}
                                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-accent/10 to-accent-hover/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                                            isActive ? 'opacity-0' : ''
                                        }`} />
                                    </>
                                )}
                            </NavLink>
                        </motion.div>
                    );
                })}
            </nav>

            {/* User Info Section */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="p-4 border-t border-border"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center space-x-3 p-3 bg-background-tertiary rounded-xl hover:bg-card-hover transition-colors duration-200">
                            <img 
                                className="w-10 h-10 rounded-xl ring-2 ring-accent/20" 
                                src={`https://ui-avatars.com/api/?name=${user?.full_name}&background=3B82F6&color=fff&size=40`} 
                                alt="User avatar" 
                            />
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-primary truncate">{user?.full_name}</p>
                                <p className="text-xs text-secondary capitalize font-medium">{user?.role?.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={onToggle}
                className="absolute -right-3 top-8 w-6 h-6 bg-gradient-to-r from-accent to-accent-hover text-white rounded-full flex items-center justify-center shadow-lg md:hidden"
                aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isOpen ? 'close' : 'open'}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        </motion.aside>
    );
};

// Enhanced Header Component
const Header = ({ onSidebarToggle, isSidebarOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [notifications] = useState([
        { id: 1, title: 'New event: AI Workshop', time: '2 hours ago', unread: true },
        { id: 2, title: 'Club meeting reminder', time: '1 day ago', unread: false },
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileMenuRef = useRef(null);
    const notificationRef = useRef(null);

    const handleLogout = () => { 
        logout(); 
        navigate('/auth'); 
        setIsProfileMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <motion.header 
            className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-30 shadow-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Section */}
                    <div className="flex items-center space-x-4">
                        <motion.button 
                            onClick={onSidebarToggle}
                            className="p-2 text-secondary hover:bg-card-hover hover:text-accent rounded-xl transition-all duration-200 md:hidden"
                            aria-label="Toggle sidebar"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isSidebarOpen ? 'close' : 'open'}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>
                        
                        <motion.div 
                            className="hidden md:block"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h1 className="text-xl font-bold text-primary">
                                {getPageTitle(location.pathname)}
                            </h1>
                            <p className="text-xs text-secondary mt-0.5 font-medium">
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </motion.div>
                    </div>
                    
                    {/* Right Section */}
                    <div className="flex items-center space-x-2">
                        {/* Notifications */}
                        <NotificationBell />

                        {/* Profile Menu */}
                        <div className="relative" ref={profileMenuRef}>
                            <motion.button 
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-card-hover transition-all duration-200 group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.img 
                                    className="h-8 w-8 rounded-xl ring-2 ring-transparent group-hover:ring-accent/20 transition-all" 
                                    src={`https://ui-avatars.com/api/?name=${user?.full_name}&background=3B82F6&color=fff&size=32`} 
                                    alt="User avatar"
                                    whileHover={{ rotate: 5 }}
                                />
                                <div className="hidden sm:block text-left">
                                    <p className="font-semibold text-primary text-sm truncate max-w-32">
                                        {user?.full_name?.split(' ')[0]}
                                    </p>
                                    <p className="text-xs text-secondary capitalize font-medium">
                                        {user?.role?.replace('_', ' ')}
                                    </p>
                                </div>
                            </motion.button>
                            
                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <motion.div 
                                        className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl"
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                        <div className="px-4 py-3 border-b border-border">
                                            <div className="flex items-center space-x-3">
                                                <img 
                                                    className="h-10 w-10 rounded-xl ring-2 ring-accent/20" 
                                                    src={`https://ui-avatars.com/api/?name=${user?.full_name}&background=3B82F6&color=fff&size=40`} 
                                                    alt="User avatar" 
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-primary truncate">{user?.full_name}</p>
                                                    <p className="text-xs text-secondary truncate font-medium">{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="py-1">
                                            <Link 
                                                to="/profile" 
                                                onClick={() => setIsProfileMenuOpen(false)} 
                                                className="flex items-center px-4 py-2 text-sm text-secondary hover:bg-card-hover hover:text-accent transition-all duration-200 font-medium"
                                            >
                                                <UserIcon size={16} className="mr-3" />
                                                My Profile
                                            </Link>
                                            <motion.button 
                                                className="w-full flex items-center px-4 py-2 text-sm text-secondary hover:bg-card-hover hover:text-accent transition-all duration-200 font-medium"
                                                whileHover={{ x: 4 }}
                                            >
                                                <Settings size={16} className="mr-3" />
                                                Settings
                                            </motion.button>
                                        </div>
                                        
                                        <div className="border-t border-border py-1">
                                            <motion.button 
                                                onClick={handleLogout} 
                                                className="w-full flex items-center px-4 py-2 text-sm text-error hover:bg-error/10 transition-all duration-200 font-medium"
                                                whileHover={{ x: 4 }}
                                            >
                                                <LogOut size={16} className="mr-3" />
                                                Sign Out
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

// Main Layout Component
const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    // Handle responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>
            
            {/* Sidebar */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
            
            {/* Main Content */}
            <motion.div 
                className="flex-1 flex flex-col min-w-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Header 
                    onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    isSidebarOpen={isSidebarOpen}
                />

                <motion.main 
                    className="flex-1 p-4 md:p-8 overflow-auto"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </motion.main>
                
                <Footer />
            </motion.div>
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
    return 'SAMVAD';
};

export default Layout;