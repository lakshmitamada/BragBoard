import React, { useState } from 'react';

// --- MOCK DATA ---
const mockDepartments = ['All', 'Engineering', 'Marketing', 'Sales', 'HR'];

// --- SVG ICONS ---
// These are needed for the visuals on the login form
const BragboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
);
const UserIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LockIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const BuildingIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;


// --- AUTH LAYOUT (used by LoginPage) ---
const AuthLayout = ({ title, children }) => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            <div className="text-center">
                 <div className="flex justify-center items-center mb-4">
                    <BragboardIcon />
                    <h1 className="text-2xl font-bold text-gray-800">Bragboard</h1>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            </div>
            {children}
        </div>
    </div>
);


// --- LOGIN PAGE COMPONENT ---
// This component now uses a default export wrapper to make it runnable in a standalone file.
function LoginPage({ onLogin, onNavigateToRegister, error }) {
    const [email, setEmail] = useState('employee@company.com');
    const [password, setPassword] = useState('password123');
    const [department, setDepartment] = useState('Engineering'); // Mocking department selection on login

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock function for login
        console.log(`Attempting login for: ${email}`);
        if(onLogin) onLogin(email, password);
    };

    return (
        <AuthLayout title="Welcome Back!">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                </div>
                <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                </div>
                 <div className="relative">
                    <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select value={department} onChange={e => setDepartment(e.target.value)} required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none bg-white">
                        {/* Start from index 1 to skip 'All' in the mockDepartments list */}
                        {mockDepartments.slice(1).map(dep => <option key={dep} value={dep}>{dep} Department</option>)}
                    </select>
                </div>
                <div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1">
                        Sign In
                    </button>
                </div>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account? <button onClick={onNavigateToRegister} className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</button>
            </p>
        </AuthLayout>
    );
}

// --- DEFAULT EXPORT WRAPPER ---
// This wrapper is necessary because the environment expects a default export function 
// when rendering a single React file.
export default function LoginWrapper() {
    // Mock handlers as they are not provided when running standalone
    const mockNavigateToRegister = () => console.log('Navigating to registration (mocked)');
    const mockLogin = (email, password) => console.log(`Attempting login with: ${email}, ${password} (mocked)`);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <LoginPage 
                onLogin={mockLogin} 
                onNavigateToRegister={mockNavigateToRegister} 
                error={null} 
            />
        </div>
    );
}

