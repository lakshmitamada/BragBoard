import React, { useState, useEffect, useMemo } from 'react';

// ====================================================================
// 1. MOCK DATA & UTILITIES
// ====================================================================

const mockUsers = [
    { id: 'user-1', name: 'Alice Johnson', email: 'alice@brag.com', department: 'Engineering', profilePic: 'https://placehold.co/40x40/6366f1/ffffff?text=AJ' },
    { id: 'user-2', name: 'Bob Smith', email: 'bob@brag.com', department: 'Marketing', profilePic: 'https://placehold.co/40x40/f97316/ffffff?text=BS' },
    { id: 'user-3', name: 'Charlie Day', email: 'charlie@brag.com', department: 'Sales', profilePic: 'https://placehold.co/40x40/10b981/ffffff?text=CD' },
    { id: 'user-4', name: 'Dana Scully', email: 'dana@brag.com', department: 'HR', profilePic: 'https://placehold.co/40x40/ef4444/ffffff?text=DS' },
    { id: 'user-5', name: 'Current User', email: 'test@user.com', department: 'Engineering', profilePic: 'https://placehold.co/40x40/8b5cf6/ffffff?text=ME' },
];

const initialPosts = [
    { id: 'p1', authorId: 'user-1', recipientId: 'user-5', message: "Huge congrats to the whole team for shipping the Q4 feature ahead of schedule! Especially great work on the backend stability.", type: 'achievement', likes: ['user-2', 'user-3'], timestamp: new Date(Date.now() - 86400000 * 2) },
    { id: 'p2', authorId: 'user-3', recipientId: 'user-2', message: "Bob crushed the Q2 target by 150%! Truly inspirational dedication and focus. Way to go!", type: 'leadership', likes: ['user-1', 'user-5'], timestamp: new Date(Date.now() - 86400000 * 3) },
    { id: 'p3', authorId: 'user-4', recipientId: 'user-1', message: "Alice ran an amazing internal training session on new compliance rules. Super clear and engaging!", type: 'teamwork', likes: ['user-2'], timestamp: new Date(Date.now() - 86400000) },
    { id: 'p4', authorId: 'user-5', recipientId: 'user-4', message: "Thanks to Dana for always having a clear and positive attitude, even when things are hectic. Your support is noticed!", type: 'positivity', likes: [], timestamp: new Date() },
];

const mockDepartments = ['All', 'Engineering', 'Marketing', 'Sales', 'HR'];

// Utility to format time for post cards
const TimeAgo = ({ date }) => {
    const timePassed = Math.round((Date.now() - date.getTime()) / 60000);
    let timeText;
    if (timePassed < 60) {
        timeText = `${timePassed} min ago`;
    } else if (timePassed < 1440) {
        timeText = `${Math.round(timePassed / 60)} hours ago`;
    } else {
        timeText = date.toLocaleDateString();
    }
    return <span className="text-xs text-gray-500">{timeText}</span>;
};

// ====================================================================
// 2. SVG ICONS & COMMON COMPONENTS
// ====================================================================

const Mail = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const Lock = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const User = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const PlusIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const BarChartIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const LogOutIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const AwardIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 18 17 23 15.79 13.89"></polyline></svg>;
const HeartIcon = ({ className, filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} fill={filled ? 'currentColor' : 'none'}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    </svg>
);
const BragboardIcon = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
);

// Reusable Input Field Component
const AuthInput = ({ type, name, placeholder, icon: Icon, value, onChange, disabled = false }) => (
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
            disabled={disabled}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm text-sm 
                ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300'}`}
        />
    </div>
);

const PrimaryButton = ({ children, onClick, type = 'button', disabled = false, className = '' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-3 px-4 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
        {children}
    </button>
);

const SuccessButton = ({ children, onClick, type = 'button', disabled = false, className = '' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-3 px-4 rounded-xl text-white font-semibold bg-emerald-600 hover:bg-emerald-700 transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
        {children}
    </button>
);

const AuthLayout = ({ title, children }) => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500/10 via-purple-500/20 to-pink-500/10 p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 space-y-6">
            <div className="text-center">
                 <div className="flex justify-center items-center mb-4 text-indigo-600">
                    <BragboardIcon className="h-8 w-8 mr-2" />
                    <h1 className="text-3xl font-extrabold text-gray-800">Bragboard</h1>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            </div>
            {children}
        </div>
    </div>
);

// Auth Message Box (for notifications)
const MessageBox = ({ msg, type, onClose }) => (
    <div 
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    >
        <div className="flex items-center justify-between">
            <span>{msg}</span>
            <button onClick={onClose} className="ml-4 text-white font-bold opacity-70 hover:opacity-100">&times;</button>
        </div>
    </div>
);

// ====================================================================
// 3. PAGE COMPONENTS (REPLACEMENT FOR PAGES FOLDER)
// ====================================================================

/**
 * --- LOGIN PAGE ---
 * Handles login form and mock API calls.
 */
const LoginPage = ({ setRoute, onLoginSuccess, setAuthMessage }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setAuthMessage({ message: null, type: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthMessage({ message: null, type: null });

        // --- MOCK API CALL ---
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        if (formData.email === 'test@user.com' && formData.password === 'password123') {
             const mockUser = mockUsers.find(u => u.email === 'test@user.com');
             localStorage.setItem('token', 'mock-token-12345');
             setIsLoading(false);
             onLoginSuccess({ message: 'Successfully logged in.', type: 'success', user: mockUser });
        } else {
             setIsLoading(false);
             setAuthMessage({ message: 'Login failed. Use test@user.com / password123.', type: 'error' });
        }
    };

    return (
        <AuthLayout title="Sign In">
            <form onSubmit={handleSubmit} className="space-y-6">
                <AuthInput
                    type="email" name="email" placeholder="Email (e.g., test@user.com)" icon={Mail}
                    value={formData.email} onChange={handleChange} disabled={isLoading}
                />
                <AuthInput
                    type="password" name="password" placeholder="Password (e.g., password123)" icon={Lock}
                    value={formData.password} onChange={handleChange} disabled={isLoading}
                />
                <PrimaryButton type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </PrimaryButton>
                <div className="text-center pt-2 text-sm text-gray-600">
                    Don't have an account? {' '}
                    <span className="text-indigo-600 font-medium cursor-pointer hover:text-indigo-800 transition" onClick={() => setRoute('register')}>
                        Register here
                    </span>
                </div>
            </form>
        </AuthLayout>
    );
};

/**
 * --- REGISTER PAGE ---
 * Handles registration form and mock API calls.
 */
const RegisterPage = ({ setRoute, onRegisterSuccess, setAuthMessage }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setAuthMessage({ message: null, type: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthMessage({ message: null, type: null });

        if (formData.password !== formData.confirmPassword) {
            setAuthMessage({ message: 'Error: Passwords do not match.', type: 'error' });
            setIsLoading(false);
            return;
        }

        // --- MOCK API CALL ---
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock Success
        setIsLoading(false);
        onRegisterSuccess({ message: `Success! ${formData.email} registered. Please sign in.`, type: 'success' });
    };

    return (
        <AuthLayout title="Create Account">
            <form onSubmit={handleSubmit} className="space-y-6">
                <AuthInput
                    type="text" name="name" placeholder="Full Name" icon={User}
                    value={formData.name} onChange={handleChange} disabled={isLoading}
                />
                <AuthInput
                    type="email" name="email" placeholder="Email Address" icon={Mail}
                    value={formData.email} onChange={handleChange} disabled={isLoading}
                />
                <AuthInput
                    type="password" name="password" placeholder="Password (min 8 characters)" icon={Lock}
                    value={formData.password} onChange={handleChange} disabled={isLoading}
                />
                <AuthInput
                    type="password" name="confirmPassword" placeholder="Confirm Password" icon={Lock}
                    value={formData.confirmPassword} onChange={handleChange} disabled={isLoading}
                />
                <SuccessButton type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </SuccessButton>
                <div className="text-center pt-2 text-sm text-gray-600">
                    Already have an account? {' '}
                    <span className="text-indigo-600 font-medium cursor-pointer hover:text-indigo-800 transition" onClick={() => setRoute('login')}>
                        Sign in
                    </span>
                </div>
            </form>
        </AuthLayout>
    );
};

// --- Sub-Components of Dashboard ---

const PostCard = ({ post, user, onLike }) => {
    const recipient = mockUsers.find(u => u.id === post.recipientId);
    const author = mockUsers.find(u => u.id === post.authorId);
    const isLiked = post.likes.includes(user.id);

    const getIcon = (type) => {
        switch (type) {
            case 'achievement': return <AwardIcon className="h-6 w-6 text-yellow-500" />;
            case 'leadership': return <AwardIcon className="h-6 w-6 text-red-500" />;
            case 'teamwork': return <AwardIcon className="h-6 w-6 text-blue-500" />;
            case 'positivity': return <AwardIcon className="h-6 w-6 text-green-500" />;
            default: return <AwardIcon className="h-6 w-6 text-indigo-500" />;
        }
    }

    return (
        <div className="glass-card p-6 mb-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/50">
            <div className="flex items-center space-x-3 mb-4">
                <img src={recipient.profilePic} alt={recipient.name} className="h-12 w-12 rounded-full border-2 border-indigo-400" />
                <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        {getIcon(post.type)}
                        <span className="ml-2">{recipient.name}</span>
                    </h3>
                    <p className="text-sm text-gray-500">
                        From: {author.name}
                    </p>
                </div>
            </div>
            <p className="text-gray-700 mb-4 border-l-4 border-indigo-500 pl-3 py-1 bg-indigo-50/50 rounded-sm">
                "{post.message}"
            </p>
            <div className="flex justify-between items-center text-sm">
                <button
                    onClick={() => onLike(post.id, user.id)}
                    className="flex items-center space-x-1 font-medium text-gray-600 hover:text-red-500 transition"
                >
                    <HeartIcon className={`h-5 w-5 transition ${isLiked ? 'text-red-500' : 'text-gray-400'}`} filled={isLiked} />
                    <span>{post.likes.length} Likes</span>
                </button>
                <TimeAgo date={post.timestamp} />
            </div>
        </div>
    );
};

/**
 * --- FEED PAGE ---
 * Shows the main list of posts with filtering.
 */
const FeedPage = ({ posts, currentUser, onLike, setRoute }) => {
    const [filter, setFilter] = useState('All');

    const filteredPosts = useMemo(() => {
        let result = posts.sort((a, b) => b.timestamp - a.timestamp);
        if (filter === 'All') return result;

        return result.filter(p => {
            const recipient = mockUsers.find(u => u.id === p.recipientId);
            return recipient && recipient.department === filter;
        });
    }, [posts, filter]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <AwardIcon className="h-6 w-6 mr-2 text-indigo-500" />
                    Company Feed
                </h2>
                <PrimaryButton onClick={() => setRoute('createPost')} className="w-auto px-4 py-2">
                    <PlusIcon className="h-5 w-5 inline mr-2" />
                    New Post
                </PrimaryButton>
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {mockDepartments.map(dept => (
                    <button
                        key={dept}
                        onClick={() => setFilter(dept)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition duration-150 ${
                            filter === dept
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-indigo-100 border border-gray-200'
                        }`}
                    >
                        {dept}
                    </button>
                ))}
            </div>

            <div className="max-w-3xl mx-auto">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <PostCard key={post.id} post={post} user={currentUser} onLike={onLike} />
                    ))
                ) : (
                    <div className="text-center p-10 bg-white/70 rounded-xl text-gray-500">No posts found in this department yet.</div>
                )}
            </div>
        </div>
    );
};

/**
 * --- CREATE POST PAGE ---
 * Form to create a new brag post.
 */
const CreatePostPage = ({ setRoute, onPost, currentUser }) => {
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('achievement');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (recipient === currentUser.id) {
            setError("You cannot send a post to yourself!");
            return;
        }

        if (!recipient || !message || !type) {
             setError("Please fill out all fields.");
             return;
        }
        
        onPost({ recipientId: recipient, message, type, authorId: currentUser.id });
        setRoute('feed');
    };

    const recipientOptions = mockUsers.filter(u => u.id !== currentUser.id);

    return (
        <div className="max-w-2xl mx-auto glass-card p-8 bg-white/90">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send a Brag</h2>
            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Recipient</label>
                    <select
                        id="recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg py-3 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                    >
                        <option value="" disabled>Select an employee</option>
                        {recipientOptions.map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type of Brag</label>
                    <div className="flex flex-wrap gap-3">
                        {['achievement', 'leadership', 'teamwork', 'positivity'].map(t => (
                            <button
                                type="button"
                                key={t}
                                onClick={() => setType(t)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition duration-150 ${
                                    type === t
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="4"
                        placeholder="What are they being recognized for?"
                        className="w-full border border-gray-300 rounded-lg py-3 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                    />
                </div>
                
                <div className="flex space-x-4">
                    <PrimaryButton type="submit" className="w-2/3">
                        Submit Brag
                    </PrimaryButton>
                    <button type="button" onClick={() => setRoute('feed')} className="w-1/3 py-3 px-4 rounded-xl text-gray-600 font-semibold bg-gray-200 hover:bg-gray-300 transition duration-200 shadow-md">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

/**
 * --- STATS PAGE ---
 * Shows the user's personal statistics.
 */
const StatsPage = ({ posts, currentUser }) => {
    const receivedPosts = posts.filter(p => p.recipientId === currentUser.id);
    const givenPosts = posts.filter(p => p.authorId === currentUser.id);
    const totalLikesReceived = receivedPosts.reduce((acc, p) => acc + p.likes.length, 0);

    const typeBreakdown = receivedPosts.reduce((acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
    }, {});
    const sortedTypes = Object.entries(typeBreakdown).sort(([, a], [, b]) => b - a);

    const StatCard = ({ title, value, icon, bgColor, textColor }) => (
        <div className={`p-6 rounded-2xl shadow-lg border border-gray-100/50 ${bgColor} flex items-center justify-between`}>
            <div>
                <p className="text-sm font-medium text-gray-600 uppercase">{title}</p>
                <p className={`text-4xl font-extrabold mt-1 ${textColor}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-full ${bgColor.replace('bg-', 'bg-')}/50`}>
                {icon}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 p-4">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-6">Your Bragboard Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Brags Received"
                    value={receivedPosts.length}
                    icon={<AwardIcon className="h-8 w-8 text-indigo-600" />}
                    bgColor="bg-white"
                    textColor="text-indigo-600"
                />
                 <StatCard 
                    title="Total Brags Given"
                    value={givenPosts.length}
                    icon={<PlusIcon className="h-8 w-8 text-emerald-600" />}
                    bgColor="bg-white"
                    textColor="text-emerald-600"
                />
                <StatCard 
                    title="Total Likes Received"
                    value={totalLikesReceived}
                    icon={<HeartIcon className="h-8 w-8 text-red-600" filled />}
                    bgColor="bg-white"
                    textColor="text-red-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6 bg-white/90">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                        <BarChartIcon className="h-5 w-5 mr-2 text-indigo-500" />
                        Brags Received by Type
                    </h3>
                    <div className="space-y-4">
                        {sortedTypes.length > 0 ? (
                            sortedTypes.map(([type, count]) => (
                                <div key={type} className="flex justify-between items-center">
                                    <span className="capitalize text-gray-700 font-medium">{type}</span>
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-bold">{count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">You haven't received any brags yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * --- DASHBOARD LAYOUT (AUTHENTICATED ROUTE CONTAINER) ---
 * Provides the fixed header, navigation, and renders the specific internal page (Feed, Stats, Create).
 * This acts as the <Dashboard /> component from the old structure.
 */
const DashboardLayout = ({ user, posts, setPosts, setAuthStatus, currentRoute, setRoute }) => {
    
    // Logic for global state changes
    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthStatus('login');
    };

    const handleLike = (postId, userId) => {
        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id === postId) {
                const isLiked = p.likes.includes(userId);
                return {
                    ...p,
                    likes: isLiked
                        ? p.likes.filter(id => id !== userId)
                        : [...p.likes, userId]
                };
            }
            return p;
        }));
    };

    const handleNewPost = (newPostData) => {
        const newPost = {
            ...newPostData,
            id: `p${Date.now()}`,
            likes: [],
            timestamp: new Date(),
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    // Routing Logic for the authenticated area
    let content;
    switch (currentRoute) {
        case 'feed':
            content = <FeedPage posts={posts} currentUser={user} onLike={handleLike} setRoute={setRoute} />;
            break;
        case 'createPost':
            content = <CreatePostPage setRoute={setRoute} onPost={handleNewPost} currentUser={user} />;
            break;
        case 'stats':
            content = <StatsPage posts={posts} currentUser={user} />;
            break;
        default:
            // Fallback/Redirect for base path
            content = <FeedPage posts={posts} currentUser={user} onLike={handleLike} setRoute={setRoute} />;
            break;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white shadow-md border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-indigo-600">
                        <BragboardIcon className="h-8 w-8" />
                        <h1 className="text-2xl font-extrabold text-gray-800">Bragboard</h1>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={() => setRoute('feed')}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${currentRoute === 'feed' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <HomeIcon className="h-5 w-5 mr-1" /> Feed
                        </button>
                        <button
                            onClick={() => setRoute('stats')}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${currentRoute === 'stats' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <BarChartIcon className="h-5 w-5 mr-1" /> Stats
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-700 hidden sm:block">Welcome, {user.name}</div>
                        <img src={user.profilePic} alt={user.name} className="h-10 w-10 rounded-full border-2 border-indigo-500" />
                        <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 p-2 rounded-full transition duration-150">
                            <LogOutIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Nav */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t z-20 shadow-lg flex justify-around p-2">
                <button
                    onClick={() => setRoute('feed')}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${currentRoute === 'feed' ? 'text-indigo-600' : 'text-gray-500'}`}
                >
                    <HomeIcon className="h-6 w-6" />
                    <span className="text-xs">Feed</span>
                </button>
                <button
                    onClick={() => setRoute('createPost')}
                    className="flex flex-col items-center p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg -mt-4 transition duration-200"
                    style={{ width: '56px', height: '56px', justifyContent: 'center' }}
                >
                    <PlusIcon className="h-6 w-6" />
                </button>
                <button
                    onClick={() => setRoute('stats')}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${currentRoute === 'stats' ? 'text-indigo-600' : 'text-gray-500'}`}
                >
                    <BarChartIcon className="h-6 w-6" />
                    <span className="text-xs">Stats</span>
                </button>
            </div>


            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-0">
                {content}
            </main>
        </div>
    );
};


// ====================================================================
// 4. MAIN APPLICATION ROOT (The Router)
// ====================================================================

/**
 * The main App component acting as the application router and global state provider.
 */
export default function App() {
    const [currentRoute, setCurrentRoute] = useState(
        localStorage.getItem('token') ? 'feed' : 'login'
    );
    const [currentUser, setCurrentUser] = useState(
        mockUsers.find(u => u.email === 'test@user.com') || mockUsers[0]
    );
    const [posts, setPosts] = useState(initialPosts);
    const [authMessage, setAuthMessage] = useState({ message: null, type: null });

    // Handles the successful login event
    const handleLoginSuccess = (data) => {
        // Find the user from mock data based on the successful mock login
        const loggedInUser = mockUsers.find(u => u.email === 'test@user.com');
        setCurrentUser(loggedInUser);
        setCurrentRoute('feed'); // Route to the main feed after login
        setAuthMessage({ message: data.message, type: data.type });
    };

    // Handles successful registration event
    const handleRegisterSuccess = (data) => {
        setAuthMessage({ message: data.message, type: data.type });
        setCurrentRoute('login'); // Route back to login after registration
    };
    
    // Effect to auto-dismiss messages
    useEffect(() => {
        let timer;
        if (authMessage.message) {
            timer = setTimeout(() => {
                setAuthMessage({ message: null, type: null });
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [authMessage.message]);


    let renderedPage;
    switch (currentRoute) {
        case 'login':
            renderedPage = (
                <LoginPage 
                    setRoute={setCurrentRoute} 
                    onLoginSuccess={handleLoginSuccess}
                    setAuthMessage={setAuthMessage}
                />
            );
            break;
        case 'register':
            renderedPage = (
                <RegisterPage
                    setRoute={setCurrentRoute}
                    onRegisterSuccess={handleRegisterSuccess}
                    setAuthMessage={setAuthMessage}
                />
            );
            break;
        case 'feed':
        case 'createPost':
        case 'stats':
            // These routes use the Dashboard layout
            renderedPage = (
                <DashboardLayout 
                    user={currentUser} 
                    posts={posts} 
                    setPosts={setPosts} 
                    setAuthStatus={setCurrentRoute} 
                    currentRoute={currentRoute} // Pass the specific sub-route (feed, stats, createPost)
                    setRoute={setCurrentRoute}
                />
            );
            break;
        default:
             // Default redirect to login if state is bad
             renderedPage = (
                <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
                    <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                        <p className="text-gray-600 mb-6">Redirecting to login...</p>
                        <PrimaryButton onClick={() => setCurrentRoute('login')}>Go to Login</PrimaryButton>
                    </div>
                </div>
            );
            break;
    }

    return (
        <div className="min-h-screen">
            {renderedPage}
            {authMessage.message && (
                <MessageBox msg={authMessage.message} type={authMessage.type} onClose={() => setAuthMessage({ message: null, type: null })} />
            )}
        </div>
    );
}
