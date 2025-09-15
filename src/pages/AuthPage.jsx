// AuthPage.jsx - Standalone version with mocks for compatibility

import React, { useState, createContext, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useGoogleLogin } from '@react-oauth/google';
// import { useAuth } from '../context/AuthContext'; 
// import { authApi, verificationApi } from '../services/api'; 

import { Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';


// --- MOCK IMPLEMENTATIONS to make component runnable in isolation ---
// In your real project, you would remove these and use the actual imports above.
const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);
const useAuth = () => ({
    login: (token, user) => console.log('AuthContext Login called with:', { token, user })
});
const useGoogleLogin = ({ onSuccess, onError }) => {
    return () => {
        console.log("Google Login Hook Triggered");
        try {
            // Simulate a successful login
            onSuccess({ access_token: 'mock_google_token' });
        } catch (error) {
            onError(error);
        }
    };
};
const authApi = {
    login: (credentials) => Promise.resolve({ data: { access_token: 'mock_jwt_token' } }),
    loginWithGoogle: (token) => Promise.resolve({ data: { access_token: 'mock_jwt_from_google' } }),
    getCurrentUser: () => Promise.resolve({ data: { name: 'Mock User', email: 'user@sitare.org' } }),
    signup: (userData) => Promise.resolve({ data: { message: 'Signup successful' } }),
};
const verificationApi = {
    sendOtp: (number) => Promise.resolve({ data: { message: `OTP sent to ${number}` } }),
    verifyOtp: (otp) => Promise.resolve({ data: { message: `OTP ${otp} verified` } }),
};
// --- End of Mock Implementations ---


