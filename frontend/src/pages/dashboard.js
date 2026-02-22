import React, { useMemo } from "react";
import TaskStats from "../components/TaskStats";
import UpcomingEvents from "../components/UpcomingEvents";
import RecentTasks from "../components/RecentTasks";
import "../styles/dashboard.css";
import useDashboardData from "../hooks/useDashboardData";

function Dashboard() {
  const { events, tasks, loading } = useDashboardData();

  const upcoming = useMemo(() => (events || []).slice(0, 5), [events]);
  const recentTasks = useMemo(() => (tasks || []).slice().reverse().slice(0, 5), [tasks]);
  const totalTasks = (tasks || []).length;
  const completedTasks = useMemo(() => (tasks || []).filter(t => t.completed).length, [tasks]);
  const inProgressTasks = totalTasks - completedTasks;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's your overview.</p>
      </div>

      <TaskStats 
        total={totalTasks} 
        completed={completedTasks} 
        inProgress={inProgressTasks} 
      />

      <div className="dashboard-content">
        <UpcomingEvents events={upcoming} />
        <RecentTasks tasks={recentTasks} />
      </div>
    </div>
  );
}

export default Dashboard;

