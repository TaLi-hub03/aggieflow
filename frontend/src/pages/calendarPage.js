import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendarPage.css";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const STORAGE_KEY = "aggieflow_calendar_events_v1";

  const defaultEvents = {
    "2026-02-14": [
      { id: 1, title: "Valentine's Day Event", time: "", description: "" },
    ],
    "2026-02-20": [{ id: 2, title: "Project Meeting", time: "10:00", description: "" }],
  };

  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultEvents;
    } catch (e) {
      return defaultEvents;
    }
  });

  // Modal / form state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(() => formatDate(new Date()));
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {}
  }, [events]);

  function formatDate(d) {
    if (!d) return "";
    const dd = new Date(d);
    return dd.toISOString().split("T")[0];
  }

  const selectedEvents = events[formatDate(date)] || [];

  function openModal() {
    setEventDate(formatDate(date));
    setTitle("");
    setTime("");
    setDescription("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function handleAddEvent(e) {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;
    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      time: time || "",
      description: description || "",
    };
    setEvents((prev) => {
      const key = formatDate(eventDate);
      const list = prev[key] ? [...prev[key], newEvent] : [newEvent];
      return { ...prev, [key]: list };
    });
    setShowModal(false);
  }

  return (
    <div className="calendar-page">
      <h1>Calendar</h1>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={({ date: d, view }) => {
          if (view !== "month") return null;
          return events[formatDate(d)] ? "has-event" : null;
        }}
      />

      <div className="events">
        <div className="events-header">
          <h2>Events for {date.toDateString()}</h2>
          <button className="add-event-btn" onClick={openModal} aria-label="Add event">+</button>
        </div>

        {selectedEvents.length > 0 ? (
          <ul className="events-list">
            {selectedEvents.map((ev) => (
              <li key={ev.id} className="event-item">
                <div className="event-main">
                  <strong>{ev.title}</strong>
                  {ev.time ? <span className="event-time"> — {ev.time}</span> : null}
                </div>
                {ev.description ? <div className="event-desc">{ev.description}</div> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p>No events for this day.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Event</h3>
            <form onSubmit={handleAddEvent} className="event-form">
              <label>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </label>

              <label>
                Date
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
              </label>

              <label>
                Time (optional)
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </label>

              <label>
                Description (optional)
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
