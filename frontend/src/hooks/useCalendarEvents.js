import { useCallback, useEffect, useState } from "react";
import { io as ioClient } from "socket.io-client";
import formatDate from "../utils/date";

export default function useCalendarEvents() {
  const [eventsByDate, setEventsByDate] = useState({});
  const [loadingDates, setLoadingDates] = useState({});

  const fetchForDate = useCallback(async (key) => {
    if (!key) return;
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

  const updateEvent = useCallback(async (eventId, payload) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const updated = await response.json();
        const oldKey = Object.keys(eventsByDate).find((key) => 
          eventsByDate[key].some((e) => e.id === eventId)
        );
        const newKey = formatDate(updated.date);
        
        setEventsByDate((prev) => {
          const newPrev = { ...prev };
          if (oldKey && oldKey !== newKey) {
            newPrev[oldKey] = newPrev[oldKey].filter((e) => e.id !== eventId);
          } else if (oldKey) {
            newPrev[oldKey] = newPrev[oldKey].map((e) => e.id === eventId ? updated : e);
            return newPrev;
          }
          newPrev[newKey] = newPrev[newKey] ? [...newPrev[newKey], updated] : [updated];
          return newPrev;
        });
        return updated;
      }
      throw new Error(`failed to update event: ${response.status}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [eventsByDate]);

  const deleteEvent = useCallback(async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setEventsByDate((prev) => {
          const newPrev = { ...prev };
          Object.keys(newPrev).forEach((key) => {
            newPrev[key] = newPrev[key].filter((e) => e.id !== eventId);
          });
          return newPrev;
        });
        return true;
      }
      throw new Error(`failed to delete event: ${response.status}`);
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

    socket.on("eventUpdated", (ev) => {
      setEventsByDate((prev) => {
        const newPrev = { ...prev };
        Object.keys(newPrev).forEach((key) => {
          newPrev[key] = newPrev[key].map((e) => e.id === ev.id ? ev : e);
        });
        return newPrev;
      });
    });

    socket.on("eventDeleted", (eventId) => {
      setEventsByDate((prev) => {
        const newPrev = { ...prev };
        Object.keys(newPrev).forEach((key) => {
          newPrev[key] = newPrev[key].filter((e) => e.id !== eventId);
        });
        return newPrev;
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
    updateEvent,
    deleteEvent,
  };
}
