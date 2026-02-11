import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./sidebarLayout.css";

function SidebarLayout() {
  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">AggieFlow</h2>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Tasks
            </NavLink>
          </li>
          <li>
            <NavLink to="/calendar" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink to="/team" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Team
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Settings
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="content">
        <Outlet /> {/* renders the page component based on current route */}
      </div>
    </div>
  );
}

export default SidebarLayout;
