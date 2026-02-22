import { useCallback, useEffect, useState } from "react";
import { io as ioClient } from "socket.io-client";
import formatDate from "../utils/date";

export default function useCalendarEvents() {
  const [eventsByDate, setEventsByDate] = useState({});
  const [loadingDates, setLoadingDates] = useState({});

  const fetchForDate = useCallback(async (key) => {
    if (!key) return;
    // avoid double-fetching same date concurrently
    if (loadingDates[key]) return;
    setLoadingDates((s) => ({ ...s, [key]: true }));
    try {
      const res = await fetch(`/api/events?date=${key}`);
      if (res.ok) {
        const data = await res.json();
        setEventsByDate((prev) => ({ ...prev, [key]: data }));
      } else {
        setEventsByDate((prev) => ({ ...prev, [key]: [] }));
      }
    } catch (err) {
      console.error("Failed to load events for", key, err);
      setEventsByDate((prev) => ({ ...prev, [key]: [] }));
    } finally {
      setLoadingDates((s) => {
        const copy = { ...s };
        delete copy[key];
        return copy;
      });
    }
  }, [loadingDates]);

  const ensureDateLoaded = useCallback((date) => {
    const key = formatDate(date);
    if (!eventsByDate[key]) {
      fetchForDate(key);
    }
  }, [eventsByDate, fetchForDate]);

  const addEvent = useCallback(async (payload) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const added = await response.json();
        const key = formatDate(added.date || payload.date);
        setEventsByDate((prev) => {
          const list = prev[key] ? [...prev[key], added] : [added];
          return { ...prev, [key]: list };
        });
        return added;
      }
      throw new Error(`failed to add event: ${response.status}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    const socket = ioClient();
    socket.on("eventAdded", (ev) => {
      setEventsByDate((prev) => {
        const key = formatDate(ev.date);
        const list = prev[key] ? [...prev[key], ev] : [ev];
        return { ...prev, [key]: list };
      });
    });

    return () => {
      try { socket.disconnect(); } catch (e) { /* ignore */ }
    };
  }, []);

  return {
    eventsByDate,
    ensureDateLoaded,
    addEvent,
  };
}
