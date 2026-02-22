
import React from "react";
import PropTypes from "prop-types";
import "../styles/components.css";

function RecentTasks({ tasks }) {
  return (
    <section className="section">
      <h2 className="section-title">Recent Tasks</h2>
      {tasks && tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item${task.completed ? " completed" : ""}`}>
              <div className="task-header">
                <strong className="task-title">{task.title}</strong>
                {task.completed && <span className="task-badge">Done</span>}
              </div>
              <p className="task-assignee">{task.assignee || "Unassigned"}</p>
              {task.description && <p className="task-description">{task.description}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">No tasks yet</div>
      )}
    </section>
  );
}

RecentTasks.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool,
      assignee: PropTypes.string,
      description: PropTypes.string,
    })
  ),
};

export default RecentTasks;
