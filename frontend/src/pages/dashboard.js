import React, { useEffect, useState } from "react";
import { io as ioClient } from "socket.io-client";
import "../styles/dashboard.css";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          data.sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
          setEvents(data);
        }
      } catch (err) {
        console.error("Failed to load events for dashboard", err);
      }
    };
    load();
    // Socket.IO: update when new events are added elsewhere
    const socket = ioClient();
    socket.on("eventAdded", (ev) => {
      setEvents((prev) => {
        const merged = [...prev, ev];
        merged.sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
        return merged;
      });
    });
    // task real-time updates
    socket.on("taskAdded", (t) => setTasks((prev) => [...prev, t]));
    socket.on("taskUpdated", (t) => setTasks((prev) => prev.map(p => p.id === t.id ? t : p)));
    socket.on("taskDeleted", (t) => setTasks((prev) => prev.filter(p => p.id !== t.id)));
    return () => socket.disconnect();
  }, []);

  const upcoming = events.slice(0, 5);
  const recentTasks = tasks.slice().reverse().slice(0, 5);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const inProgressTasks = totalTasks - completedTasks;

  return (
    <div className="dashboard-root" style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AggieFlow Dashboard</h1>

      <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Tasks</h3>
          <p>{totalTasks}</p>
        </div>

        <div style={cardStyle}>
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </div>

        <div style={cardStyle}>
          <h3>In Progress</h3>
          <p>{inProgressTasks}</p>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>Upcoming Events</h2>
        {upcoming.length ? (
          <ul>
            {upcoming.map((ev) => (
              <li key={ev.id} style={{ marginBottom: 8 }}>
                <strong>{ev.title}</strong> — {ev.date} {ev.time ? `@ ${ev.time}` : ""}
                {ev.description ? <div style={{ color: "#555" }}>{ev.description}</div> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming events</p>
        )}
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>Recent Tasks</h2>
        {recentTasks.length ? (
          <ul>
            {recentTasks.map((t) => (
              <li key={t.id} style={{ marginBottom: 8 }}>
                <strong>{t.title}</strong> — {t.assignee || "Unassigned"} {t.completed ? "(Done)" : ""}
                {t.description ? <div style={{ color: "#555" }}>{t.description}</div> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks yet</p>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  width: "150px",
  backgroundColor: "#f4f4f4",
  textAlign: "center"
};

export default Dashboard;

