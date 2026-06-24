/**
 * Dashboard Component
 * A dashboard with metric cards, loading states, and data visualization
 * Demonstrates: useState, useEffect, useMemo, conditional rendering, component composition
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import './Dashboard.css';

// ============================================
// SUB-COMPONENT: Card
// ============================================

/**
 * Individual metric card component
 * Displays a single metric with icon, value, and trend
 */
function MetricCard({ 
  title,        // String: card title
  value,        // String/Number: main value to display
  icon,         // String/ReactNode: icon to display
  color = 'blue', // String: color variant
  trend,        // Number: percentage change (positive = up, negative = down)
  trendLabel,   // String: label for trend (e.g., "vs last week")
  subtitle,     // String: optional subtitle
  isLoading = false // Boolean: loading state
}) {
  return (
    <div className={`metric-card metric-${color}`}>
      <div className="metric-header">
        <span className="metric-icon" aria-hidden="true">{icon}</span>
        <span className="metric-title">{title}</span>
      </div>
      
      <div className="metric-value-wrapper">
        {isLoading ? (
          <div className="metric-skeleton"></div>
        ) : (
          <span className="metric-value">{value}</span>
        )}
      </div>
      
      {subtitle && !isLoading && (
        <span className="metric-subtitle">{subtitle}</span>
      )}
      
      {trend !== undefined && !isLoading && (
        <div className={`metric-trend ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
          <span className="trend-arrow" aria-hidden="true">
            {trend >= 0 ? '↑' : '↓'}
          </span>
          <span className="trend-value">{Math.abs(trend)}%</span>
          <span className="trend-label">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

// ============================================
// SUB-COMPONENT: Activity Feed
// ============================================

/**
 * Activity feed component
 * Shows recent activities in a timeline
 */
function ActivityFeed({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="activity-empty">
        <span>📭</span>
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <h3 className="activity-title">Recent Activity</h3>
      <div className="activity-timeline">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-dot" style={{ background: activity.color || '#2563eb' }}></div>
            <div className="activity-content">
              <p className="activity-text">{activity.text}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT: Dashboard
// ============================================

export default function Dashboard() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('weekly');
  const [error, setError] = useState(null);

  // ============================================
  // DATA FETCHING
  // ============================================
  
  /**
   * Simulate API data fetching
   * In real app, this would be an actual API call
   */
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Simulate API call with delay
    const fetchData = async () => {
      try {
        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Simulate random failure (10% chance for demo)
        if (Math.random() < 0.1) {
          throw new Error('Failed to fetch dashboard data');
        }

        // Mock data
        const mockData = {
          metrics: {
            totalUsers: 1243,
            activeUsers: 876,
            revenue: 48250,
            conversionRate: 3.2,
            averageSession: 4.7,
            bounceRate: 28.5
          },
          trends: {
            totalUsers: 12,
            activeUsers: 8,
            revenue: 15,
            conversionRate: -0.5,
            averageSession: 2.3,
            bounceRate: -3.1
          },
          activities: [
            { text: 'New user registered: John Doe', time: '2 minutes ago', color: '#2563eb' },
            { text: 'Revenue milestone: $10,000 reached', time: '15 minutes ago', color: '#16a34a' },
            { text: 'Server maintenance completed', time: '1 hour ago', color: '#f59e0b' },
            { text: 'User reported bug #123', time: '3 hours ago', color: '#dc2626' },
            { text: 'New feature deployed: Dark mode', time: '5 hours ago', color: '#7c3aed' },
          ]
        };

        if (isMounted) {
          setData(mockData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array = run once on mount

  // ============================================
  // MEMOIZED DATA PROCESSING
  // ============================================
  
  /**
   * Process and format metric data
   * Only recalculates when data or timeframe changes
   */
  const metrics = useMemo(() => {
    if (!data) return [];

    const { metrics: m, trends: t } = data;
    
    return [
      {
        id: 'users',
        title: 'Total Users',
        value: m.totalUsers.toLocaleString(),
        icon: '👥',
        color: 'blue',
        trend: t.totalUsers,
        trendLabel: `vs last ${timeframe}`,
        subtitle: `${m.activeUsers.toLocaleString()} active now`
      },
      {
        id: 'revenue',
        title: 'Revenue',
        value: `$${m.revenue.toLocaleString()}`,
        icon: '💰',
        color: 'green',
        trend: t.revenue,
        trendLabel: `vs last ${timeframe}`,
        subtitle: `Avg. $${Math.round(m.revenue / 30)}/day`
      },
      {
        id: 'conversion',
        title: 'Conversion Rate',
        value: `${m.conversionRate}%`,
        icon: '📊',
        color: 'purple',
        trend: t.conversionRate,
        trendLabel: `vs last ${timeframe}`,
        subtitle: '2.1% industry average'
      },
      {
        id: 'bounce',
        title: 'Bounce Rate',
        value: `${m.bounceRate}%`,
        icon: '📉',
        color: 'orange',
        trend: -t.bounceRate, // Invert because lower bounce rate is better
        trendLabel: `vs last ${timeframe}`,
        subtitle: 'Good: 26-40% is average'
      },
      {
        id: 'session',
        title: 'Avg. Session',
        value: `${m.averageSession}m`,
        icon: '⏱️',
        color: 'teal',
        trend: t.averageSession,
        trendLabel: `vs last ${timeframe}`,
        subtitle: 'Industry: 2-3 minutes'
      },
      {
        id: 'active',
        title: 'Active Users',
        value: m.activeUsers.toLocaleString(),
        icon: '🟢',
        color: 'emerald',
        trend: t.activeUsers,
        trendLabel: `vs last ${timeframe}`,
        subtitle: `${Math.round((m.activeUsers / m.totalUsers) * 100)}% of total`
      }
    ];
  }, [data, timeframe]);

  /**
   * Get timeframe label for display
   */
  const timeframeLabel = useMemo(() => {
    const labels = {
      daily: 'Today',
      weekly: 'This Week',
      monthly: 'This Month'
    };
    return labels[timeframe] || 'This Week';
  }, [timeframe]);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  /**
   * Handle timeframe change
   */
  const handleTimeframeChange = useCallback((e) => {
    setTimeframe(e.target.value);
  }, []);

  /**
   * Handle refresh data
   */
  const handleRefresh = useCallback(() => {
    // Reset and refetch
    setData(null);
    setLoading(true);
    setError(null);
    
    // Simulate refetch
    setTimeout(() => {
      setData({
        metrics: {
          totalUsers: Math.floor(1243 + Math.random() * 100),
          activeUsers: Math.floor(876 + Math.random() * 50),
          revenue: 48250 + Math.floor(Math.random() * 5000),
          conversionRate: 3.2 + (Math.random() - 0.5) * 0.5,
          averageSession: 4.7 + (Math.random() - 0.5) * 0.5,
          bounceRate: 28.5 + (Math.random() - 0.5) * 2
        },
        trends: {
          totalUsers: Math.floor(5 + Math.random() * 15),
          activeUsers: Math.floor(3 + Math.random() * 12),
          revenue: Math.floor(8 + Math.random() * 15),
          conversionRate: (Math.random() - 0.5) * 2,
          averageSession: (Math.random() - 0.5) * 1.5,
          bounceRate: -(Math.random() * 5)
        },
        activities: [
          { text: 'New user registered: Jane Smith', time: 'Just now', color: '#2563eb' },
          { text: 'Revenue milestone: $15,000 reached', time: '2 minutes ago', color: '#16a34a' },
          { text: 'System update completed', time: '10 minutes ago', color: '#f59e0b' },
          { text: 'New support ticket opened', time: '25 minutes ago', color: '#dc2626' },
          { text: 'Feature request: Dark mode', time: '1 hour ago', color: '#7c3aed' },
        ]
      });
      setLoading(false);
    }, 600);
  }, []);

  // ============================================
  // RENDER
  // ============================================

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error">
          <span className="error-icon-large">⚠️</span>
          <h3>Failed to load dashboard</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={handleRefresh}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h2>📊 Dashboard</h2>
          <span className="header-subtitle">{timeframeLabel} overview</span>
        </div>
        <div className="header-right">
          <select 
            className="timeframe-select"
            value={timeframe}
            onChange={handleTimeframeChange}
            aria-label="Select timeframe"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            aria-label="Refresh data"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map(metric => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </div>

      {/* Bottom Section: Activity Feed + Summary */}
      <div className="dashboard-bottom">
        <div className="activity-section">
          <ActivityFeed activities={data?.activities} />
        </div>
        <div className="summary-section">
          <div className="summary-card">
            <h3>Quick Summary</h3>
            <div className="summary-stats">
              <div className="summary-item">
                <span className="summary-label">Total Users</span>
                <span className="summary-value">{data?.metrics.totalUsers.toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Active Users</span>
                <span className="summary-value">{data?.metrics.activeUsers.toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Revenue</span>
                <span className="summary-value">${data?.metrics.revenue.toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Conversion Rate</span>
                <span className="summary-value">{data?.metrics.conversionRate}%</span>
              </div>
            </div>
            <div className="summary-updated">
              Updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}