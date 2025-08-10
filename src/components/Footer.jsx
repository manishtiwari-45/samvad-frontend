import React from 'react';
import { Users, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t mt-16">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Logo and About Section */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/dashboard" className="text-2xl font-bold text-indigo-600 flex items-center">
                            <Users size={28} className="mr-2"/> CampusConnect
                        </Link>
                        <p className="mt-4 text-gray-500 text-sm">
                            Aapke college clubs aur events ke liye ek centralized platform.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="#" className="text-base text-gray-500 hover:text-gray-900">About Us</Link></li>
                            <li><Link to="#" className="text-base text-gray-500 hover:text-gray-900">Contact</Link></li>
                            <li><Link to="#" className="text-base text-gray-500 hover:text-gray-900">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="#" className="text-base text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
                            <li><Link to="#" className="text-base text-gray-500 hover:text-gray-900">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect With Us</h3>
                        <div className="flex space-x-4 mt-4">
                            <Link to="#" className="text-gray-400 hover:text-gray-500"><Facebook /></Link>
                            <Link to="#" className="text-gray-400 hover:text-gray-500"><Twitter /></Link>
                            <Link to="#" className="text-gray-400 hover:text-gray-500"><Instagram /></Link>
                            <Link to="#" className="text-gray-400 hover:text-gray-500"><Linkedin /></Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
                    <p className="text-base text-gray-400 md:order-1">
                        &copy; 2025 CampusConnect. All rights reserved.
                    </p>
                    <p className="mt-4 md:mt-0 md:order-2 text-base text-gray-500">
                        Developed by <span className="font-semibold text-indigo-600">Manish Tiwari</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;