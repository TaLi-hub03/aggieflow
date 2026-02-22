import { useCallback, useEffect, useState } from "react";
import { io as ioClient } from "socket.io-client";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const socket = ioClient();
    socket.on("taskAdded", (t) => setTasks((prev) => [...prev, t]));
    socket.on("taskUpdated", (t) => setTasks((prev) => prev.map(p => p.id === t.id ? t : p)));
    socket.on("taskDeleted", (t) => setTasks((prev) => prev.filter(p => p.id !== t.id)));
    return () => socket.disconnect();
  }, [load]);

  const addTask = useCallback(async (payload) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const added = await res.json();
      setTasks((prev) => [...prev, added]);
      return added;
    }
    throw new Error("Failed to add task");
  }, []);

  const updateTask = useCallback(async (id, payload) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks((prev) => prev.map(p => p.id === updated.id ? updated : p));
      return updated;
    }
    throw new Error("Failed to update task");
  }, []);

  const deleteTask = useCallback(async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks((prev) => prev.filter(p => p.id !== id));
      return true;
    }
    throw new Error("Failed to delete task");
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    refresh: load,
  };
}