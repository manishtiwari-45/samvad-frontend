import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { authApi, verificationApi } from '../services/api';
import { Loader2, Eye, EyeOff, ArrowLeft, ArrowRight, Hexagon, Mail, Lock, User, CheckCircle, AlertCircle, Star, Users, Calendar, Phone, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


// Mock implementations removed - using real imports now


// Google Icon SVG
const GoogleIcon = (props) => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" {...props}>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
    </svg>
);

// Role Selector Component
const RoleSelector = ({ value, onChange, label = "Select your role" }) => {
    const roles = [
        { value: 'student', label: 'Student', icon: User, description: 'Join clubs and attend events' },
        { value: 'club_admin', label: 'Club Admin', icon: UserCheck, description: 'Manage club activities and events' },
        { value: 'super_admin', label: 'Super Admin', icon: Star, description: 'Full system administration' }
    ];

    return (
        <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <label className="block text-base font-semibold text-primary mb-4">{label}</label>
            <div className="grid gap-3">
                {roles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                        <motion.label
                            key={role.value}
                            className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                value === role.value
                                    ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
                                    : 'border-border bg-background hover:border-accent/30 hover:bg-accent/5'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <input
                                type="radio"
                                name="role"
                                value={role.value}
                                checked={value === role.value}
                                onChange={(e) => onChange(e.target.value)}
                                className="sr-only"
                            />
                            <div className="flex items-center space-x-4 w-full">
                                <div className={`p-3 rounded-xl ${
                                    value === role.value ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
                                }`}>
                                    <IconComponent size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-lg font-semibold text-primary">{role.label}</div>
                                    <div className="text-base text-secondary">{role.description}</div>
                                </div>
                                {value === role.value && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-5 h-5 bg-accent rounded-full flex items-center justify-center"
                                    >
                                        <CheckCircle size={16} className="text-white" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.label>
                    );
                })}
            </div>
        </motion.div>
    );
};

