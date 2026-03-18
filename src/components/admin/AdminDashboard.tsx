import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdPeopleOutline, MdAnalytics, MdSettings, MdFileUpload } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthContext';
import UserManagement from './UserManagement';
import MaterialUploadForm from './MaterialUploadForm';
import Card from '../Card';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('users');
    const tabs = [
        { id: 'users', label: 'User Management', icon: MdPeopleOutline },
        { id: 'materials', label: 'Course Materials', icon: MdFileUpload },
        { id: 'analytics', label: 'Analytics', icon: MdAnalytics },
        { id: 'settings', label: 'Settings', icon: MdSettings },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Admin Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#00592D] mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name || 'Administrator'}</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-white text-[#00592D] shadow-sm'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'users' && <UserManagement />}

                {activeTab === 'materials' && (
                    <div className="max-w-6xl">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-[#00592D] mb-2">Course Materials Management</h2>
                            <p className="text-gray-600">Upload and manage lecture materials, notes, assignments, and recordings</p>
                        </div>
                        <MaterialUploadForm />
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="max-w-6xl space-y-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-[#00592D] mb-2">Analytics Dashboard</h2>
                            <p className="text-gray-600">Comprehensive overview of platform usage and student engagement</p>
                        </div>

                        <Card hover={false}>
                            <div className="p-8 text-center text-gray-500">
                                <MdAnalytics className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                Analytics dashboard coming soon...
                                <p className="text-sm mt-2">Detailed insights will be available here</p>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-6xl space-y-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-[#00592D] mb-2">System Settings</h2>
                            <p className="text-gray-600">Configure platform settings and preferences</p>
                        </div>

                        <Card hover={false}>
                            <div className="p-8 text-center text-gray-500">
                                <MdSettings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                Settings panel coming soon...
                                <p className="text-sm mt-2">System configuration options will be available here</p>
                            </div>
                        </Card>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminDashboard;