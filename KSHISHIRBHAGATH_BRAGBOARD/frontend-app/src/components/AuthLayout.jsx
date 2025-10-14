import React, { useState } from 'react';

// --- Icon Definitions (For use within the components) ---
const Mail = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const Lock = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const UserIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;


// --- AuthLayout Component (The code you provided, slightly enhanced for icons) ---
const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 font-sans">
            <style jsx="true">{`
                .glass-card {
                    background-color: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
            `}</style>

            <header className="w-full bg-white shadow-xl relative overflow-hidden mb-8 md:mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 transform -skew-y-1 origin-top-left z-0" style={{ height: 'calc(100% + 1rem)' }}></div>
                <div className="relative z-10 max-w-7xl mx-auto flex justify-between items-center px-4 py-4 sm:px-6 lg:px-8 text-white">
                    <h1 className="text-2xl font-extrabold tracking-wider cursor-pointer transition hover:scale-[1.02]">
                        Bragboard
                    </h1>
                    <div className="flex space-x-4">
                        <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition duration-150 transform hover:scale-110" aria-label="Home">
                            <HomeIcon className="w-6 h-6"/>
                        </button>
                        <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition duration-150 transform hover:scale-110" aria-label="Profile">
                            <UserIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-grow flex items-center justify-center w-full p-4 mt-[-60px] sm:mt-[-80px]">
                <div className="w-full max-w-lg glass-card p-6 sm:p-10 rounded-2xl">
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">{title}</h2>
                    <p className="text-center text-gray-500 mb-8">{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
};


// --- AuthInput and Button Helpers (To make the form functional) ---
const AuthInput = ({ type, name, placeholder, icon: Icon, value, onChange }) => (
    <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm text-sm bg-white border-gray-300"
        />
    </div>
);

const PrimaryButton = ({ children, type = 'button' }) => (
    <button
        type={type}
        className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
        {children}
    </button>
);


// --- Login Component (Demonstrates usage of AuthLayout) ---
const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would handle Firebase/API login logic
        console.log('Attempting login with:', formData);
    };

    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Sign in to your account to view the Bragboard feed."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <AuthInput
                    type="email" name="email" placeholder="Email Address" icon={Mail}
                    value={formData.email} onChange={handleChange}
                />
                <AuthInput
                    type="password" name="password" placeholder="Password" icon={Lock}
                    value={formData.password} onChange={handleChange}
                />
                <PrimaryButton type="submit">
                    Sign In Securely
                </PrimaryButton>
                <div className="text-center pt-2 text-sm text-gray-600">
                    Need an account? {' '}
                    <a href="#" className="text-indigo-600 font-medium cursor-pointer hover:text-indigo-800 transition">
                        Register
                    </a>
                </div>
            </form>
        </AuthLayout>
    );
};


// --- Main Application Component ---
export default function App() {
    // In a real application, you would use a router here to switch between Login, Register, and Dashboard.
    // For this demonstration, we just show the Login component wrapped in the AuthLayout.
    return (
        <Login />
    );
}
