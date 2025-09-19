import React, { useState, useEffect, useCallback } from 'react';
import { adminApi, clubApi } from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, TentTree, CalendarDays, HeartPulse, Trash, Edit, LayoutDashboard, UserCog, ShieldCheck } from 'lucide-react';

// Panel 1: Overview
const OverviewPanel = ({ setActiveTab }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminApi.getDashboardStats();
                setStats(response.data);
            } catch (error) { console.error("Failed to fetch dashboard stats", error); } 
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-center text-secondary py-8">Loading Overview...</div>;

    const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
        <button 
            onClick={onClick} 
            disabled={!onClick} 
            className={`w-full text-left bg-card border border-border p-6 rounded-lg flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-accent/50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:opacity-70`}
        >
            <div>
                <p className="text-sm text-secondary">{title}</p>
                <p className="text-3xl font-bold text-primary">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${color}`}><Icon size={24} /></div>
        </button>
    );
    
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats?.total_users || 0} icon={Users} color="bg-blue-500/10 text-blue-400" onClick={() => setActiveTab('userManagement')} />
                <StatCard title="Active Clubs" value={stats?.active_clubs || 0} icon={TentTree} color="bg-green-500/10 text-green-400" onClick={() => setActiveTab('clubOversight')} />
                <StatCard title="Total Events" value={stats?.total_events || 0} icon={CalendarDays} color="bg-purple-500/10 text-purple-400" />
                <StatCard title="System Health" value="98.5%" icon={HeartPulse} color="bg-teal-500/10 text-teal-400" />
            </div>
        </div>
    );
};

// Reusable User Table Component
const UserTable = ({ users, handleRoleChange, handleDeleteUser, currentUser }) => {
    if (users.length === 0) {
        return <div className="bg-card border border-border rounded-lg p-6 text-center text-secondary">No users found in this category.</div>;
    }
    return (
        <div className="bg-card border border-border shadow-lg rounded-lg overflow-x-auto">
            <table className="min-w-full leading-normal">
                <thead><tr><th className="px-5 py-3 border-b-2 border-border bg-background text-left text-xs font-semibold text-secondary uppercase">User</th><th className="px-5 py-3 border-b-2 border-border bg-background text-left text-xs font-semibold text-secondary uppercase">Role</th><th className="px-5 py-3 border-b-2 border-border bg-background text-left text-xs font-semibold text-secondary uppercase">Actions</th></tr></thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-5 py-5 border-b border-border text-sm"><p className="font-semibold text-primary">{user.full_name}</p><p className="text-secondary">{user.email}</p></td>
                            <td className="px-5 py-5 border-b border-border text-sm">
                                <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} className="p-2 border border-border rounded-md bg-background text-primary" disabled={user.id === currentUser.id}>
                                    <option value="student">Student</option><option value="club_admin">Club Admin</option><option value="super_admin">Super Admin</option>
                                </select>
                            </td>
                            <td className="px-5 py-5 border-b border-border text-sm">
                                {user.id !== currentUser.id && (<button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-400"><Trash size={18}/></button>)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Panel 2: User Management
const UserManagementPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();
    const fetchUsers = useCallback(async () => { setLoading(true); try { const response = await adminApi.getAllUsers(); setUsers(response.data); } catch (err) { console.error('Failed to fetch users.'); } finally { setLoading(false); } }, []);
    useEffect(() => { fetchUsers(); }, [fetchUsers]);
    const handleRoleChange = async (userId, newRole) => { if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return; try { await adminApi.updateUserRole(userId, newRole); fetchUsers(); } catch (err) { alert('Failed to update role.'); } };
    const handleDeleteUser = async (userId) => { if (!window.confirm('Are you sure you want to PERMANENTLY delete this user?')) return; try { await adminApi.deleteUser(userId); fetchUsers(); } catch (err) { alert(err.response?.data?.detail || 'Failed to delete user.'); } };
    
    if (loading) return <div className="text-center text-secondary py-8">Loading user data...</div>;
    
    const superAdmins = users.filter(u => u.role === 'super_admin');
    const clubAdmins = users.filter(u => u.role === 'club_admin');
    const students = users.filter(u => u.role === 'student');

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h3 className="text-xl font-bold text-primary mb-4">Super Admins ({superAdmins.length})</h3>
                <UserTable users={superAdmins} handleRoleChange={handleRoleChange} handleDeleteUser={handleDeleteUser} currentUser={currentUser} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-primary mb-4">Club Admins ({clubAdmins.length})</h3>
                <UserTable users={clubAdmins} handleRoleChange={handleRoleChange} handleDeleteUser={handleDeleteUser} currentUser={currentUser} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-primary mb-4">Students ({students.length})</h3>
                <UserTable users={students} handleRoleChange={handleRoleChange} handleDeleteUser={handleDeleteUser} currentUser={currentUser} />
            </div>
        </div>
    );
};

// Panel 3: Club Oversight
const ClubOversightPanel = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchClubs = useCallback(async () => { setLoading(true); try { const response = await clubApi.getAll(); setClubs(response.data); } catch (err) { console.error("Failed to fetch clubs", err); } finally { setLoading(false); } }, []);
    useEffect(() => { fetchClubs(); }, [fetchClubs]);
    const handleDeleteClub = async (clubId) => { if (window.confirm('Are you sure you want to delete this club?')) { try { await clubApi.delete(clubId); alert('Club deleted successfully.'); fetchClubs(); } catch (error) { alert('Failed to delete club.'); } } };
    
    if (loading) return <div className="text-center text-secondary py-8">Loading clubs...</div>;
    return (
        <div className="bg-card border border-border shadow-lg rounded-lg overflow-x-auto animate-fade-in">
            <table className="min-w-full leading-normal">
                <thead><tr><th className="px-5 py-3 border-b-2 border-border bg-background text-left text-xs font-semibold text-secondary uppercase">Club Name</th><th className="px-5 py-3 border-b-2 border-border bg-background text-left text-xs font-semibold text-secondary uppercase">Admin</th><th className="px-5 py-3 border-b-2 border-border bg-background text-left text-xs font-semibold text-secondary uppercase">Actions</th></tr></thead>
                <tbody>
                    {clubs.map((club) => (
                        <tr key={club.id}>
                            <td className="px-5 py-5 border-b border-border text-sm"><p className="font-semibold text-primary">{club.name}</p></td>
                            <td className="px-5 py-5 border-b border-border text-sm"><p className="text-secondary">{club.admin.full_name}</p></td>
                            <td className="px-5 py-5 border-b border-border text-sm flex space-x-4">
                                <Link to={`/clubs/${club.id}/edit`} className="text-accent hover:text-accent-hover" title="Edit Club"><Edit size={18}/></Link>
                                <button onClick={() => handleDeleteClub(club.id)} className="text-red-500 hover:text-red-400" title="Delete Club"><Trash size={18}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Main Super Admin Dashboard Component ---
const SuperAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const getTabClass = (tabName) => `px-4 py-2 font-semibold rounded-lg transition flex items-center ${activeTab === tabName ? 'bg-accent text-white shadow' : 'text-secondary hover:bg-border'}`;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-primary">Super Admin Dashboard</h1>
                <p className="text-secondary mt-1">Monitor and manage the entire StellarHub platform.</p>
            </div>
            <div className="bg-card border border-border p-2 rounded-lg flex space-x-2">
                <button onClick={() => setActiveTab('overview')} className={getTabClass('overview')}><LayoutDashboard size={16} className="mr-2"/> Overview</button>
                <button onClick={() => setActiveTab('userManagement')} className={getTabClass('userManagement')}><UserCog size={16} className="mr-2"/> User Management</button>
                <button onClick={() => setActiveTab('clubOversight')} className={getTabClass('clubOversight')}><ShieldCheck size={16} className="mr-2"/> Club Oversight</button>
            </div>
            <div className="mt-6">
                {activeTab === 'overview' && <OverviewPanel setActiveTab={setActiveTab} />}
                {activeTab === 'userManagement' && <UserManagementPanel />}
                {activeTab === 'clubOversight' && <ClubOversightPanel />}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
