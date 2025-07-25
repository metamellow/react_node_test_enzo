import React, { useState, useEffect } from "react";
import { FaTrash, FaUser, FaClock, FaSignOutAlt, FaShieldAlt, FaNetworkWired } from "react-icons/fa";

const RecentUsers = () => {
  const [userLogs, setUserLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const loadUserLogs = async () => {
      try {
        // Simulate network delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get user logs from localStorage
        const storedLogs = localStorage.getItem('userLogs');
        
        if (storedLogs && storedLogs !== 'null' && storedLogs !== '[]') {
          const parsedLogs = JSON.parse(storedLogs);
          // Sort by login time (most recent first)
          const sortedLogs = parsedLogs.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));
          setUserLogs(sortedLogs);
        } else {
          // Initialize with mock data if no logs exist
          const mockLogs = [
            {
              id: '1',
              userId: 'admin-123',
              username: 'admin@example.com',
              role: 'admin',
              action: 'login',
              loginTime: new Date(Date.now() - 3600000).toISOString(),
              logoutTime: null,
              ipAddress: '192.168.1.1',
              tokenName: 'eyJhbGciOi...'
            },
            {
              id: '2',
              userId: 'user-456',
              username: 'user@example.com',
              role: 'user',
              action: 'login',
              loginTime: new Date(Date.now() - 7200000).toISOString(),
              logoutTime: new Date(Date.now() - 3600000).toISOString(),
              ipAddress: '192.168.1.2',
              tokenName: 'eyJhbGciOi...'
            },
            {
              id: '3',
              userId: 'user-789',
              username: 'test@example.com',
              role: 'user',
              action: 'login',
              loginTime: new Date(Date.now() - 86400000).toISOString(),
              logoutTime: new Date(Date.now() - 82800000).toISOString(),
              ipAddress: '192.168.1.3',
              tokenName: 'eyJhbGciOi...'
            }
          ];
          
          // Store mock logs in localStorage
          localStorage.setItem('userLogs', JSON.stringify(mockLogs));
          setUserLogs(mockLogs);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading user logs:', err);
        setLoading(false);
      }
    };

    loadUserLogs();
  }, []);

  /**
   * Format date for display
   * 
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleString();
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Invalid date';
    }
  };

  /**
   * Delete a log entry
   * 
   * @param {string} logId - ID of the log to delete
   */
  const handleDelete = (logId) => {
    // If not confirming, show confirmation first
    if (deleteConfirm !== logId) {
      setDeleteConfirm(logId);
      return;
    }
    
    // User confirmed deletion
    const updatedLogs = userLogs.filter(log => log.id !== logId);
    
    // Update state
    setUserLogs(updatedLogs);
    
    // Update localStorage
    localStorage.setItem('userLogs', JSON.stringify(updatedLogs));
    
    // Reset confirmation state
    setDeleteConfirm(null);
  };

  /**
   * Cancel delete confirmation
   */
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  /**
   * Reset logs to mock data
   */
  const resetLogs = () => {
    const mockLogs = [
      {
        id: '1',
        userId: 'admin-123',
        username: 'admin@example.com',
        role: 'admin',
        action: 'login',
        loginTime: new Date(Date.now() - 3600000).toISOString(),
        logoutTime: null,
        ipAddress: '192.168.1.1',
        tokenName: 'eyJhbGciOi...'
      },
      {
        id: '2',
        userId: 'user-456',
        username: 'user@example.com',
        role: 'user',
        action: 'login',
        loginTime: new Date(Date.now() - 7200000).toISOString(),
        logoutTime: new Date(Date.now() - 3600000).toISOString(),
        ipAddress: '192.168.1.2',
        tokenName: 'eyJhbGciOi...'
      },
      {
        id: '3',
        userId: 'user-789',
        username: 'test@example.com',
        role: 'user',
        action: 'login',
        loginTime: new Date(Date.now() - 86400000).toISOString(),
        logoutTime: new Date(Date.now() - 82800000).toISOString(),
        ipAddress: '192.168.1.3',
        tokenName: 'eyJhbGciOi...'
      }
    ];
    
    localStorage.setItem('userLogs', JSON.stringify(mockLogs));
    setUserLogs(mockLogs);
  };

  if (loading) {
    return (
      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Recent Users</h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading user logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <FaUser className="mr-2 text-blue-600" />
          User Activity Logs
        </div>
        {userLogs.length === 0 && (
          <button
            onClick={resetLogs}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            title="Reset to mock data"
          >
            Reset Logs
          </button>
        )}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left border border-gray-200 text-sm font-medium">User</th>
              <th className="p-2 text-left border border-gray-200 text-sm font-medium">Role</th>
              <th className="p-2 text-left border border-gray-200 text-sm font-medium">Login Time</th>
              <th className="p-2 text-left border border-gray-200 text-sm font-medium">Logout Time</th>
              <th className="p-2 text-left border border-gray-200 text-sm font-medium">IP Address</th>
              <th className="p-2 text-left border border-gray-200 text-sm font-medium">Token</th>
              <th className="p-2 text-center border border-gray-200 text-sm font-medium">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {userLogs.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500 border border-gray-200">
                  No user activity logs found
                </td>
              </tr>
            ) : (
              userLogs.map((log, index) => (
                <tr key={log.id || index} className="hover:bg-gray-50">
                  <td className="p-2 border border-gray-200">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">{log.username}</div>
                        <div className="text-xs text-gray-500">{log.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 border border-gray-200">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      log.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      <FaShieldAlt className="inline mr-1" />
                      {log.role}
                    </span>
                  </td>
                  <td className="p-2 border border-gray-200 text-sm">
                    <div className="flex items-center">
                      <FaClock className="text-green-500 mr-1" />
                      {formatDate(log.loginTime)}
                    </div>
                  </td>
                  <td className="p-2 border border-gray-200 text-sm">
                    <div className="flex items-center">
                      <FaSignOutAlt className="text-red-500 mr-1" />
                      {formatDate(log.logoutTime)}
                    </div>
                  </td>
                  <td className="p-2 border border-gray-200 text-sm">
                    <div className="flex items-center">
                      <FaNetworkWired className="text-gray-500 mr-1" />
                      {log.ipAddress}
                    </div>
                  </td>
                  <td className="p-2 border border-gray-200 text-sm">
                    <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                      {log.tokenName}
                    </code>
                  </td>
                  <td className="p-2 border border-gray-200 text-center">
                    {deleteConfirm === log.id ? (
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          title="Confirm delete"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete log entry"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {userLogs.length > 0 && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Showing {userLogs.length} user activity logs
        </div>
      )}
    </div>
  );
};

export default RecentUsers;
