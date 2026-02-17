import React, { useEffect, useState } from "react";
import { io as ioClient } from "socket.io-client";
import "../styles/team.css";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Member" });
  const teamId = 1; // default team

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await fetch(`/api/teams/${teamId}/members`);
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch (err) {
        console.error("Failed to load team members", err);
      }
    };
    loadMembers();

    const socket = ioClient();
    socket.on("memberAdded", ({ teamId: tid, member }) => {
      if (tid === teamId) setMembers((prev) => [...prev, member]);
    });
    socket.on("memberRemoved", ({ teamId: tid, memberId }) => {
      if (tid === teamId) setMembers((prev) => prev.filter(m => m.id !== memberId));
    });
    socket.on("memberStatusChanged", ({ teamId: tid, memberId, status }) => {
      if (tid === teamId) setMembers((prev) => prev.map(m => m.id === memberId ? { ...m, status } : m));
    });
    return () => socket.disconnect();
  }, [teamId]);

  async function handleAddMember(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    try {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const newMember = await res.json();
        setMembers((prev) => [...prev, newMember]);
        setFormData({ name: "", email: "", role: "Member" });
        setShowAddForm(false);
      }
    } catch (err) {
      console.error("Failed to add member", err);
    }
  }

  async function handleRemoveMember(memberId) {
    if (window.confirm("Remove this member?")) {
      try {
        const res = await fetch(`/api/teams/${teamId}/members/${memberId}`, { method: "DELETE" });
        if (res.ok) {
          setMembers((prev) => prev.filter(m => m.id !== memberId));
        }
      } catch (err) {
        console.error("Failed to remove member", err);
      }
    }
  }

  async function toggleMemberStatus(member) {
    const newStatus = member.status === "online" ? "offline" : "online";
    try {
      const res = await fetch(`/api/teams/${teamId}/members/${member.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMembers((prev) => prev.map(m => m.id === member.id ? { ...m, status: newStatus } : m));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  }

  const onlineCount = members.filter(m => m.status === "online").length;
  const totalTasks = members.reduce((sum, m) => sum + m.tasksAssigned, 0);
  const avgWorkload = totalTasks > 0 ? (totalTasks / members.length).toFixed(1) : 0;

  return (
    <div className="team-page">
      <div className="team-header">
        <h1>Team</h1>
        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "+ Add Member"}
        </button>
      </div>

      {showAddForm && (
        <div className="add-member-form">
          <form onSubmit={handleAddMember}>
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
            <button type="submit">Add</button>
          </form>
        </div>
      )}

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

      <div className="members-section">
        <h2>Team Members</h2>
        <div className="members-grid">
          {members.length ? (
            members.map((member) => (
              <div key={member.id} className="member-card">
                <div className="member-header">
                  <div className="member-avatar" style={{ backgroundColor: member.status === "online" ? "#10b981" : "#6b7280" }}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <p className="member-email">{member.email}</p>
                    <div className="member-meta">
                      <span className={`role ${member.role.toLowerCase()}`}>{member.role}</span>
                      <span className={`status ${member.status}`} onClick={() => toggleMemberStatus(member)}>
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
