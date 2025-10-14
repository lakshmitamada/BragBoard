import React, { useState } from 'react';

// --- MOCK DATA ---
const mockDepartments = ['All', 'Engineering', 'Marketing', 'Sales', 'HR'];

const mockPosts = [
    { id: 1, from: 'Jordan Lee', to: 'Alex Ray', department: 'Engineering', message: 'Incredible work on the new feature launch! Your dedication was key to our success.', timestamp: '2 hours ago', avatar: 'https://placehold.co/100x100/2563EB/FFFFFF/png?text=JL' },
    { id: 2, from: 'Taylor Quinn', to: 'Sarah Green', department: 'Marketing', message: 'Huge props to Sarah for the amazing new ad campaign. The results are already speaking for themselves!', timestamp: '1 day ago', avatar: 'https://placehold.co/100x100/4F46E5/FFFFFF/png?text=TQ' },
    { id: 3, from: 'Alex Ray', to: 'Jordan Lee', department: 'Engineering', message: 'Thanks for the great leadership and guidance on the project. Really appreciate your support!', timestamp: '3 days ago', avatar: 'https://placehold.co/100x100/7E22CE/FFFFFF/png?text=AR' },
];


// --- SVG ICONS ---
const BragboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
);
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-yellow-400"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>;


// --- DASHBOARD & COMPONENTS ---
export default function Dashboard({ user, onLogout, mockUsers }) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar user={user} onLogout={onLogout} />
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {user.role === 'admin' ? <AdminDashboard user={user} mockUsers={mockUsers} /> : <EmployeeDashboard user={user} mockUsers={mockUsers} />}
            </main>
        </div>
    );
}

const Sidebar = ({ user, onLogout }) => (
    <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="flex items-center justify-center p-6 border-b">
            <BragboardIcon />
            <h1 className="text-xl font-bold text-gray-800 ml-2">Bragboard</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                Dashboard
            </a>
             <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /></svg>
                Messages
            </a>
            {user.role === 'admin' && (
                 <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <ChartIcon />
                    Analytics
                </a>
            )}
        </nav>
        <div className="p-4 border-t">
            <div className="flex items-center">
                 <img src={user.avatar} alt="User Avatar" className="h-10 w-10 rounded-full object-cover" />
                 <div className="ml-3">
                     <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                     <p className="text-xs text-gray-500">{user.department}</p>
                 </div>
            </div>
             <button onClick={onLogout} className="w-full mt-4 flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <LogoutIcon />
                <span className="ml-2">Logout</span>
            </button>
        </div>
    </aside>
);

const DashboardHeader = ({ title, subtitle }) => (
    <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500 mt-1">{subtitle}</p>
    </div>
);

