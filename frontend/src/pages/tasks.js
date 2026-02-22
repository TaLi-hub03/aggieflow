import React, { useState } from "react";
import useTasks from "../hooks/useTasks";
import "../styles/tasks.css";


export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [editing, setEditing] = useState(null);

  // Only UI and form state remain here. All data logic is in useTasks hook.
  async function handleAdd(e) {
    e.preventDefault();
    try {
      await addTask({ title, description, assignee });
      setTitle(""); setDescription(""); setAssignee("");
    } catch (err) { alert("Failed to add task: " + err.message); }
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
    try {
      await updateTask(editing.id, { title, description, assignee });
      setEditing(null); setTitle(""); setDescription(""); setAssignee("");
    } catch (err) { alert("Failed to update task: " + err.message); }
  }

  async function toggleComplete(t) {
    try {
      await updateTask(t.id, { completed: !t.completed });
    } catch (err) { alert("Failed to update task: " + err.message); }
  }

  async function removeTask(t) {
    try {
      await deleteTask(t.id);
    } catch (err) { alert("Failed to delete task: " + err.message); }
  }

  return (
    <div className="tasks-container">
      <h1>Tasks</h1>
      <div className="tasks-layout">
        <div className="tasks-main">
          <form className="tasks-form" onSubmit={editing ? saveEdit : handleAdd}>
            <input
              className="tasks-input title-input"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <input
              className="tasks-input assignee-input"
              placeholder="Assignee"
              value={assignee}
              onChange={e => setAssignee(e.target.value)}
            />
            <button type="submit" className="tasks-btn submit-btn">{editing ? "Save" : "Add Task"}</button>
            {editing && (
              <button
                type="button"
                className="tasks-btn cancel-btn"
                onClick={() => { setEditing(null); setTitle(""); setDescription(""); setAssignee(""); }}
              >
                Cancel
              </button>
            )}
            <div className="tasks-desc-row">
              <textarea
                className="tasks-input desc-input"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </form>

          <div className="tasks-list">
            {tasks.map(t => (
              <div key={t.id} className={`task-card${t.completed ? ' done' : ''}`}>
                <div className="task-row">
                  <div>
                    <strong>{t.title}</strong>
                    <div className="meta">{t.assignee ? `Assigned to ${t.assignee}` : "Unassigned"}</div>
                  </div>
                  <div className="task-actions">
                    <button className="tasks-btn done-btn" onClick={() => toggleComplete(t)}>{t.completed ? "Undo" : "Done"}</button>
                    <button className="tasks-btn edit-btn" onClick={() => startEdit(t)}>Edit</button>
                    <button className="tasks-btn delete-btn" onClick={() => removeTask(t)}>Delete</button>
                  </div>
                </div>
                {t.description && <div className="task-desc">{t.description}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="team-list">
          <h3>Team</h3>
          <div className="team-list-items">
            {['Taliah', 'Moses', 'Deshawn', 'Jalen', 'Jason'].map(name => (
              <div className="team-list-row" key={name}>
                <div>{name}</div>
                <button className="tasks-btn assign-btn" onClick={() => setAssignee(name)}>Assign</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
