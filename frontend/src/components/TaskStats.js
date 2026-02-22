import React from "react";
import "../styles/components.css";

function TaskStats({ total, completed, inProgress }) {
  const stats = [
    { label: "Total Tasks", value: total, color: "primary" },
    { label: "Completed", value: completed, color: "success" },
    { label: "In Progress", value: inProgress, color: "warning" }
  ];

  return (
    <div className="stats-container">
      {stats.map((stat, idx) => (
        <div key={idx} className={`stat-card stat-card-${stat.color}`}>
          <h3 className="stat-label">{stat.label}</h3>
          <p className="stat-value">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

export default TaskStats;
