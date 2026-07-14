import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdPerson, MdEmail, MdSchool, MdCheck, MdClose, MdPending } from 'react-icons/md';
import Card from '../Card';
import Button from '../Button';
import Skeleton from '../skeletons/Skeleton';
import SkeletonText from '../skeletons/SkeletonText';
import SkeletonAvatar from '../skeletons/SkeletonAvatar';
import { AdminService, StudentUser } from '../../lib/appwrite';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<StudentUser[]>([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await AdminService.getAllUsers();
      if (result.success) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const result = await AdminService.getUserAnalytics();
      if (result.success) {
        setAnalytics(result.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleUserAction = async (userId: string, action: 'approved' | 'rejected') => {
    setActionLoading(userId);
    try {
      const result = await AdminService.updateUserStatus(userId, action);
      if (result.success) {
        // Update the local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.$id === userId
              ? { ...user, profileStatus: action, isVerified: action === 'approved' }
              : user
          )
        );
        // Refresh analytics
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <MdCheck className="w-4 h-4" />;
      case 'rejected':
        return <MdClose className="w-4 h-4" />;
      default:
        return <MdPending className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#00592D] mb-2">User Management</h2>
        <p className="text-gray-600">Review and manage student registrations</p>
      </div>

      {/* Analytics Cards */}
      {analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card hover={false} className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00592D]">{analytics.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </Card>
          <Card hover={false} className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F2A900]">{analytics.pendingUsers}</div>
              <div className="text-sm text-gray-600">Pending Approval</div>
            </div>
          </Card>
          <Card hover={false} className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.verifiedUsers}</div>
              <div className="text-sm text-gray-600">Verified Users</div>
            </div>
          </Card>
          <Card hover={false} className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.bscAgricultureUsers + analytics.bscFoodConsumerUsers}
              </div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} hover={false} className="p-4">
              <div className="flex flex-col items-center gap-2">
                <Skeleton width="3rem" height="2rem" rounded />
                <Skeleton width="80%" height="0.875rem" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Users List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Registrations</h3>

        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} hover={false}>
              <div className="p-6">
                <div className="flex-1 space-y-3">
                  {/* Avatar + name/email */}
                  <div className="flex items-start gap-4">
                    <SkeletonAvatar size={48} />
                    <div className="flex-1 space-y-2">
                      <div className="w-2/5">
                        <SkeletonText lines={1} lineHeight="1.125rem" />
                      </div>
                      <div className="w-3/5">
                        <SkeletonText lines={1} lineHeight="0.875rem" />
                      </div>
                    </div>
                  </div>

                  {/* Student details grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((__, cell) => (
                      <div key={cell} className="space-y-1">
                        <Skeleton width="60%" height="0.875rem" />
                        <Skeleton width="80%" height="0.875rem" />
                      </div>
                    ))}
                  </div>

                  {/* Registration date */}
                  <Skeleton width="10rem" height="0.75rem" />
                </div>
              </div>
            </Card>
          ))
        ) : users.length === 0 ? (
          <Card hover={false}>
            <div className="p-8 text-center text-gray-500">
              No student registrations found.
            </div>
          </Card>
        ) : (
          users.map((student, index) => (
            <motion.div
              key={student.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card hover={false}>
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#00592D] rounded-full flex items-center justify-center text-white font-semibold">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800">{student.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <MdEmail className="w-4 h-4" />
                            {student.email}
                          </div>
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(student.profileStatus)}`}>
                          {getStatusIcon(student.profileStatus)}
                          {student.profileStatus}
                        </div>
                      </div>

                      {/* Student Details */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Student ID:</span>
                          <p className="text-gray-600">{student.studentId}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Level:</span>
                          <p className="text-gray-600">{student.level}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Department:</span>
                          <p className="text-gray-600">{student.department}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Phone:</span>
                          <p className="text-gray-600">{student.phoneNumber}</p>
                        </div>
                      </div>

                      {/* Registration Date */}
                      <div className="text-xs text-gray-500">
                        Registered on {new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    {student.profileStatus === 'pending' && (
                      <div className="flex gap-2 lg:flex-col lg:w-auto">
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleUserAction(student.$id, 'approved')}
                          disabled={actionLoading === student.$id}
                          className="flex-1 lg:flex-initial"
                        >
                          {actionLoading === student.$id ? 'Processing...' : 'Approve'}
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleUserAction(student.$id, 'rejected')}
                          disabled={actionLoading === student.$id}
                          className="flex-1 lg:flex-initial"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserManagement;