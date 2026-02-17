import React, { useEffect, useState } from "react";
import { io as ioClient } from "socket.io-client";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();

    const socket = ioClient();
    socket.on("taskAdded", (t) => setTasks((prev) => [...prev, t]));
    socket.on("taskUpdated", (t) => setTasks((prev) => prev.map(p => p.id === t.id ? t : p)));
    socket.on("taskDeleted", (t) => setTasks((prev) => prev.filter(p => p.id !== t.id)));
    return () => socket.disconnect();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    const payload = { title, description, assignee };
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const added = await res.json();
        setTitle(""); setDescription(""); setAssignee("");
        setTasks((prev) => [...prev, added]);
      }
    } catch (err) { console.error(err); }
  }

  function startEdit(t) {
    setEditing(t);
    setTitle(t.title);
    setDescription(t.description || "");
    setAssignee(t.assignee || "");
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editing) return;
    const payload = { title, description, assignee };
    try {
      const res = await fetch(`/api/tasks/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks((prev) => prev.map(p => p.id === updated.id ? updated : p));
        setEditing(null); setTitle(""); setDescription(""); setAssignee("");
      }
    } catch (err) { console.error(err); }
  }

  async function toggleComplete(t) {
    try {
      const res = await fetch(`/api/tasks/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !t.completed }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks((prev) => prev.map(p => p.id === updated.id ? updated : p));
      }
    } catch (err) { console.error(err); }
  }

  async function removeTask(t) {
    try {
      const res = await fetch(`/api/tasks/${t.id}`, { method: "DELETE" });
      if (res.ok) {
        setTasks((prev) => prev.filter(p => p.id !== t.id));
      }
    } catch (err) { console.error(err); }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Tasks</h1>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <form onSubmit={editing ? saveEdit : handleAdd} style={{ marginBottom: 12 }}>
            <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: "60%", padding: 8 }} />
            <input placeholder="Assignee" value={assignee} onChange={e => setAssignee(e.target.value)} style={{ marginLeft: 8, padding: 8 }} />
            <button type="submit" style={{ marginLeft: 8, padding: "8px 12px" }}>{editing ? "Save" : "Add Task"}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setTitle(""); setDescription(""); setAssignee(""); }} style={{ marginLeft: 8 }}>Cancel</button>}
            <div style={{ marginTop: 8 }}>
              <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ width: "100%", minHeight: 60 }} />
            </div>
          </form>

          <div>
            {tasks.map(t => (
              <div key={t.id} style={{ padding: 12, border: "1px solid #eee", marginBottom: 8, borderRadius: 6, background: t.completed ? "#f0fff0" : "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <strong>{t.title}</strong>
                    <div style={{ fontSize: 12, color: "#666" }}>{t.assignee ? `Assigned to ${t.assignee}` : "Unassigned"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => toggleComplete(t)}>{t.completed ? "Undo" : "Done"}</button>
                    <button onClick={() => startEdit(t)}>Edit</button>
                    <button onClick={() => removeTask(t)}>Delete</button>
                  </div>
                </div>
                {t.description && <div style={{ marginTop: 8 }}>{t.description}</div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: 260 }}>
          <h3>Team</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Taliah</div>
              <button onClick={() => setAssignee("Taliah")}>Assign</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Moses</div>
              <button onClick={() => setAssignee("Moses")}>Assign</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Deshawn</div>
              <button onClick={() => setAssignee("Deshawn")}>Assign</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Jalen</div>
              <button onClick={() => setAssignee("Jalen")}>Assign</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Jason</div>
              <button onClick={() => setAssignee("Jason")}>Assign</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
