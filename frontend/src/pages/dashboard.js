import React, { useMemo, useState } from "react";
import TaskStats from "../components/TaskStats";
import UpcomingEvents from "../components/UpcomingEvents";
import RecentTasks from "../components/RecentTasks";
import "../styles/dashboard.css";
import useDashboardData from "../hooks/useDashboardData";

function Dashboard() {
  const { events, tasks, loading } = useDashboardData();
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  });

  const upcoming = useMemo(() => (events || []).slice(0, 5), [events]);
  const recentTasks = useMemo(() => (tasks || []).slice().reverse().slice(0, 5), [tasks]);
  const totalTasks = (tasks || []).length;
  const completedTasks = useMemo(() => (tasks || []).filter(t => t.completed).length, [tasks]);
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="dashboard-container">
      {/* 1. Improved Status Header */}
      <div className="status-header">
        <div className={`status-pill ${loading ? 'syncing' : 'online'}`}>
          <span className="status-dot"></span>
          <span>{loading ? "Syncing Data..." : "System Online"}</span>
        </div>
        <div className="date-pill">
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="dashboard-header">
        <div className="header-text">
          <h1>{greeting}, User</h1>
          <p className="dashboard-subtitle">Monitor your team's flow and upcoming deadlines.</p>
        </div>
        
        {/* 2. Optimized Workload Ring */}
        <div className="workload-card">
          <div className="progress-container">
             <div className="progress-circle" style={{ "--progress": `${progress * 3.6}deg` }}>
               <div className="progress-inner">
                 <span className="progress-value">{progress}%</span>
               </div>
             </div>
          </div>
          <div className="workload-details">
            <span className="workload-title">Daily Goal</span>
            <span className="workload-stats"><strong>{completedTasks}</strong> of {totalTasks} tasks</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="quick-actions-grid">
        <button className="action-button" onClick={() => window.location.href='/tasks'}>
          <div className="icon-box">➕</div>
          <div className="btn-label">New Task</div>
        </button>
        <button className="action-button" onClick={() => window.location.href='/calendar'}>
          <div className="icon-box">📅</div>
          <div className="btn-label">Schedule</div>
        </button>
        <button className="action-button" onClick={() => window.location.href='/team'}>
          <div className="icon-box">👥</div>
          <div className="btn-label">Team</div>
        </button>
      </div>

      <TaskStats 
        total={totalTasks} 
        completed={completedTasks} 
        inProgress={totalTasks - completedTasks} 
      />

      <div className="dashboard-content">
        <UpcomingEvents events={upcoming} />
        <RecentTasks tasks={recentTasks} />
      </div>
    </div>
  );
}

export default Dashboard;
