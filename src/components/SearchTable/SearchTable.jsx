/**
 * SearchTable Component
 * A full-featured data table with search, filter, and sort capabilities
 * Demonstrates: useState, useMemo, array methods, conditional rendering
 */
import { useState, useMemo } from 'react';
import './SearchTable.css';

// Sample data - in a real app, this would come from an API
const initialUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-14' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Editor', status: 'Inactive', lastLogin: '2023-12-20' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-13' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Suspended', lastLogin: '2024-01-10' },
  { id: 6, name: 'Frank Wilson', email: 'frank@example.com', role: 'Editor', status: 'Active', lastLogin: '2024-01-12' },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'User', status: 'Inactive', lastLogin: '2023-12-28' },
  { id: 8, name: 'Henry Kim', email: 'henry@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-11' },
  { id: 9, name: 'Ivy Martinez', email: 'ivy@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-14' },
  { id: 10, name: 'Jack Taylor', email: 'jack@example.com', role: 'Editor', status: 'Suspended', lastLogin: '2024-01-08' },
];

export default function SearchTable() {
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for role filter
  const [filterRole, setFilterRole] = useState('All');
  
  // State for sorting
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  /**
   * useMemo: Get unique roles for filter dropdown
   * Only recalculates when initialUsers changes (never in this example)
   */
  const roles = useMemo(() => {
    const roleSet = new Set(initialUsers.map(user => user.role));
    return ['All', ...roleSet];
  }, []);

  /**
   * useMemo: Filter the data based on search term and role
   * Only recalculates when searchTerm or filterRole changes
   * Performance optimization - prevents unnecessary filtering on every render
   */
  const filteredUsers = useMemo(() => {
    let filtered = initialUsers;

    // Search filter - case insensitive
    if (searchTerm.trim()) {
      const lowercasedSearch = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(lowercasedSearch) ||
        user.email.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Role filter
    if (filterRole !== 'All') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    return filtered;
  }, [searchTerm, filterRole]);

  /**
   * useMemo: Sort the filtered data
   * Only recalculates when filteredUsers, sortField, or sortDirection changes
   */
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      // Handle different data types
      if (typeof a[sortField] === 'string') {
        comparison = a[sortField].localeCompare(b[sortField]);
      } else {
        comparison = a[sortField] < b[sortField] ? -1 : 
                     a[sortField] > b[sortField] ? 1 : 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [filteredUsers, sortField, sortDirection]);

  /**
   * Handle column sort
   * Toggles direction if same column, otherwise sets new column with asc
   */
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  /**
   * Get status badge color based on status
   * Returns CSS class name
   */
  const getStatusClass = (status) => {
    const classes = {
      'Active': 'status-active',
      'Inactive': 'status-inactive',
      'Suspended': 'status-suspended'
    };
    return classes[status] || '';
  };

  /**
   * Get status icon for better visual representation
   */
  const getStatusIcon = (status) => {
    const icons = {
      'Active': '🟢',
      'Inactive': '⭕',
      'Suspended': '🔴'
    };
    return icons[status] || '';
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>👥 User Management</h2>
        <div className="table-stats">
          <span>Total: {initialUsers.length}</span>
          <span>Showing: {sortedUsers.length}</span>
        </div>
      </div>
      
      {/* Controls Section - Search, Filter, and Results info */}
      <div className="table-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search users"
          />
          {searchTerm && (
            <button 
              className="search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="filter-box">
          <label htmlFor="role-filter">Filter by role:</label>
          <select
            id="role-filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        
        <div className="results-info">
          {sortedUsers.length === 0 ? (
            <span className="no-results-msg">No users found</span>
          ) : (
            <span>Showing {sortedUsers.length} of {initialUsers.length} users</span>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Name 
                <span className="sort-indicator">
                  {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email
                <span className="sort-indicator">
                  {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th onClick={() => handleSort('role')} className="sortable">
                Role
                <span className="sort-indicator">
                  {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status
                <span className="sort-indicator">
                  {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th onClick={() => handleSort('lastLogin')} className="sortable">
                Last Login
                <span className="sort-indicator">
                  {sortField === 'lastLogin' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Conditional rendering: Show message if no results */}
            {sortedUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-results-cell">
                  <div className="no-results-content">
                    <span className="empty-icon">🔍</span>
                    <p>No users match your search criteria</p>
                    <button 
                      className="clear-filters-btn"
                      onClick={() => {
                        setSearchTerm('');
                        setFilterRole('All');
                      }}
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              // Render each user row
              sortedUsers.map(user => (
                <tr key={user.id} className="user-row">
                  <td className="user-name">{user.name}</td>
                  <td className="user-email">
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    <span className="role-badge">{user.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(user.status)}`}>
                      {getStatusIcon(user.status)} {user.status}
                    </span>
                  </td>
                  <td className="last-login">{user.lastLogin}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with additional info */}
      <div className="table-footer">
        <div className="table-actions">
          <button className="export-btn" onClick={() => alert('Export functionality would go here')}>
            📥 Export Data
          </button>
        </div>
        <div className="table-pagination-info">
          Page 1 of 1
        </div>
      </div>
    </div>
  );
}