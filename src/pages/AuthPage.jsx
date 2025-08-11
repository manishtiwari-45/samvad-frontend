import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, signupUser, fetchCurrentUser, sendOtp, verifyOtp } from '../services/api';
import { Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';

// --- Form Components (for cleaner code) ---
const LoginForm = ({ email, setEmail, password, setPassword, handleLogin, loading, error, showPassword, setShowPassword }) => (
    <form onSubmit={handleLogin} className="space-y-6">
        <div>
            <label className="text-sm font-medium text-secondary">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
        </div>
        <div className="relative">
            <label className="text-sm font-medium text-secondary">Password</label>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-secondary">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-accent hover:bg-accent-hover font-semibold disabled:bg-gray-500 transition-colors">
            {loading ? <Loader2 className="animate-spin"/> : 'Sign In'}
        </button>
    </form>
);

const SignupDetailsForm = ({ fullName, setFullName, role, setRole, email, setEmail, password, setPassword, whatsappNumber, setWhatsappNumber, whatsappConsent, setWhatsappConsent, handleSendOtp, loading, error, showPassword, setShowPassword }) => (
    <form onSubmit={handleSendOtp} className="space-y-4">
        <div>
            <label className="text-sm font-medium text-secondary">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
        </div>
        <div>
            <label className="text-sm font-medium text-secondary">I am a...</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent">
                <option value="student">Student</option>
                <option value="club_admin">Club Admin</option>
                <option value="super_admin">Super Admin</option>
            </select>
        </div>
        <div>
            <label className="text-sm font-medium text-secondary">Email Address (@sitare.org)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
        </div>
        <div className="relative">
            <label className="text-sm font-medium text-secondary">Password</label>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-secondary">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
        <div>
            <label className="text-sm font-medium text-secondary">WhatsApp Number (e.g., +919876543210)</label>
            <input type="tel" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
        </div>
        <div className="flex items-start">
            <input id="consent" type="checkbox" checked={whatsappConsent} onChange={(e) => setWhatsappConsent(e.target.checked)} className="h-4 w-4 text-accent bg-background border-border rounded mt-1"/>
            <label htmlFor="consent" className="ml-2 block text-sm text-secondary">I agree to receive WhatsApp notifications.</label>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-accent hover:bg-accent-hover font-semibold disabled:bg-gray-500 transition-colors">
            {loading ? <Loader2 className="animate-spin"/> : 'Send Verification OTP'}
        </button>
    </form>
);

const OtpForm = ({ otp, setOtp, whatsappNumber, handleSignupAndVerify, loading, error }) => (
    <div>
        <h2 className="text-2xl font-bold text-center text-primary">Verify Your Number</h2>
        <p className="text-center text-secondary mt-2 mb-6">An OTP has been sent to {whatsappNumber}.</p>
        <form onSubmit={handleSignupAndVerify} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-secondary">Enter 6-Digit OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md text-center tracking-[.5em] focus:ring-2 focus:ring-accent" maxLength="6" required />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 font-semibold disabled:bg-gray-400 transition-colors">
                {loading ? <Loader2 className="animate-spin"/> : 'Create Account & Verify'}
            </button>
        </form>
    </div>
);


const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [signupStep, setSignupStep] = useState('details');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('student');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [whatsappConsent, setWhatsappConsent] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (!email.endsWith('@sitare.org')) {
                throw new Error("Only @sitare.org emails are allowed to log in.");
            }
            const response = await loginUser({ email, password });
            const token = response.data.access_token;
            localStorage.setItem('accessToken', token);
            const userResponse = await fetchCurrentUser();
            login(token, userResponse.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.endsWith('@sitare.org')) {
            setError("Invalid email domain. Only @sitare.org is allowed.");
            return;
        }
        if (!/^\+[1-9]\d{1,14}$/.test(whatsappNumber)) {
            setError("Please enter a valid WhatsApp number in E.164 format (e.g., +919876543210).");
            return;
        }
        setLoading(true);
        try {
            await sendOtp(whatsappNumber);
            setSignupStep('otp');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send OTP. Please check the number.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignupAndVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const signupData = { email, password, full_name: fullName, role, whatsapp_number: whatsappNumber, whatsapp_consent: whatsappConsent };
            await signupUser(signupData);
            const loginResponse = await loginUser({ email, password });
            const token = loginResponse.data.access_token;
            localStorage.setItem('accessToken', token);
            await verifyOtp(otp);
            const userResponse = await fetchCurrentUser();
            login(token, userResponse.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed. The OTP might be incorrect or the user already exists.');
        } finally {
            setLoading(false);
        }
    };
    
    const toggleForm = () => {
        setIsLogin(!isLogin);
        setSignupStep('details');
        setError('');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans animate-fade-in">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="inline-block p-3 bg-card border border-border rounded-lg">
                        <Sparkles className="h-8 w-8 text-accent" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary mt-4">
                        {isLogin ? "Welcome to StellarHub" : "Join StellarHub"}
                    </h1>
                    <p className="text-secondary mt-2">
                        {isLogin ? "Sign in to your account to continue" : "Create your account to get started"}
                    </p>
                </div>

                {/* --- DEMO ACCOUNTS WALA BOX HATA DIYA GAYA HAI --- */}

                <div className="bg-card border border-border rounded-lg p-8">
                    {isLogin ? (
                        <LoginForm {...{ email, setEmail, password, setPassword, handleLogin, loading, error, showPassword, setShowPassword }} />
                    ) : signupStep === 'details' ? (
                        <SignupDetailsForm {...{ fullName, setFullName, role, setRole, email, setEmail, password, setPassword, whatsappNumber, setWhatsappNumber, whatsappConsent, setWhatsappConsent, handleSendOtp, loading, error, showPassword, setShowPassword }} />
                    ) : (
                        <OtpForm {...{ otp, setOtp, whatsappNumber, handleSignupAndVerify, loading, error }} />
                    )}
                </div>

                <p className="text-center text-sm text-secondary">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={toggleForm} className="font-semibold text-accent hover:text-accent-hover ml-2">
                        {isLogin ? 'Sign up here' : 'Sign in here'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;