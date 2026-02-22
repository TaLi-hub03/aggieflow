import { useCallback, useEffect, useState } from 'react';
import { io as ioClient } from 'socket.io-client';

function sortByDate(a, b) {
  const da = new Date(a?.date);
  const db = new Date(b?.date);
  return da - db;
}

export default function useDashboardData() {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const evRes = await fetch('/api/events');
      if (evRes.ok) {
        const data = await evRes.json();
        data.sort(sortByDate);
        setEvents(data);
      }

      const taskRes = await fetch('/api/tasks');
      if (taskRes.ok) {
        const taskData = await taskRes.json();
        setTasks(taskData);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    const socket = ioClient();

    socket.on('eventAdded', (ev) => {
      setEvents((prev) => {
        const merged = [...prev, ev];
        merged.sort(sortByDate);
        return merged;
      });
    });

    socket.on('taskAdded', (t) => setTasks((prev) => [...prev, t]));
    socket.on('taskUpdated', (t) => setTasks((prev) => prev.map(p => p.id === t.id ? t : p)));
    socket.on('taskDeleted', (t) => setTasks((prev) => prev.filter(p => p.id !== t.id)));

    return () => {
      try { socket.disconnect(); } catch (e) { /* ignore */ }
    };
  }, [load]);

  return {
    events,
    tasks,
    loading,
    error,
    refresh: load,
  };
}
