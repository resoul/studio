import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { motion } from 'framer-motion';
import { User, Mail, Shield, LogOut, Loader2, Calendar } from 'lucide-react';

interface ProfileData {
    id: string;
    email: string;
    role: string;
    last_login: string;
    created_at: string;
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const MePage = () => {
    const { session, signOut } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/profile`, {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`,
                    }
                });
                const data = await response.json();
                setProfile(data);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchProfile();
        }
    }, [session]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8 text-white">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-bold tracking-tight">Your Profile</h1>
                        <p className="text-gray-400 mt-2">Manage your account and preferences</p>
                    </motion.div>
                    
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={signOut}
                        className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 px-6 py-3 rounded-2xl transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </motion.button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center"
                    >
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                            <User className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-xl font-bold truncate w-full text-center">{profile?.email?.split('@')[0]}</h3>
                        <p className="text-gray-400 text-sm mb-6 capitalize">{profile?.role || 'User'}</p>
                        
                        <div className="w-full space-y-4">
                            <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl">
                                <Mail className="w-4 h-4 text-blue-400" />
                                <span className="truncate">{profile?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl">
                                <Shield className="w-4 h-4 text-purple-400" />
                                <span>{profile?.role || 'Standard Account'}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats/Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 space-y-8"
                    >
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                Activity
                            </h4>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-gray-400">Last Login</span>
                                    <span className="text-white font-medium">{formatDate(profile?.last_login)}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-gray-400">Account Status</span>
                                    <span className="text-green-400 font-medium">Active</span>
                                </div>
                                <div className="flex justify-between items-center py-4">
                                    <span className="text-gray-400">Member Since</span>
                                    <span className="text-white font-medium">{formatDate(profile?.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-8">
                            <h4 className="text-lg font-bold mb-2">Studio Pro</h4>
                            <p className="text-gray-300 text-sm mb-6">You're currently on the free plan. Upgrade to unlock advanced features.</p>
                            <button className="bg-white text-black font-bold px-8 py-3 rounded-2xl hover:bg-gray-200 transition-colors">
                                Upgrade Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MePage;