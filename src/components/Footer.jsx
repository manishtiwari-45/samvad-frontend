import React from 'react';
import { Sparkles, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-card border-t border-border mt-16">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Logo and About Section */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/dashboard" className="text-2xl font-bold text-primary flex items-center">
                            <Sparkles size={28} className="mr-2 text-accent"/> StellarHub
                        </Link>
                        <p className="mt-4 text-secondary text-sm">
                            Aapke college clubs aur events ke liye ek centralized platform.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-primary tracking-wider uppercase">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="#" className="text-base text-secondary hover:text-primary">About Us</Link></li>
                            <li><Link to="#" className="text-base text-secondary hover:text-primary">Contact</Link></li>
                            <li><Link to="#" className="text-base text-secondary hover:text-primary">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-primary tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="#" className="text-base text-secondary hover:text-primary">Privacy Policy</Link></li>
                            <li><Link to="#" className="text-base text-secondary hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-sm font-semibold text-primary tracking-wider uppercase">Connect With Us</h3>
                        <div className="flex space-x-4 mt-4">
                            <Link to="#" className="text-secondary hover:text-primary"><Facebook /></Link>
                            <Link to="#" className="text-secondary hover:text-primary"><Twitter /></Link>
                            <Link to="#" className="text-secondary hover:text-primary"><Instagram /></Link>
                            <Link to="#" className="text-secondary hover:text-primary"><Linkedin /></Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 border-t border-border pt-8 md:flex md:items-center md:justify-between">
                    <p className="text-base text-secondary md:order-1">
                        &copy; 2025 StellarHub. All rights reserved.
                    </p>
                    <p className="mt-4 md:mt-0 md:order-2 text-base text-secondary">
                        Developed by <span className="font-semibold text-accent">Manish Tiwari</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;