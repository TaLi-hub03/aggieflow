import React, { useState } from "react";
import "../styles/team.css";
import useTeamMembers from "../hooks/useTeamMembers";

export default function Team() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Member" });
  const teamId = 1;
  const { members, addMember, removeMember, updateStatus } = useTeamMembers(teamId);

  const onlineCount = members.filter(m => m.status === "online").length;
  const totalTasks = members.reduce((sum, m) => sum + m.tasksAssigned, 0);
  const avgWorkload = totalTasks > 0 ? (totalTasks / members.length).toFixed(1) : 0;

  async function handleAddMember(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    try {
      await addMember(formData);
      setFormData({ name: "", email: "", role: "Member" });
      setShowAddForm(false);
    } catch (err) {
      alert("Failed to add member: " + err.message);
    }
  }

  async function handleRemoveMember(memberId) {
    if (window.confirm("Remove this member?")) {
      try {
        await removeMember(memberId);
      } catch (err) {
        alert("Failed to remove member: " + err.message);
      }
    }
  }

  async function toggleMemberStatus(member) {
    const newStatus = member.status === "online" ? "offline" : "online";
    try {
      await updateStatus(member, newStatus);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  }

  return (
    <div className="team-page">
      {/* Header */}
      <div className="team-header">
        <h1>Team</h1>
        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "+ Add Member"}
        </button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="add-member-form">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleAddMember}>
            <input
              placeholder="Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
            <button type="submit">Add</button>
          </form>
        </div>
      )}

      {/* Team Stats */}
      <div className="team-stats">
        <div className="stat-card">
          <h3>Total Members</h3>
          <p className="stat-value">{members.length}</p>
        </div>
        <div className="stat-card">
          <h3>Online</h3>
          <p className="stat-value">{onlineCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-value">{totalTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Workload</h3>
          <p className="stat-value">{avgWorkload}</p>
        </div>
      </div>

      {/* Members List */}
      <div className="members-section">
        <h2>Team Members</h2>
        <div className="members-grid">
          {members.length ? (
            members.map(member => (
              <div key={member.id} className="member-card">
                <div className="member-header">
                  <div
                    className="member-avatar"
                    style={{ backgroundColor: member.status === "online" ? "#10b981" : "#6b7280" }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <p className="member-email">{member.email}</p>
                    <div className="member-meta">
                      <span className={`role ${member.role.toLowerCase()}`}>{member.role}</span>
                      <span
                        className={`status ${member.status}`}
                        onClick={() => toggleMemberStatus(member)}
                        title="Toggle online/offline"
                      >
                        ● {member.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="member-workload">
                  <div className="workload-item">
                    <span>Tasks Assigned</span>
                    <strong>{member.tasksAssigned}</strong>
                  </div>
                  <div className="workload-item">
                    <span>Completed</span>
                    <strong>{member.tasksCompleted}</strong>
                  </div>
                </div>

                <button className="remove-btn" onClick={() => handleRemoveMember(member.id)}>
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="empty-state">No team members yet. Add one to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
}
