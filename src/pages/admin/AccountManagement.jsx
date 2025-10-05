import React, { useEffect, useState, useMemo } from 'react';
import {
  UserMinus,
  Trash2,
  Plus,
  Edit3,
  Search,
  Filter,
  Download,
  Upload,
  Users,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
} from 'lucide-react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { getAllAccount } from '../../services/userService';

export default function AccountManagement() {
  const [selectedRole, setSelectedRole] = useState('HeadDepartment');
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [data, setData] = useState({
    headDepartmentList: [],
    staffList: [],
    lecturerList: [],
    studentList: [],
  });
  const [roleStats, setRoleStats] = useState({
    HeadDepartment: 0,
    Staff: 0,
    Lecturer: 0,
    Student: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllAccount();
        setData({
          headDepartmentList: response.headDepartmentList || [],
          staffList: response.staffList || [],
          lecturerList: response.lecturerList || [],
          studentList: response.studentList || [],
        });
        setRoleStats({
          HeadDepartment: response.headDepartmentCount || 0,
          Staff: response.staffCount || 0,
          Lecturer: response.lecturerCount || 0,
          Student: response.studentCount || 0,
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let users = [];
    switch (selectedRole) {
      case 'HeadDepartment':
        users = data.headDepartmentList;
        break;
      case 'Staff':
        users = data.staffList;
        break;
      case 'Lecturer':
        users = data.lecturerList;
        break;
      case 'Student':
        users = data.studentList;
        break;
      default:
        users = [];
    }

    if (searchQuery.trim() !== '') {
      users = users.filter(
        u =>
          u.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return users;
  }, [selectedRole, data, searchQuery]);

  const handleToggleActive = email => {
    setData(prev => {
      const updated = { ...prev };
      let listKey = '';
      switch (selectedRole) {
        case 'HeadDepartment':
          listKey = 'headDepartmentList';
          break;
        case 'Staff':
          listKey = 'staffList';
          break;
        case 'Lecturer':
          listKey = 'lecturerList';
          break;
        case 'Student':
          listKey = 'studentList';
          break;
        default:
          return prev;
      }
      
      updated[listKey] = updated[listKey].map(u =>
        u.email === email ? { ...u, isActive: !u.isActive } : u
      );
      return updated;
    });
  };

  const handleBulkDeactivate = () => {
    setData(prev => {
      const updated = { ...prev };
      let listKey = '';
      switch (selectedRole) {
        case 'HeadDepartment':
          listKey = 'headDepartmentList';
          break;
        case 'Staff':
          listKey = 'staffList';
          break;
        case 'Lecturer':
          listKey = 'lecturerList';
          break;
        case 'Student':
          listKey = 'studentList';
          break;
        default:
          return prev;
      }
      
      updated[listKey] = updated[listKey].map(u =>
        selectedIds.includes(u.email) ? { ...u, isActive: false } : u
      );
      return updated;
    });
    setSelectedIds([]);
  };

  const getActiveCount = (role) => {
    let list = [];
    switch (role) {
      case 'HeadDepartment':
        list = data.headDepartmentList;
        break;
      case 'Staff':
        list = data.staffList;
        break;
      case 'Lecturer':
        list = data.lecturerList;
        break;
      case 'Student':
        list = data.studentList;
        break;
      default:
        list = [];
    }
    return list.filter(u => u.isActive).length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const getRoleDisplayName = (roleName) => {
    const roleMap = {
      'HEAD_DEPARTMENT': 'Head Department',
      'STAFF': 'Staff',
      'LECTURER': 'Lecturer',
      'STUDENT': 'Student',
    };
    return roleMap[roleName] || roleName;
  };

  return (
    <>
      <div className='min-h-screen flex'>
        <AdminSidebar />
        <div className='flex flex-col flex-1'>
          <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6'>
            <div className='max-w-7xl mx-auto space-y-6'>
              {/* Header */}
              <div className='flex items-center justify-between'>
                <div>
                  <h1 className='text-3xl font-bold text-gray-800 flex items-center gap-3'>
                    <Users className='w-8 h-8 text-blue-600' />
                    Account Management
                  </h1>
                  <p className='text-gray-500 mt-1'>
                    Manage user accounts and permissions
                  </p>
                </div>
                <div className='flex gap-3'>
                  <button className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm'>
                    <Download className='w-4 h-4' />
                    Export
                  </button>
                  <button className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm'>
                    <Upload className='w-4 h-4' />
                    Import
                  </button>
                  <button
                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md'
                    onClick={() => setShowCreateForm(!showCreateForm)}
                  >
                    <Plus className='w-4 h-4' />
                    Create Account
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                {['HeadDepartment', 'Staff', 'Lecturer', 'Student'].map(
                  role => (
                    <div
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`bg-white rounded-lg p-4 cursor-pointer transition-all shadow-md hover:shadow-lg ${
                        selectedRole === role
                          ? 'ring-2 ring-blue-600 bg-blue-50'
                          : ''
                      }`}
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-sm font-medium text-gray-600'>
                          {role === 'HeadDepartment' ? 'Head Department' : role}
                        </h3>
                        <Users
                          className={`w-5 h-5 ${selectedRole === role ? 'text-blue-600' : 'text-gray-400'}`}
                        />
                      </div>
                      <p className='text-2xl font-bold text-gray-800'>
                        {roleStats[role]}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        {getActiveCount(role)} active
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* User Table */}
              <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                {/* Table Header */}
                <div className='p-4 bg-gradient-to-r from-blue-50 to-white border-b'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl font-semibold text-gray-800'>
                      {selectedRole === 'HeadDepartment' ? 'Head Department' : selectedRole} Accounts
                      <span className='ml-2 text-sm font-normal text-gray-500'>
                        ({filteredUsers.length} users)
                      </span>
                    </h2>
                    {selectedIds.length > 0 && (
                      <button
                        className='flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md'
                        onClick={handleBulkDeactivate}
                      >
                        <UserMinus className='w-4 h-4' />
                        Deactivate Selected ({selectedIds.length})
                      </button>
                    )}
                  </div>

                  {/* Search and Filter */}
                  <div className='flex gap-3'>
                    <div className='flex-1 relative'>
                      <Search className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                      <input
                        type='text'
                        placeholder='Search by name or email...'
                        className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                      <Filter className='w-4 h-4' />
                      Filter
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50 border-b-2 border-gray-200'>
                      <tr>
                        <th className='px-6 py-3 text-left'>
                          <input
                            type='checkbox'
                            className='w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500'
                            checked={
                              selectedIds.length === filteredUsers.length &&
                              filteredUsers.length > 0
                            }
                            onChange={e =>
                              setSelectedIds(
                                e.target.checked
                                  ? filteredUsers.map(u => u.email)
                                  : []
                              )
                            }
                          />
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                          User Info
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                          Email
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                          Join Date
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                          Status
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                      {filteredUsers.map(u => (
                        <tr
                          key={u.email}
                          className='hover:bg-gray-50 transition-colors'
                        >
                          <td className='px-6 py-4'>
                            <input
                              type='checkbox'
                              className='w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500'
                              checked={selectedIds.includes(u.email)}
                              onChange={e =>
                                setSelectedIds(prev =>
                                  e.target.checked
                                    ? [...prev, u.email]
                                    : prev.filter(email => email !== u.email)
                                )
                              }
                            />
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-3'>
                              <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold'>
                                {(u.fullname || u.email).charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className='font-medium text-gray-800'>
                                  {u.fullname || u.email.split('@')[0]}
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {getRoleDisplayName(u.roleName)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-2 text-gray-600'>
                              <Mail className='w-4 h-4 text-gray-400' />
                              {u.email}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-2 text-gray-600'>
                              <Calendar className='w-4 h-4 text-gray-400' />
                              {formatDate(u.createdDate)}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            {u.isActive ? (
                              <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800'>
                                <CheckCircle className='w-3 h-3' />
                                Active
                              </span>
                            ) : (
                              <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800'>
                                <XCircle className='w-3 h-3' />
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex gap-2'>
                              <button
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                  u.isActive
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                                onClick={() => handleToggleActive(u.email)}
                              >
                                {u.isActive ? (
                                  <>
                                    <Trash2 className='w-4 h-4' />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className='w-4 h-4' />
                                    Activate
                                  </>
                                )}
                              </button>
                              <button className='flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors'>
                                <Edit3 className='w-4 h-4' />
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                  <div className='text-center py-12'>
                    <Users className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold text-gray-600 mb-2'>
                      No users found
                    </h3>
                    <p className='text-gray-500'>
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                  <div className='px-6 py-4 bg-gray-50 border-t flex items-center justify-between'>
                    <div className='text-sm text-gray-600'>
                      Showing <span className='font-medium'>1</span> to{' '}
                      <span className='font-medium'>
                        {filteredUsers.length}
                      </span>{' '}
                      of{' '}
                      <span className='font-medium'>
                        {filteredUsers.length}
                      </span>{' '}
                      results
                    </div>
                    <div className='flex gap-2'>
                      <button className='px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                        Previous
                      </button>
                      <button className='px-3 py-1 bg-blue-600 text-white rounded-lg'>
                        1
                      </button>
                      <button className='px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors'>
                        2
                      </button>
                      <button className='px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors'>
                        3
                      </button>
                      <button className='px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors'>
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