const DashboardCard = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-md p-6 ${className}`}>
        {children}
    </div>
);

function EmployeeDashboard({ user, mockUsers }) {
    const [posts, setPosts] = useState(mockPosts);

    return (
        <div>
            <DashboardHeader title={`Welcome, ${user.name.split(' ')[0]}!`} subtitle="Here’s what’s happening in your team today." />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content: Posts & Send Recognition */}
                <div className="lg:col-span-2 space-y-8">
                    <SendBragboardCard setPosts={setPosts} currentUser={user} mockUsers={mockUsers} />
                    <BragboardFeed posts={posts} />
                </div>

                {/* Right sidebar: My Stats */}
                <div className="space-y-8">
                    <MyAchievementsCard user={user} />
                    <TeamLeaderboard mockUsers={mockUsers} />
                </div>
            </div>
        </div>
    );
}

function AdminDashboard({ user, mockUsers }) {
    const [posts, setPosts] = useState(mockPosts);
    const [filterDept, setFilterDept] = useState('All');

    const filteredPosts = filterDept === 'All' ? posts : posts.filter(s => s.department === filterDept);

    return (
         <div>
            <DashboardHeader title="Admin Overview" subtitle="Manage recognition and view analytics across the company." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Posts" value={posts.length} color="indigo" />
                <StatCard title="Team Members" value={Object.keys(mockUsers).length} color="blue" />
                <StatCard title="Top Department" value="Engineering" color="green" />
                <StatCard title="Engagement" value="89%" color="purple" />
            </div>
            
            <div className="mb-6">
                 <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-2">Filter by Department</label>
                 <select 
                    id="department-filter" 
                    value={filterDept} 
                    onChange={e => setFilterDept(e.target.value)} 
                    className="w-full max-w-xs bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {mockDepartments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
            </div>
            
            <BragboardFeed posts={filteredPosts} />
        </div>
    )
}

const StatCard = ({ title, value, color }) => {
    const colors = {
        indigo: 'from-indigo-500 to-indigo-600',
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
    };

    return (
        <div className={`bg-gradient-to-br ${colors[color]} text-white p-6 rounded-2xl shadow-lg`}>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-4xl font-bold">{value}</p>
        </div>
    );
}


const SendBragboardCard = ({ setPosts, currentUser, mockUsers }) => {
    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState('');

    const handleSend = () => {
        if (!message || !recipient) return;
        const newPost = {
            id: Date.now(),
            from: currentUser.name,
            to: recipient,
            department: currentUser.department,
            message,
            timestamp: 'Just now',
            avatar: currentUser.avatar,
        };
        setPosts(prev => [newPost, ...prev]);
        setMessage('');
        setRecipient('');
    };

    return (
        <DashboardCard>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Post on the Bragboard!</h3>
            <div className="space-y-4">
                 <select value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select a team member...</option>
                    {Object.values(mockUsers).filter(u => u.name !== currentUser.name).map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
                </select>
                <textarea 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={`Brag about a coworker or share a win!`}
                    className="w-full p-3 border border-gray-200 rounded-lg h-24 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                ></textarea>
                <div className="text-right">
                    <button onClick={handleSend} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition flex items-center ml-auto transform hover:scale-105">
                        <SendIcon />
                        <span className="ml-2">Send</span>
                    </button>
                </div>
            </div>
        </DashboardCard>
    );
};

const BragboardFeed = ({ posts }) => (
    <DashboardCard>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Bragboard Feed</h3>
        <div className="space-y-6">
            {posts.map(post => (
                <div key={post.id} className="flex space-x-4">
                    <img src={post.avatar} alt="Avatar" className="h-12 w-12 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-gray-800">
                            <span className="font-bold">{post.from}</span> gave a shoutout to <span className="font-bold">{post.to}</span>
                        </p>
                        <p className="mt-1 p-3 bg-gray-100 rounded-lg text-gray-700">{post.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{post.timestamp} · {post.department}</p>
                    </div>
                </div>
            ))}
        </div>
    </DashboardCard>
);

const MyAchievementsCard = ({ user }) => (
    <DashboardCard>
        <div className="flex items-center mb-4">
            <TrophyIcon />
            <h3 className="text-xl font-bold text-gray-800 ml-2">My Stats</h3>
        </div>
        <div className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl mb-4">
            <p className="text-lg">Total Score</p>
            <p className="text-5xl font-extrabold">{user.score}</p>
        </div>
        <div>
            <h4 className="font-semibold mb-2 text-gray-600">Achievements:</h4>
            <ul className="space-y-2">
                {user.achievements.map(ach => (
                     <li key={ach.id} className="flex items-center text-sm bg-green-50 text-green-700 p-2 rounded-md">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {ach.text}
                    </li>
                ))}
            </ul>
        </div>
    </DashboardCard>
);

const TeamLeaderboard = ({ mockUsers }) => (
    <DashboardCard>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Team Leaderboard</h3>
        <ul className="space-y-4">
             {Object.values(mockUsers).filter(u => u.role === 'employee').sort((a, b) => b.score - a.score).map((user, index) => (
                <li key={user.name} className="flex items-center">
                    <span className="font-bold text-gray-500 w-6">{index + 1}.</span>
                    <img src={user.avatar} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
                    <div className="ml-3 flex-1">
                        <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.department}</p>
                    </div>
                    <span className="font-bold text-indigo-600">{user.score} pts</span>
                </li>
             ))}
        </ul>
    </DashboardCard>
);