// Enhanced Input Field Component with modern styling
const InputField = ({ icon: Icon, label, error, ...props }) => {
    const [focused, setFocused] = useState(false);
    
    return (
        <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <label className="block text-base font-semibold text-primary">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                    <Icon className={`h-6 w-6 transition-all duration-300 ${
                        error ? 'text-error' : focused ? 'text-accent scale-110' : 'text-secondary group-hover:text-accent'
                    }`} />
                </div>
                <input
                    {...props}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`block w-full pl-14 pr-5 py-5 text-lg border-2 rounded-2xl bg-background shadow-sm placeholder-secondary/60 focus:outline-none focus:ring-4 focus:ring-accent/20 transition-all duration-300 text-primary font-medium ${
                        error 
                            ? 'border-error focus:border-error shadow-error/10' 
                            : focused
                            ? 'border-accent shadow-accent/10 bg-accent/5'
                            : 'border-border hover:border-accent/50 hover:shadow-md'
                    }`}
                />
                {props.type === 'password' && (
                    <button
                        type="button"
                        onClick={props.onTogglePassword}
                        className="absolute inset-y-0 right-0 pr-5 flex items-center z-10 text-secondary hover:text-accent transition-colors duration-200"
                    >
                        {props.showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                )}
                {/* Floating border effect */}
                <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-accent/20 to-accent-light/20 opacity-0 transition-opacity duration-300 pointer-events-none ${
                    focused ? 'opacity-100' : ''
                }`} />
            </div>
            <AnimatePresence>
                {error && (
                    <motion.div 
                        className="flex items-center space-x-2 text-error text-sm font-medium"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Enhanced Modern Button Component
const Button = ({ children, variant = 'primary', loading = false, ...props }) => {
    const baseClasses = "w-full flex items-center justify-center px-8 py-5 text-lg rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 transform active:scale-95";
    const variants = {
        primary: "bg-gradient-to-r from-accent via-accent to-accent-hover text-white hover:from-accent-hover hover:to-accent-dark focus:ring-accent/30 shadow-lg hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-1",
        secondary: "bg-background border-2 border-border text-primary hover:bg-background-secondary hover:border-accent/50 focus:ring-accent/20 shadow-sm hover:shadow-md",
        google: "bg-white border-2 border-border text-primary hover:bg-background-secondary hover:border-accent/30 focus:ring-accent/20 shadow-sm hover:shadow-lg"
    };
    
    return (
        <motion.button
            {...props}
            disabled={loading || props.disabled}
            className={`${baseClasses} ${variants[variant]} ${loading || props.disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
            whileHover={{ scale: loading || props.disabled ? 1 : 1.02 }}
            whileTap={{ scale: loading || props.disabled ? 1 : 0.98 }}
        >
            {loading ? (
                <>
                    <Loader2 className="animate-spin mr-3 h-5 w-5" />
                    <span>Loading...</span>
                </>
            ) : (
                children
            )}
        </motion.button>
    );
};

// Enhanced Login Form Component
const LoginForm = ({ email, setEmail, password, setPassword, role, setRole, handleLogin, handleGoogleLoginClick, loading, error, showPassword, setShowPassword, switchToSignup, fieldErrors = {} }) => (
    <motion.div 
        className="space-y-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.4 }}
    >
        <div className="text-center space-y-3">
            <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                Welcome back
            </motion.h2>
            <motion.p 
                className="text-lg md:text-xl text-secondary font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Sign in to your StarHive account
            </motion.p>
        </div>

        <AnimatePresence>
            {error && (
                <motion.div 
                    className="bg-error/5 border border-error/20 rounded-2xl p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-error mr-3" />
                        <p className="text-error font-medium">{error}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-8">
            <InputField
                icon={Mail}
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                error={fieldErrors.email}
                required
            />

            <InputField
                icon={Lock}
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                error={fieldErrors.password}
                required
            />

            <RoleSelector 
                value={role} 
                onChange={setRole} 
                label="Login as"
            />

            <div className="flex items-center justify-between">
                <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.02 }}
                >
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-accent focus:ring-accent border-border rounded transition-colors"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm text-primary font-medium">
                        Remember me
                    </label>
                </motion.div>
                <Link 
                    to="/forgot-password" 
                    className="text-sm text-accent hover:text-accent-hover font-semibold transition-colors duration-200"
                >
                    Forgot password?
                </Link>
            </div>

            <Button type="submit" loading={loading}>
                <span className="flex items-center">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                </span>
            </Button>
        </form>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-secondary font-medium">Or continue with</span>
            </div>
        </div>

        <Button variant="google" onClick={handleGoogleLoginClick}>
            <GoogleIcon />
            <span>Sign in with Google</span>
        </Button>

        <div className="text-center pt-4">
            <p className="text-secondary">
                Don't have an account?{' '}
                <button
                    type="button"
                    onClick={switchToSignup}
                    className="font-semibold text-accent hover:text-accent-hover transition-colors duration-200"
                >
                    Sign up
                </button>
            </p>
        </div>
    </motion.div>
);

// Enhanced Signup Form Component
const SignupForm = ({ fullName, setFullName, email, setEmail, password, setPassword, whatsappNumber, setWhatsappNumber, whatsappConsent, setWhatsappConsent, role, setRole, handleSignup, loading, error, showPassword, setShowPassword, switchToLogin, fieldErrors = {} }) => (
    <motion.div 
        className="space-y-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
    >
        <div className="text-center space-y-3">
            <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                Create your account
            </motion.h2>
            <motion.p 
                className="text-lg md:text-xl text-secondary font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Join the StarHive community
            </motion.p>
        </div>

        <AnimatePresence>
            {error && (
                <motion.div 
                    className="bg-error/5 border border-error/20 rounded-2xl p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-error mr-3" />
                        <p className="text-error font-medium">{error}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <form onSubmit={handleSignup} className="space-y-8">
            <InputField
                icon={User}
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                error={fieldErrors.fullName}
                required
            />

            <InputField
                icon={Mail}
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                error={fieldErrors.email}
                required
            />

            <InputField
                icon={Lock}
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                error={fieldErrors.password}
                required
            />

            <InputField
                icon={Phone}
                label="WhatsApp Number (Optional)"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Enter your WhatsApp number"
                error={fieldErrors.whatsappNumber}
            />

            <RoleSelector 
                value={role} 
                onChange={setRole} 
                label="Sign up as"
            />

            <motion.div 
                className="flex items-center space-y-4 flex-col"
                whileHover={{ scale: 1.02 }}
            >
                <div className="flex items-center w-full">
                    <input
                        id="whatsapp-consent"
                        name="whatsapp-consent"
                        type="checkbox"
                        checked={whatsappConsent}
                        onChange={(e) => setWhatsappConsent(e.target.checked)}
                        className="h-4 w-4 text-accent focus:ring-accent border-border rounded transition-colors"
                    />
                    <label htmlFor="whatsapp-consent" className="ml-3 block text-sm text-primary font-medium">
                        I consent to receive WhatsApp notifications for events and updates
                    </label>
                </div>
                <div className="flex items-center w-full">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 text-accent focus:ring-accent border-border rounded transition-colors"
                        required
                    />
                    <label htmlFor="terms" className="ml-3 block text-sm text-primary font-medium">
                        I agree to the{' '}
                        <Link to="/terms" className="text-accent hover:text-accent-hover font-semibold">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-accent hover:text-accent-hover font-semibold">
                            Privacy Policy
                        </Link>
                    </label>
                </div>
            </motion.div>

            <Button type="submit" loading={loading}>
                <span className="flex items-center">
                    Create Account
                    <CheckCircle className="ml-2 h-5 w-5" />
                </span>
            </Button>
        </form>

        <div className="text-center pt-4">
            <p className="text-secondary">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={switchToLogin}
                    className="font-semibold text-accent hover:text-accent-hover transition-colors duration-200"
                >
                    Sign in
                </button>
            </p>
        </div>
    </motion.div>
);

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    
    // Get mode from URL query params or default to 'login'
    const searchParams = new URLSearchParams(location.search);
    const [mode, setMode] = useState(searchParams.get('mode') || 'login');
    const isLogin = mode === 'login';
    
    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [whatsappConsent, setWhatsappConsent] = useState(false);
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Update URL when mode changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (mode !== 'login') {
            params.set('mode', mode);
        }
        navigate({ search: params.toString() }, { replace: true });
    }, [mode, navigate]);

    // Handle Google Login
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                const response = await authApi.loginWithGoogle(tokenResponse.access_token, role);
                
                if (response.data.access_token) {
                    localStorage.setItem('accessToken', response.data.access_token);
                    const userResponse = await authApi.getCurrentUser();
                    login(userResponse.data);
                    
                    // Role-based redirection
                    const redirectPath = getRoleBasedRedirect(userResponse.data.role);
                    navigate(redirectPath, { replace: true });
                }
            } catch (err) {
                setError(err.message || 'Failed to login with Google');
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google Login Error:', error);
            setError('Failed to login with Google');
        }
    });

    // Role-based redirect function
    const getRoleBasedRedirect = (userRole) => {
        switch (userRole) {
            case 'super_admin':
                return '/dashboard'; // Super admin dashboard
            case 'club_admin':
                return '/dashboard'; // Club admin dashboard
            case 'student':
            default:
                return '/dashboard'; // Student dashboard
        }
    };

    // Handle regular login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userData = await login({ email, password });
            
            // Role-based redirection
            const redirectPath = getRoleBasedRedirect(userData.role || 'student');
            navigate(redirectPath, { replace: true });
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    // Handle signup
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authApi.signup({
                full_name: fullName,
                email,
                password,
                role,
                whatsapp_number: whatsappNumber || '',
                whatsapp_consent: whatsappConsent
            });
            
            // After successful signup, try to login
            const userData = await login({ email, password });
            
            // Role-based redirection
            const redirectPath = getRoleBasedRedirect(userData.role || role);
            navigate(redirectPath, { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const switchToSignup = () => setMode('signup');
    const switchToLogin = () => setMode('login');

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary flex">
            {/* Left Side - Branding & Features */}
            <motion.div 
                className="hidden lg:flex lg:flex-1 relative overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent-light/5 to-transparent" />
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-30" />
                
                <div className="relative flex flex-col justify-center px-12 py-16 lg:py-20">
                    {/* Logo */}
                    <motion.div 
                        className="mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-hover rounded-2xl flex items-center justify-center shadow-lg relative">
                                <Hexagon className="h-8 w-8 text-white absolute" />
                                <Star className="h-4 w-4 text-white relative z-10" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-primary">StarHive</h1>
                                <p className="text-lg text-secondary font-medium">Campus Community Platform</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Features */}
                    <motion.div 
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div>
                            <h2 className="text-4xl font-bold text-primary mb-6 leading-tight">
                                Connect, Engage,{' '}
                                <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
                                    Thrive
                                </span>
                            </h2>
                            <p className="text-xl text-secondary leading-relaxed">
                                Join your campus community and discover opportunities that matter to you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Users, title: 'Join Clubs', desc: 'Connect with like-minded students' },
                                { icon: Calendar, title: 'Attend Events', desc: 'Never miss important activities' },
                                { icon: Star, title: 'Build Network', desc: 'Create lasting relationships' }
                            ].map((feature, index) => (
                                <motion.div 
                                    key={feature.title}
                                    className="flex items-start space-x-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                >
                                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <feature.icon className="h-5 w-5 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary">{feature.title}</h3>
                                        <p className="text-secondary text-sm">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Auth Form */}
            <div className="flex-1 lg:max-w-2xl xl:max-w-3xl flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-lg">
                    {/* Back to Home Button */}
                    <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Link 
                            to="/" 
                            className="inline-flex items-center text-secondary hover:text-accent transition-colors duration-200 font-medium"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Link>
                    </motion.div>

                    {/* Mobile Logo */}
                    <motion.div 
                        className="lg:hidden text-center mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent to-accent-hover rounded-2xl mb-6 shadow-lg relative">
                            <Hexagon className="h-10 w-10 text-white absolute" />
                            <Star className="h-5 w-5 text-white relative z-10" />
                        </div>
                        <h1 className="text-3xl font-bold text-primary mb-3">StarHive</h1>
                        <p className="text-lg text-secondary font-medium">Your campus community platform</p>
                    </motion.div>

                    {/* Auth Form Container */}
                    <motion.div 
                        className="bg-card rounded-3xl shadow-2xl border border-border p-10 lg:p-12 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <AnimatePresence mode="wait">
                            {isLogin ? (
                                <LoginForm 
                                    key="login"
                                    email={email}
                                    setEmail={setEmail}
                                    password={password}
                                    setPassword={setPassword}
                                    role={role}
                                    setRole={setRole}
                                    handleLogin={handleLogin}
                                    handleGoogleLoginClick={handleGoogleLogin}
                                    loading={loading}
                                    error={error}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    switchToSignup={switchToSignup}
                                />
                            ) : (
                                <SignupForm 
                                    key="signup"
                                    fullName={fullName}
                                    setFullName={setFullName}
                                    email={email}
                                    setEmail={setEmail}
                                    password={password}
                                    setPassword={setPassword}
                                    whatsappNumber={whatsappNumber}
                                    setWhatsappNumber={setWhatsappNumber}
                                    whatsappConsent={whatsappConsent}
                                    setWhatsappConsent={setWhatsappConsent}
                                    role={role}
                                    setRole={setRole}
                                    handleSignup={handleSignup}
                                    loading={loading}
                                    error={error}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    switchToLogin={switchToLogin}
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Footer */}
                    <motion.div 
                        className="mt-8 text-center text-sm text-secondary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p>&copy; 2024 StarHive. All rights reserved.</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