// --- A little style for our modern look ---
const PageStyles = () => (
    <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .form-container-animate { animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards, fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
    `}</style>
);

// --- Google Icon SVG ---
const GoogleIcon = (props) => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 6.84C34.553 2.964 29.615 1 24 1C10.745 1 0 11.745 0 25s10.745 24 24 24s24-10.745 24-24c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691c-1.645 3.118-2.306 6.643-2.306 10.309c0 3.666.661 7.191 2.306 10.309l-5.344 4.14C.603 34.936 0 30.136 0 25c0-5.136.603-9.936 1.962-14.45L6.306 14.691z"></path><path fill="#4CAF50" d="M24 48c5.636 0 10.731-1.746 14.691-4.834l-5.04-3.912C30.56 41.875 27.464 43 24 43c-4.773 0-8.814-2.556-10.82-6.161l-5.53 4.27C10.51 44.225 16.71 48 24 48z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.447-2.233 4.562-4.243 6.159l5.04 3.912C41.345 34.613 44 29.836 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

// --- Reusable UI Components ---
const LoginForm = ({ email, setEmail, password, setPassword, handleLogin, handleGoogleLoginClick, loading, error, showPassword, setShowPassword }) => (
    <form onSubmit={handleLogin} className="space-y-6">
         <div>
            <label className="text-sm font-medium text-gray-300">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300" required />
        </div>
        <div className="relative">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
        {error && <p className="text-red-400 text-sm text-center font-semibold">{error}</p>}
        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-900/40">
            {loading ? <Loader2 className="animate-spin"/> : 'Sign In'}
        </button>
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-600"></div><span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold">OR</span><div className="flex-grow border-t border-gray-600"></div>
        </div>
        <button type="button" onClick={handleGoogleLoginClick} disabled={loading} className="w-full flex items-center justify-center py-3 px-4 rounded-lg border border-gray-600 bg-gray-700/40 hover:bg-gray-700/80 font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50">
           <GoogleIcon /> Sign In with Google
        </button>
    </form>
);

const SignupDetailsForm = ({ fullName, setFullName, role, setRole, email, setEmail, password, setPassword, whatsappNumber, setWhatsappNumber, whatsappConsent, setWhatsappConsent, handleSendOtp, loading, error, showPassword, setShowPassword }) => (
    <form onSubmit={handleSendOtp} className="space-y-4">
        <input placeholder="Full Name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white" required />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white">
            <option value="student">Student</option>
            <option value="club_admin">Club Admin</option>
            <option value="super_admin">Super Admin</option>
        </select>
        <input placeholder="Email Address (@sitare.org)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white" required />
        <input placeholder="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white" required />
        <input placeholder="WhatsApp Number (+91...)" type="tel" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="mt-1 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white" required />
        <div className="flex items-center"><input id="consent" type="checkbox" checked={whatsappConsent} onChange={(e) => setWhatsappConsent(e.target.checked)} className="h-4 w-4 text-purple-600 bg-gray-700 border-gray-600 rounded"/><label htmlFor="consent" className="ml-2 block text-sm text-gray-300">I agree to receive WhatsApp notifications.</label></div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 font-semibold disabled:opacity-50 transition-all duration-300 transform hover:scale-105">
            {loading ? <Loader2 className="animate-spin"/> : 'Send Verification OTP'}
        </button>
    </form>
);

const OtpForm = ({ otp, setOtp, whatsappNumber, handleSignupAndVerify, loading, error }) => (
    <div>
        <h2 className="text-2xl font-bold text-center text-white">Verify Your Number</h2>
        <p className="text-center text-gray-300 mt-2 mb-6">An OTP has been sent to {whatsappNumber}.</p>
        <form onSubmit={handleSignupAndVerify} className="space-y-4">
            <input placeholder="6-Digit OTP" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-center tracking-[.5em] text-white" maxLength="6" required />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 font-semibold disabled:opacity-50 transition-all duration-300 transform hover:scale-105">
                {loading ? <Loader2 className="animate-spin"/> : 'Create Account & Verify'}
            </button>
        </form>
    </div>
);


const AuthPage = () => {
    // --- State Management ---
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
    
    // --- Hooks ---
    const { login } = useAuth();
    const navigate = useNavigate();

    // --- Handlers ---
    const handleLogin = async (e) => { 
        e.preventDefault(); 
        setLoading(true); 
        setError('');
        try { 
            const response = await authApi.login({ email, password }); 
            const token = response.data.access_token;
            localStorage.setItem('accessToken', token); 
            const userResponse = await authApi.getCurrentUser(); 
            login(token, userResponse.data); 
            navigate('/dashboard'); 
        } catch (err) { 
            setError(err.message || 'Login failed. Please check your credentials.'); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleGoogleSuccess = async (tokenResponse) => { 
        setLoading(true); 
        setError('');
        try { 
            const response = await authApi.loginWithGoogle(tokenResponse.access_token); 
            const token = response.data.access_token;
            localStorage.setItem('accessToken', token); 
            const userResponse = await authApi.getCurrentUser(); 
            login(token, userResponse.data); 
            navigate('/dashboard'); 
        } catch (err) { 
            setError(err.message || 'Google Sign-In failed. Please try again.'); 
        } finally { 
            setLoading(false); 
        }
    };
    
    const handleGoogleError = (err) => {
        console.error("Google Login Error:", err);
        setError('Google authentication failed. The popup might have been closed.');
    };
    
    const googleLogin = useGoogleLogin({ onSuccess: handleGoogleSuccess, onError: handleGoogleError });
    
    const handleSendOtp = async (e) => { 
        e.preventDefault(); 
        setLoading(true); 
        setError('');
        try { 
            if (!email.endsWith('@sitare.org')) {
                throw new Error("Only @sitare.org emails are allowed for signup.");
            }
            await verificationApi.sendOtp(whatsappNumber); 
            setSignupStep('otp'); 
        } catch (err) { 
            setError(err.message || 'Failed to send OTP. Please check the number.'); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleSignupAndVerify = async (e) => { 
        e.preventDefault(); 
        setLoading(true); 
        setError('');
        try { 
            await authApi.signup({ email, password, full_name: fullName, role, whatsapp_number: whatsappNumber, whatsapp_consent: whatsappConsent }); 
            const loginResponse = await authApi.login({ email, password }); 
            const token = loginResponse.data.access_token;
            localStorage.setItem('accessToken', token); 
            await verificationApi.verifyOtp(otp); 
            const userResponse = await authApi.getCurrentUser(); 
            login(token, userResponse.data); 
            navigate('/dashboard'); 
        } catch (err) { 
            setError(err.message || 'Signup failed. OTP may be incorrect or user may already exist.'); 
        } finally { 
            setLoading(false); 
        }
    };

    const toggleForm = () => { 
        setIsLogin(!isLogin); 
        setSignupStep('details'); 
        setError(''); 
    };

    const formKey = isLogin ? 'login' : signupStep;

    return (
        <>
            <PageStyles />
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-br from-[#10111a] via-[#10111a] to-[#1c1d2e] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,250,0.05)_0%,_rgba(255,255,255,0)_60%)]"></div>
                <div className="w-full max-w-md space-y-8 z-10 form-container-animate">
                    <div className="text-center">
                        <div className="inline-block p-4 bg-gray-800/60 border border-gray-700 rounded-xl shadow-lg">
                            <Sparkles className="h-8 w-8 text-purple-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mt-4 tracking-tight">
                            {isLogin ? "Welcome Back" : "Join StellarHub"}
                        </h1>
                        <p className="text-gray-400 mt-2">
                            {isLogin ? "Sign in to access your universe" : "Create an account to get started"}
                        </p>
                    </div>
                    <div key={formKey} className="bg-gray-800/40 border border-gray-700 rounded-2xl p-8 shadow-2xl shadow-black/30 backdrop-blur-lg form-container-animate">
                        {isLogin ? (
                            <LoginForm {...{ email, setEmail, password, setPassword, handleLogin, loading, error, showPassword, setShowPassword }} handleGoogleLoginClick={() => googleLogin()} />
                        ) : signupStep === 'details' ? (
                            <SignupDetailsForm {...{ fullName, setFullName, role, setRole, email, setEmail, password, setPassword, whatsappNumber, setWhatsappNumber, whatsappConsent, setWhatsappConsent, handleSendOtp, loading, error, showPassword, setShowPassword }} />
                        ) : (
                            <OtpForm {...{ otp, setOtp, whatsappNumber, handleSignupAndVerify, loading, error }} />
                        )}
                    </div>
                    <p className="text-center text-sm text-gray-400">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <button onClick={toggleForm} className="font-semibold text-purple-400 hover:text-purple-300 ml-2 transition-colors duration-300">
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
};

export default AuthPage;

